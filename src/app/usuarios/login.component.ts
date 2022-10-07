import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Usuario } from './usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public titulo: string = 'Iniciar Sesion';
  public usuario: Usuario;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      Swal.fire('Login', `Hola ${this.authService.usuario.nombre}, ya estas autenticado!!`, 'info');
      this.router.navigate(['/clientes']);
    }
  }

  public login() {
    if (!this.usuario.username || !this.usuario.password) {
      Swal.fire('Error Login', 'Username o Password vacias!', 'error');
      return;
    }
    this.authService.login(this.usuario).subscribe(
      (resp: Usuario | any) => {
        this.authService.guardarUsuario(resp.access_token);
        this.authService.guardarToken(resp.access_token);
        const usuario: Usuario = this.authService.usuario;
        this.router.navigate(['/clientes']);
        Swal.fire('Login', `Hola ${usuario.nombre}, has iniciado sesion con exito!!`, 'success');
      }, (error: any) => {
        if (error.status == 400) {
          Swal.fire('Error Login', 'Credenciales invalidas, Usuario o clave incorrectas!!', 'error');
        }
      }
    );
  }

}
