import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

//COMPONENTS
import { RegistrarComponent } from './components/registrar/registrar.component';
import {LoginComponent } from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
import {ProfileComponent} from './components/profile/profile.component';
import {ContactsComponent} from './components/contacts/contacts.component';
import {TaskComponent} from './components/task/task.component';

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'registro', component: RegistrarComponent},
    {path: 'login', component: LoginComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'contacts', component: ContactsComponent},
    {path: 'tasks', component: TaskComponent},
    {path: '**', component: HomeComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
