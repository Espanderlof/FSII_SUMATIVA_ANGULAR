import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { JsonService } from '../../services/json.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {
  pedidos: any[] = [];
  usuarioActual: any;
  cargando: boolean = true;
  error: string | null = null;

  constructor(
    private jsonService: JsonService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuarioActual = this.authService.getUsuarioActual();
    if (this.usuarioActual) {
      this.cargarPedidos();
    } else {
      this.error = 'Debes iniciar sesión para ver tus pedidos.';
      this.cargando = false;
      // Opcionalmente, redirigir al usuario a la página de inicio de sesión
      // this.router.navigate(['/login']);
    }
  }

  /**
   * Carga los pedidos del usuario actual
   */
  cargarPedidos(): void {
    this.jsonService.getJsonPedidosData().subscribe(
      (data: any[]) => {
        this.pedidos = data.filter(pedido => pedido.usuario === this.usuarioActual.email);
        this.cargando = false;
      },
      error => {
        console.error('Error al cargar los pedidos', error);
        this.error = 'Hubo un error al cargar los pedidos. Por favor, intenta de nuevo más tarde.';
        this.cargando = false;
      }
    );
  }
}