import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

      return next.handle(req).pipe(
        catchError(
          (error) => {
            if (error.status == 401) {
              if (this.authService.isAuthenticated()) {
                this.authService.logout();
              }
              this.router.navigate(['/login']);
            }
            if (error.status == 403) {
              Swal.fire('Acceso denegado', `Hola ${this.authService.usuario.nombre} no tienes acceso a este recurso!!`, 'warning');
              this.router.navigate(['/clientes']);
            }
            return throwError(error);
          }
        )
      );
    }
}
