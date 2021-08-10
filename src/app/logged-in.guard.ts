import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './services/login.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

  constructor(private loginService : LoginService, private router : Router) {}

  canActivate() {
    if (this.loginService.loggedIn() && localStorage.getItem('rol') == "Trabajador" ) {
      return true;
    } else {
      this.router.navigate(['/shop']);
      return false;
    }
  }
  
}
