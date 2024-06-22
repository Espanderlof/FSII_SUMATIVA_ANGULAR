import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { CartComponent } from './components/cart/cart.component';
import { RegistrarmeComponent } from './components/registrarme/registrarme.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'contacto', component: ContactoComponent },
    { path: 'cart', component: CartComponent },

    { path: 'registrarme', component: RegistrarmeComponent },
    { path: 'login', component: LoginComponent },

    
    { path: '', redirectTo: '', pathMatch: 'full' },
];