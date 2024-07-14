import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { CartComponent } from './components/cart/cart.component';
import { RegistrarmeComponent } from './components/registrarme/registrarme.component';
import { LoginComponent } from './components/login/login.component';
import { RecuperarPasswordComponent } from './components/recuperar-password/recuperar-password.component';
import { ManagerUsersComponent } from './components/manager-users/manager-users.component';
import { ModificarPerfilComponent } from './components/modificar-perfil/modificar-perfil.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'contacto', component: ContactoComponent },
    { path: 'cart', component: CartComponent },

    { path: 'registrarme', component: RegistrarmeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'recuperar-password', component: RecuperarPasswordComponent },
    { path: 'manager-users', component: ManagerUsersComponent },
    { path: 'modificar-perfil', component: ModificarPerfilComponent },
    { path: 'pedidos', component: PedidosComponent },

    
    { path: '', redirectTo: '', pathMatch: 'full' },
];