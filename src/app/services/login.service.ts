
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public logueado : boolean;

  constructor(private http: HttpClient, private router : Router) { }

  login(email: string, password: string) {
    let userLogin = {email: email, password: password};
    return this.http.post('http://localhost:3000/login', userLogin).pipe(map((res: any) => {
      console.log(res);
      localStorage.setItem('token', res.token);
      localStorage.setItem('usuario', JSON.stringify(res.usuario));
      localStorage.setItem('rol', res.usuario.userRol);
      localStorage.setItem('carritoId', res.carritoId);
      localStorage.setItem('userId', res.id)
      this.logueado = true;
      this.router.navigate(['shop']);
    }));
  }

  getNombre() : string {
    return JSON.parse(localStorage.getItem('usuario')).userName;
  }
  
  getRol() : string {
    return localStorage.getItem('rol');
  }

  loggedIn() {
    return localStorage.getItem('token') !== null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    localStorage.removeItem('carritoId');
    localStorage.removeItem('userId');
    this.logueado = false;
    this.router.navigate(['login']);
  }

  registrarse(usuario: Cliente){
    return this.http.post('http://localhost:3000/user', usuario).pipe(map((res: any) => {
      console.log(res);
     
    }));
  }
  recuperarPassword(usuario: Cliente){
    return this.http.post('http://localhost:3000/recuperarPassword', usuario).pipe(map((res: any) => {
      console.log(res);
      
    }));
  }
}