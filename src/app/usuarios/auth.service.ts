import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario: Usuario;
  private _token: string;

  constructor(
    private http: HttpClient
  ) { }

  public get token(): string {
    if (this._token) {
      return this._token;
    } else if (this._usuario == null && sessionStorage.getItem('token')) {
      this._token = sessionStorage.getItem('token') as string;
      return this._token;
    }
    return null;
  }

  public get usuario(): Usuario {
    if (this._usuario) {
      return this._usuario;
    } else if (this._usuario == null && sessionStorage.getItem('usuario')) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  login(usuario: Usuario): Observable<any> {
    const urlEndpoint: string = "http://localhost:8181/oauth/token";
    const credenciales: string = btoa('angularapp:12345');
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales
    });
    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);
    return this.http.post<any>(urlEndpoint, params.toString(), {headers: httpHeaders});
  }

  logout() {
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
  }

  obtenerDatosToken(access_token: String): any {
    if (access_token) {
      return JSON.parse(atob(access_token.split(".")[1]));
    }
    return null;
  }

  guardarToken(access_token: string): void {
    this._token = access_token;
    sessionStorage.setItem('token', this._token);
  }

  guardarUsuario(access_token: String): void {
    let objetoPayLoad: any = this.obtenerDatosToken(access_token);
    this._usuario = new Usuario();
    this._usuario.nombre = objetoPayLoad.nombre;
    this._usuario.apellido = objetoPayLoad.apellido;
    this._usuario.email = objetoPayLoad.email;
    this._usuario.roles = objetoPayLoad.authorities;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  isAuthenticated(): boolean {
    let objetoPayLoad: any = this.obtenerDatosToken(this.token);
    if(objetoPayLoad && objetoPayLoad.user_name && objetoPayLoad.user_name.length) {
      return true;
    }
    return false;
  }

  hasRole(role: string): boolean {
    if (this.usuario.roles.includes(role)) {
      return true;
    }
    return false;
  }
}
