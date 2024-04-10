import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http'
import { Observable, throwError } from "rxjs";
import { catchError, mergeMap } from "rxjs/operators";
import { GlobalLoadingService } from "../service/global-loading.service";
import { ToastService } from "ng-devui";

@Injectable({
    providedIn: 'root'
})
export class LoadingInterceptor implements HttpInterceptor {

    private count: number = 0;

    constructor(private globalLoadingService: GlobalLoadingService, private toastService: ToastService) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = this.handleRequest(req);
        this.count++;
        this.globalLoadingService.show();
        return next.handle(req).pipe(
            catchError(error => {
                this.toastService.open({
                    value: [{ severity: 'error', content: '发生错误导致失败' }],
                });
                this.hideLoading();
                return throwError(() => error)
            }),
            mergeMap(evt => this.handleResponse(evt))
        );
    }

    /**
     * 请求参数拦截处理
     */
    handleRequest(req: any) {
        return req;
    }

    /**
     * 返回结果拦截处理
     */
    handleResponse(evt: any) {
        return new Observable<HttpEvent<any>>(observer => {
            if (evt instanceof HttpResponse) {
              this.hideLoading();
            }
            observer.next(evt);
        });
    }

    private hideLoading() {
      this.count--;
      if (this.count === 0) {
          this.globalLoadingService.hide();
      }
    }
}
