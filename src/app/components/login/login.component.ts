import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  // Formulario
  formLogin: FormGroup;
  
  // Inyecta el servicio LoginService, el FormBuilder para el formulario, y el Router para redirigir
  constructor(private loginService: LoginService, private formBuilder: FormBuilder, private router : Router) { 
    // Inicializa el formulario en blanco
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
  }
  
  // Envia los datos de login al backend, si los datos coinciden devuelve un token, el cual es utilizado para las llamadas que requieren autenticación
  login() {
    this.loginService.login(this.formLogin.value.email, this.formLogin.value.password).subscribe((res: any) => {
      console.log(res);
    });

  }

}
