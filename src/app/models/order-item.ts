

export class OrderItem {
    id: number;
    nombreProducto: string;
    cantidad: number;
    precio: number;
  
    constructor(productId: number, nombre: string, cantidad = 1, precio: number) {
      this.id = productId;
      this.nombreProducto = nombre;
      this.cantidad = cantidad;
      this.precio = precio;
    }
}
  