import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component'
import { LoginComponent } from './components/login/login.component'
import { PageNotFoundComponent } from './components/shared/page-not-found/page-not-found.component'
import { ProductosComponent } from './components/productos/productos.component'
import { Pedido } from './models/pedidos'
import { PedidoComponent } from './components/shopping-cart/pedido/pedido.component'
import { ListaPedidoComponent } from './components/lista-pedido/lista-pedido.component'
import { RegistroComponent } from './components/registro/registro.component'
import { LoggedInGuard } from './logged-in.guard'

const routes: Routes = [
  { path: '', redirectTo: '/shop', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'shop', component: ShoppingCartComponent },
  { path: 'productos', component: ProductosComponent, canActivate: [LoggedInGuard]},
  { path: 'crear-pedido', component: PedidoComponent},
  { path: 'pedidos', component: ListaPedidoComponent, canActivate: [LoggedInGuard]},
  { path: '**', component: PageNotFoundComponent },
  
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {

}
