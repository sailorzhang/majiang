import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalLoadingService {

  private subject = new Subject<boolean>();

  constructor() { }

  instance$ = this.subject.asObservable();

  show() {
    this.subject.next(true)
  }

  hide() {
    this.subject.next(false)
  }
}
