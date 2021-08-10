import { Product } from './product';

export class CartItem {
  productId: number;
  carritoId: number;
  cantidad: number;

  constructor(productId: number, carritoId: number, cantidad = 1) {
    this.productId = productId;
    this.carritoId = carritoId;
    this.cantidad = cantidad;
  }
}
