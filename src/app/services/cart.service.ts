import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CartItem } from '../models/cart-item';
import { cartUrl } from '../config/api';
import { Product } from '../models/product';
import { OrderItem } from '../models/order-item';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  ocultoPedido: string = "";
  constructor(private http: HttpClient, private router: Router) { }

  getCartItems(): Observable<OrderItem[]> {
    //TODO: Mapping the obtained result to our CartItem props. (pipe() and map())
    return this.http.get<OrderItem[]>(cartUrl+'/'+localStorage.getItem('carritoId')+'?token='+localStorage.getItem('token')).pipe(
      map((result: any) => {
        console.log(result.data);
        let cartItems: OrderItem[] = [];

        for (let item of result.data) {
          let productExists = false

          for (let i in cartItems) {
            if (cartItems[i].id === item.id) {
              cartItems[i].cantidad++
              productExists = true
              break;
            }
          }

          if (!productExists) {
            cartItems.push(new OrderItem(item.id, item.nombreProducto, item.cantidad, item.precio));
          }
        }
        console.log(cartItems);
        return cartItems;
      })
    );
  }

  addProductToCart(product: Product): Observable<any> {
    console.log('here');
    return this.http.post(cartUrl+'?token='+localStorage.getItem('token'), { productoId: product.id, carritoId: localStorage.getItem('carritoId'), cantidad:1});  
  }

  resetCart() {
    return this.http.delete(cartUrl+'/'+localStorage.getItem('carritoId')+'?token='+localStorage.getItem('token'));
  }

  ocultarModalPedido() {
    console.log('ocultar modal');
    this.ocultoPedido= '';
  }

  mostrarModalPedido(){
    this.router.navigate(['shop']);
    this.ocultoPedido = 'block';
    console.log('mostrar modal');
  }
}
