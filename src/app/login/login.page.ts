import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(private router: Router, private authService: AuthService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      user: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { user, password } = this.loginForm.value;
      if (this.authService.login(user, password)) {
        console.log("Inicio de sesión exitoso");
        this.router.navigate(['/home']);
      } else {
        alert('Credenciales inválidas');
      }
    } else {
      alert('Por favor, completa todos los campos correctamente.');
    }
  }
}
