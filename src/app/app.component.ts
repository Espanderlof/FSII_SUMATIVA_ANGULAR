import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet, RouterLinkActive } from '@angular/router';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { DataInitializationService } from './services/data-initialization.service';
import { Subscription } from 'rxjs';

/**
 * @description 
 * Componente principal de la aplicación.
 * Contiene la barra de navegación, el router outlet y el footer.
 */
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
  /** Título de la aplicación */
  title = 'albavets';

  /** Contador de items en el carrito */
  cartItemCount: number = 0;

  /** Usuario actualmente logueado */
  usuarioActual: any = null;

  /** Suscripción al observable del usuario actual */
  private userSubscription: Subscription | undefined;

  /**
   * Constructor del componente
   * @param cartService Servicio para manejar el carrito
   * @param authService Servicio de autenticación
   * @param dataInitService Servicio de inicialización de datos
   */
  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private dataInitService: DataInitializationService
  ) {}

  /** Método de inicialización del componente */
  ngOnInit() {
    this.dataInitService.initializeData().then(() => {
      this.cartService.getCartItemCount().subscribe(count => {
        this.cartItemCount = count;
      });
      
      this.userSubscription = this.authService.getUsuarioActualObservable().subscribe(usuario => {
        this.usuarioActual = usuario;
      });
    });
  }

  /** Método que se ejecuta al destruir el componente */
  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  /** Método para cerrar sesión */
  logout() {
    this.authService.logout();
  }

  /**
   * Método para verificar si el usuario es administrador
   * @returns {boolean} Verdadero si el usuario es administrador, falso en caso contrario
   */
  esAdministrador(): boolean {
    return this.authService.esAdministrador();
  }
}
