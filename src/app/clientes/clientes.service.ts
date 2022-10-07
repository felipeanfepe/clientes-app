import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { Cliente } from './cliente';
import { CLIENTES } from './clientes.json';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Region } from './region';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private urlEndPoint: string = 'http://localhost:8181/api';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  private isNoAutorizado(error): boolean{
    let retorno: boolean = false;
    if (error.status == 401 || error.status == 403) {
      this.router.navigate(['/login']);
      retorno = true;
    }
    return retorno;
  }

  getClientes(page: number = 1): Observable<any> {
    page = page - 1;
    return this.http.get(`${this.urlEndPoint}/clientes/page/${page}`).pipe(
          map(
              (resp: any) => {
                  resp.content = resp.content as Cliente[];
                  resp.content.map(
                      (cliente: Cliente) => {
                          cliente.nombre = cliente.nombre.toUpperCase();
                          cliente.apellido = cliente.apellido.toUpperCase();
                          cliente.email = cliente.email.toUpperCase();
                          let datePipe = new DatePipe('en-US');
                          cliente.createAt = datePipe.transform(cliente.createAt, 'dd/MM/yyyy');
                          return cliente;
                      }
                  );
                  return resp;
              }
          )
      );
  }

  getRegiones(): Observable<Array<Region>> {
    return this.http.get<Region[]>(`${this.urlEndPoint}/clientes/regiones`).pipe(
      catchError(
        (error: any) => {
          this.isNoAutorizado(error);
          return throwError(error);
        }
      )
    );
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/clientes/${id}`).pipe(
      catchError((error: any) => {
        if (this.isNoAutorizado(error)) {
          return throwError(error);
        }
        Swal.fire('Error al editar', error.error.mensaje, 'error');
        console.error(error.error.mensaje);
        this.router.navigateByUrl('/clientes');
        return throwError(error);
      })
    );
  }

  createCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post(`${this.urlEndPoint}/clientes`, cliente, {headers: this.httpHeaders}).pipe(
      map((resp: any) => resp.cliente as Cliente),
      catchError((error: any) => {
        if (this.isNoAutorizado(error)) {
          return throwError(error);
        }
        if (error.status == 400) {
          return throwError(error);
        }
        Swal.fire(error.error.mensaje, error.error.error, 'error');
        console.error(error.error.mensaje);
        return throwError(error);
      })
    );
  }

  updateCliente(cliente: Cliente, id: number): Observable<Cliente> {
    return this.http.put(`${this.urlEndPoint}/clientes/${id}`, cliente, {headers: this.httpHeaders}).pipe(
      map((resp: any) => resp.cliente as Cliente),
      catchError((error: any) => {
        if (this.isNoAutorizado(error)) {
          return throwError(error);
        }
        if (error.status == 400) {
          return throwError(error);
        }
        Swal.fire(error.error.mensaje, error.error.error, 'error');
        console.error(error.error.mensaje);
        return throwError(error);
      })
    );
  }

  deleteCliente(id: number):Observable<any> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/clientes/${id}`, {headers: this.httpHeaders}).pipe(
      catchError((error: any) => {
        if (this.isNoAutorizado(error)) {
          return throwError(error);
        }
        Swal.fire(error.error.mensaje, error.error.error, 'error');
        console.error(error.error.mensaje);
        return throwError(error);
      })
    );
  }

  subirFoto(archivo: File, id: number):Observable<HttpEvent<any>> {
    let formData: any = new FormData();
    formData.append("file", archivo);
    formData.append("id", id);
    const req = new HttpRequest('POST', `${this.urlEndPoint}/clientes/upload`, formData, {reportProgress: true});
    return this.http.request(req).pipe(
      catchError(
        (error: any) => {
          this.isNoAutorizado(error);
          return throwError(error);
        }
      )
    );
  }
}
