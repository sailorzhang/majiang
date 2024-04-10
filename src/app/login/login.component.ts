import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { ButtonModule } from 'ng-devui';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  get isLogin() {
    return this.authService.instance.getAllAccounts().length > 0;
  }

  constructor(public authService: MsalService) {
    
  }
}
