import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Factura } from '../models/factura';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private urlEndPoint: string = "http://localhost:8181/api/facturas";

  constructor(
    private http: HttpClient
  ) { }

  public getFactura(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.urlEndPoint}/${id}`);
  }

  public delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlEndPoint}/${id}`);
  }

  public filtrarProductos(termino: string): Observable<Array<Producto>> {
    return this.http.get<Array<Producto>>(`${this.urlEndPoint}/filtrar-productos/${termino}`);
  }

  public guardarFactura(factura: Factura): Observable<Factura> {
    return this.http.post<Factura>(this.urlEndPoint, factura);
  }
}
