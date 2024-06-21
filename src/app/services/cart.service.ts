import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemCount = new BehaviorSubject<number>(0);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.updateCartItemCount();
    }
  }

  addToCart(product: any) {
    if (this.isBrowser) {
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');

      const existingProduct = cart.find((item: any) => item.id === product.id);

      if (existingProduct) {
        existingProduct.cantidad++;
      } else {
        cart.push({ ...product, cantidad: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      this.updateCartItemCount();
    }
  }

  private updateCartItemCount() {
    if (this.isBrowser) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((total: number, item: any) => total + item.cantidad, 0);
      this.cartItemCount.next(count);
    }
  }

  getCartItemCount() {
    return this.cartItemCount.asObservable();
  }
}
