import { Cliente } from "./cliente";
import { Product } from "./product";

export class Pedido {
  pedidoId : number;
  tipoPago : string;
  tipoEntrega : string;
  direccion : string;
  total : number; 
}
  