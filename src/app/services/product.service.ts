import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { productsUrl } from 'src/app/config/api';

import { Product } from 'src/app/models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProductos(): Observable<Product[]> {
    return this.http.get<Product[]>("http://localhost:3000/producto/");
  }

  addProducto(producto : Product) {
    return this.http.post("http://localhost:3000/producto?token="+localStorage.getItem('token'), producto);
  }

  editProducto(producto : Product) {
    return this.http.put("http://localhost:3000/producto?token="+localStorage.getItem('token'), producto);
  }

  deleteProducto(producto : Product) {
    return this.http.delete("http://localhost:3000/producto/"+producto.id+"?token="+localStorage.getItem('token'));
  }
}
