import { Routes } from '@angular/router';;
import { LoginPageComponent } from './components/login-page/login-page.component'
import { CustomerMainPageComponent } from './components/customer-main-page/customer-main-page.component';
import { MedecinMainPageComponent } from './components/medecin-main-page/medecin-main-page.component';
import { AdminMainPageComponent } from './components/admin-main-page/admin-main-page.component';
import { SuperAdminMainPageComponent } from './components/superadmin-main-page/superadmin-main-page.component';

export const routes: Routes = [
    { path: "login/index", component: LoginPageComponent},
    { path: "customer/index", component: CustomerMainPageComponent},
    { path: "medecin/index", component: MedecinMainPageComponent},
    { path: "admin/index", component: AdminMainPageComponent},
    { path: "superadmin/index", component: SuperAdminMainPageComponent},
    { path: "", redirectTo: "/login/index", pathMatch: "full"}
];
