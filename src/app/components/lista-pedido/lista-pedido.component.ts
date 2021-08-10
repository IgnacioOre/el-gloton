import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { OrderItem } from 'src/app/models/order-item';
import { Pedido } from 'src/app/models/pedidos';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-lista-pedido',
  templateUrl: './lista-pedido.component.html',
  styleUrls: ['./lista-pedido.component.css']
})
export class ListaPedidoComponent implements OnInit {
  // Variables para no mostrar los datos antes de que terminen de cargar
  pedidosCargados:boolean= false;
  itemsCargados:boolean=false;

  // Pedidos rescatados de la base de datos
  pedidos : Pedido[] = []
  // Items pertenecientes al pedido seleccionado
  items : OrderItem[] = [];
  // Primera página de la paginación
  p = 1;
  
  // Inyecta el servicio PedidoService
  constructor(private pedidosService : PedidoService) { }
  
  // Cada vez que se abre el componente carga los pedidos
  ngOnInit() {
    this.getPedidos();
  }
  
  // Recupera los pedidos desde la base de datos con una llamada GET de parte del servicio PedidoService
  getPedidos() {
    this.pedidosService.getPedidos().subscribe((res:any) =>{
      this.pedidos = res.data;
      this.pedidosCargados = true;
    });
  }
  
  // Recupera los datos de los productos del pedido seleccionado
  listaProductos(id : number) {
    this.itemsCargados = false;
    this.pedidosService.getProductosPedido(id).subscribe((res:any) => {
      this.items = res.data;
      this.itemsCargados = true;
    });
  }

}
