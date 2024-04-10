import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { LoginFailedComponent } from './login-failed/login-failed.component';
import { OverviewComponent } from './overview/overview.component';
import { ReportsComponent } from './reports/reports.component';

export const routes: Routes = [
    {
        path: '',
        component: OverviewComponent
    }, {
        path: 'reports',
        component: ReportsComponent,
    }, {
        path: 'login-failed',
        component: LoginFailedComponent,
    }
];
