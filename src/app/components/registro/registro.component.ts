import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from 'src/app/models/cliente';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  // Formulario
  formUsuario: FormGroup;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService) {
    // Inicializa el formulario
    this.formUsuario = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  registrarse() {
    var usuario: Cliente = this.formUsuario.value;
    console.log(usuario);
    this.loginService.registrarse(usuario).subscribe(res => {
      console.log(res);
      this.formUsuario = this.formBuilder.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required]],
        password: ['', [Validators.required]]
      });
    })
  }

}
