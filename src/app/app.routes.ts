import { Routes } from '@angular/router';
import { CustomerLoginPageComponent } from './customer-components/customer-login-page/customer-login-page.component';
import { StaffLoginPageComponent } from './customer-components/login-page/login-page.component';
import { CustomerMainPageComponent } from './customer-components/customer-main-page/customer-main-page.component';
import { MedecinMainPageComponent } from './customer-components/medecin-main-page/medecin-main-page.component';
import { AdminMainPageComponent } from './customer-components/admin-main-page/admin-main-page.component';
import { SuperAdminMainPageComponent } from './customer-components/superadmin-main-page/superadmin-main-page.component';

export const routes: Routes = [
    { path: "login/customers", component: CustomerLoginPageComponent},
    { path: "login/staff", component: StaffLoginPageComponent},
    { path: "customer/index", component: CustomerMainPageComponent},
    { path: "medecin/index", component: MedecinMainPageComponent},
    { path: "admin/index", component: AdminMainPageComponent},
    { path: "superadmin/index", component: SuperAdminMainPageComponent},
    { path: "", redirectTo: "/login/customers", pathMatch: "full"}
];
