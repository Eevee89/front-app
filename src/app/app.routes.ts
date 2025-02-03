import { Routes } from '@angular/router';
import { CustomerLoginPageComponent } from './customer-components/customer-login-page/customer-login-page.component';
import { AdminLoginPageComponent } from './admin-components/admin-login-page/admin-login-page.component';
import { CustomerMainPageComponent } from './customer-components/customer-main-page/customer-main-page.component';

export const routes: Routes = [
    { path: "login/customers", component: CustomerLoginPageComponent},
    { path: "login/admin", component: AdminLoginPageComponent},
    { path: "customer/index", component: CustomerMainPageComponent},
    { path: "", redirectTo: "/login/customers", pathMatch: "full"}
];
