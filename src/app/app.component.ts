import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet, RouterLinkActive } from '@angular/router';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { DataInitializationService } from './services/data-initialization.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterModule,
    RouterLinkActive
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'albavets';
  cartItemCount: number = 0;
  usuarioActual: any = null;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private dataInitService: DataInitializationService
  ) {}

  ngOnInit() {
    this.dataInitService.initializeData().then(() => {
      this.cartService.getCartItemCount().subscribe(count => {
        this.cartItemCount = count;
      });
      const usuario = this.authService.getUsuarioActual();
      if (usuario) {
        this.usuarioActual = usuario;
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  // Método para verificar si el usuario es administrador
  esAdministrador(): boolean {
    return this.authService.esAdministrador();
  }
}
