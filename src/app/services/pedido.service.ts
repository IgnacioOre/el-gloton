import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item';
import { OrderItem } from '../models/order-item';
import { Pedido } from '../models/pedidos';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  

  constructor(private http : HttpClient, private cartService : CartService) { }

  addPedido(pedido : Pedido) {
    return this.http.post("http://localhost:3000/pedido?token="+localStorage.getItem('token'), pedido);
  }

  getPedidos() {
    return this.http.get("http://localhost:3000/pedido?token="+localStorage.getItem('token'));
  }

  getProductosPedido(id : number) {
    return this.http.get("http://localhost:3000/pedido/"+id+"?token="+localStorage.getItem('token'));
  }

  addItemsPedido(items : OrderItem[], id : number) {
    var array : Observable<OrderItem>[] = [];
    var response;
    // Se ejecutan las peticiones, una por cada receta
    for (var i=0;i<items.length;i++) {
      response = this.http.post("http://localhost:3000/detalle-pedido?token="+localStorage.getItem('token'), {pedidoId: id, productoId:items[i].id, cantidad: items[i].cantidad});
      array.push(response);
    }
    return forkJoin(array);
    // Se utiliza la función forkJoin, que transforma el arreglo de Observable<Recipe>[] en Observable<Recipe[]>, y se retorna el arreglo.
  }

}
