import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product';
import { LoginService } from 'src/app/services/login.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  // Variables para no mostrar los datos antes de que terminen de cargar
  productosCargados:boolean= false;
  productos: Product[] = [];
  // Paginación
  p: number = 1;
  // Rol del usuario actual, puede ser 'Trabajador' o 'Usuario'
  rol : string = "";
  
  // ID del producto seleccionado para editar
  idEdit : number = 0;
  // Formulario
  formProducto : FormGroup;
  
  constructor(public productosService: ProductService,
    public loginService: LoginService, public formBuilder : FormBuilder) {
      // Inicializa el formulario en blanco
      this.formProducto = this.formBuilder.group({
        nombreProducto: ['', [Validators.required]],
        precio: [0,[Validators.required]],
      });

    }

  ngOnInit(): void {
    // Obtiene los productos y el rol del usuario al iniciar el componente
    this.getProductos();
    console.log(this.productos);
    if (localStorage.getItem('rol') != null) {
      this.rol = localStorage.getItem('rol')!;
    }
  }

  // Obtiene los productos desde el servicio
  getProductos() {
    this.productosService.getProductos().subscribe((res:any) => {
      this.productos = res.data;
      console.log(this.productos);
      // Cuando productosCargados es true, los datos estan listos y se despliegan en el frontend
      this.productosCargados = true;
    });
  }
  
  // Agrega un producto con los datos del formulario, resetea el formulario para poder agregar productos nuevos
  agregarProducto() {
    var producto : Product = this.formProducto.value;
    this.formProducto = this.formBuilder.group({
      nombreProducto: ['', [Validators.required]],
      precio: [0,[Validators.required]],
    });
    this.productosService.addProducto(producto).subscribe(res => {
      this.getProductos();
    });
  }

  // Rescata los datos del producto y los despliega en el formulario
  editarProducto(producto : Product) {
    this.idEdit = producto.id;
    this.formProducto = this.formBuilder.group({
      nombreProducto: [producto.nombreProducto, [Validators.required]],
      precio: [producto.precio,[Validators.required]]
    });
  }
  
  // Una vez editados los datos en el formulario, guarda los cambios en la base de datos
  guardarEditarProducto() {
    var producto : Product = this.formProducto.value;
    producto.id = this.idEdit;
    this.productosService.editProducto(producto).subscribe(res => {
      this.getProductos();
      this.formProducto = this.formBuilder.group({
        nombreProducto: ['', [Validators.required]],
        precio: [0,[Validators.required]],
      });
    })
  }
  
  // Elimina el producto seleccionado
  borrarProducto(producto : Product) {
    this.productosService.deleteProducto(producto).subscribe(res => {
      this.getProductos();
    })
  }
  

}
