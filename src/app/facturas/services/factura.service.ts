import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Factura } from '../models/factura';

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
}
