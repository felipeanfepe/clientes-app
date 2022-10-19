import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Factura } from './models/factura';
import { FacturaService } from './services/factura.service';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html',
  styleUrls: ['./detalle-factura.component.css']
})
export class DetalleFacturaComponent implements OnInit {

  public id: number = null;
  public factura: Factura;
  public titulo: string = "Factura";

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private facturaService: FacturaService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
          (params) => {
              const id = params['id'];
              this.id = id;
              if(this.id != null && this.id) {
                  this.facturaService.getFactura(this.id).subscribe(
                    (factura: Factura) => {
                      this.factura = factura;
                    }
                  );
              }
          }
      );
  }
}
