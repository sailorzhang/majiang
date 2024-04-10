import { GlobalLoadingService } from './service/global-loading.service';
import { Component, Inject, OnInit, Self, SkipSelf, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Observable, Subject, connectable, filter, from, interval, share, takeUntil, tap } from 'rxjs';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { EventMessage, InteractionStatus, RedirectRequest, EventType } from '@azure/msal-browser';
import { HttpClient } from '@angular/common/http';
import { ButtonModule, LoadingModule, LoadingService } from 'ng-devui';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, ButtonModule, LoginComponent, LoadingModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: []
})
export class AppComponent implements OnInit {
  title = 'majiang';
  private readonly _destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    public authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private http: HttpClient,
    private loadingService: LoadingService,
    private globalLoadingService: GlobalLoadingService) { }

  @ViewChild('globalLoadingTemplate', { static: true }) globalLoadingTemplate?: TemplateRef<any>;
  loading: any;
  open: boolean = false;

  ngOnInit(): void {

    this.authService.handleRedirectObservable().subscribe();
    this.authService.instance.enableAccountStorageEvents(); // Optional - This will enable ACCOUNT_ADDED and ACCOUNT_REMOVED events emitted when a user logs in or out of another tab or window
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.ACCOUNT_ADDED || msg.eventType === EventType.ACCOUNT_REMOVED),
      )
      .subscribe((result: EventMessage) => {
        if (this.authService.instance.getAllAccounts().length === 0) {
          window.location.pathname = "/";
        }
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.checkAndSetActiveAccount();
      });

    this.globalLoadingService.instance$.subscribe(isOpen => {
      if (isOpen && !this.open) {
        this.loading = this.loadingService.open({
          loadingTemplateRef: this.globalLoadingTemplate
        });
        this.open = true;
      } else if (!isOpen && this.open) {
        this.loading?.loadingInstance?.close();
        this.open = false;
      }
    })

  }

  checkAndSetActiveAccount() {
    /**
     * If no active account set but there are accounts signed in, sets first account to active account
     * To use active account set here, subscribe to inProgress$ first in your component
     * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
     */
    let activeAccount = this.authService.instance.getActiveAccount();
    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }

  loginRedirect() {
    this.authService.loginRedirect();
  }

  logout() {
    this.authService.logoutRedirect();
  }

}
