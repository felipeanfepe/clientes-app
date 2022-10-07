import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClientesService } from '../clientes.service';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { Region } from '../region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormClienteComponent implements OnInit {

  public cliente: Cliente = new Cliente;
  public titulo: string = 'Crear Cliente';
  public id: any = null;
  public regiones: Array<Region> = [];

  public errors: Array<string> = [];

  constructor(
    private _clientesServicce: ClientesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.cargarCliente();
  }

  public cargarCliente(): void {
      this.activatedRoute.params.subscribe(
          (params) => {
              const id = params['id'];
              this.id = id;
              if(this.id != null && this.id) {
                  this._clientesServicce.getCliente(id).subscribe((cliente: Cliente) => this.cliente = cliente);
              }
          }
      );
      this._clientesServicce.getRegiones().subscribe(
        (regiones: Array<Region>) => {
          this.regiones = regiones;
        }
      );
  }

  public create(): void {
    this.errors = [];
    if (this.id != null && this.id){
      this._clientesServicce.updateCliente(this.cliente, this.id).subscribe(
        (resp: Cliente) => {
          swal.fire(
            'Cliente Actualizado',
            `El cliente ${resp.nombre} ha sido actualizado con exito!`,
            'success'
          );
          this.router.navigateByUrl('/clientes');
        },
        (error: any) => {
          console.error(`Codigo de error => ${error.status}`);
          this.errors = error.error.errors as Array<string>;
        }
      );
    } else {
      this._clientesServicce.createCliente(this.cliente).subscribe(
        (resp: Cliente) => {
          swal.fire(
            'Nuevo CLiente',
            `El cliente ${resp.nombre} se creo con exito!`,
            'success'
          );
          this.router.navigateByUrl('/clientes');
        },
        (error: any) => {
          console.error(`Codigo de error => ${error.status}`);
          this.errors = error.error.errors as Array<string>;
        }
      );
    }
  }

  public compararRegion(region: Region, regionCompare: Region): boolean {
    if (region === undefined && regionCompare === undefined) {
      return true;
    }
    return (region && regionCompare) && (region.id === regionCompare.id) ? true : false;
  }
}
