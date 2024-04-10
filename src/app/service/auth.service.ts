import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private authService: MsalService) { }

  isAdmin() : boolean {
    const activateAccount = this.authService.instance.getActiveAccount();
    if (!activateAccount) {
      return false;
    }

    const roles = activateAccount.idTokenClaims?.roles;
    if(!roles || roles?.length === 0) {
      return false;
    }
    
    return roles?.indexOf('admin')! >= 0;
  }
}
