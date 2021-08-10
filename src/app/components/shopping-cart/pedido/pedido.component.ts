import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderItem } from 'src/app/models/order-item';
import { Pedido } from 'src/app/models/pedidos';
import { CartService } from 'src/app/services/cart.service';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {
  
  items : OrderItem[] = [];
  formPedido : FormGroup;
  cartTotal = 0;
  constructor(public cartService : CartService, private formBuilder : FormBuilder, public router : Router, private pedidoService : PedidoService) { 
    this.formPedido = this.formBuilder.group({
      tipoPago: ['', [Validators.required]],
      tipoEntrega: ['',[Validators.required]],
      direccion: ['',[]]
    });
  }

  ngOnInit() {
    this.cartService.getCartItems().subscribe(res => {
      this.items = res;
      console.log(this.items);
    });
  }

  ngOnChanges() {
    this.cartService.getCartItems().subscribe(res => {
      this.items = res;
      console.log(this.items);
    });
  }

  generarPedido() {
    var pedido : Pedido = this.formPedido.value;
    pedido.total = this.calcCartTotal();
    this.pedidoService.addPedido(pedido).subscribe((res:any)=> {
      var id = res.pedido.insertId;
      this.pedidoService.addItemsPedido(this.items, id).subscribe((res:any)=> {
        console.log(res);
        this.cartService.resetCart().subscribe(res => {});
      })
    });
  }

  calcCartTotal() : number {
    this.cartTotal = 0
    this.items.forEach(item => {
      console.log(item.precio);
      this.cartTotal += item.precio * item.cantidad;
    })
    console.log(this.cartTotal);
    return this.cartTotal;
  }

}
