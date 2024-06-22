import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  total: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems() {
    this.cartItems = this.cartService.getCartItems();
    this.updateTotal();
  }

  updateCartItemQuantity(item: CartItem) {
    this.cartService.updateCartItemQuantity(item.id, item.cantidad);
    this.updateTotal();
  }

  removeCartItem(productId: number) {
    this.cartService.removeCartItem(productId);
    this.loadCartItems();
  }

  private updateTotal() {
    this.total = this.cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  }
}
