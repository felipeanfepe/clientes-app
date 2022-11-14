import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { flatMap, map, Observable, startWith } from 'rxjs';
import Swal from 'sweetalert2';
import { Cliente } from '../clientes/cliente';
import { ClientesService } from '../clientes/clientes.service';
import { Factura } from './models/factura';
import { ItemFactura } from './models/item-factura';
import { Producto } from './models/producto';
import { FacturaService } from './services/factura.service';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  public titulo: string = "Nueva Factura";
  public cliente: Cliente;
  public factura: Factura = new Factura();
  autocompleteControl = new FormControl('');
  productos: Array<Producto> = [];
  productosFiltrados: Observable<Array<Producto>>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private facturaService: FacturaService,
    private clienteService: ClientesService
  ) { }

  ngOnInit(): void {
    this.productosFiltrados = this.autocompleteControl.valueChanges.pipe(
      map(value => typeof value === 'string' ? value : value?.nombre),
      flatMap(value => value ? this._filter(value || '') : []),
    );
    this.activatedRoute.params.subscribe(
        (params) => {
            const cliente_id = params['cliente_id'];
            if(cliente_id!= null && cliente_id) {
                this.clienteService.getCliente(cliente_id).subscribe(
                  (cliente: Cliente) => {
                    this.cliente = cliente;
                    this.factura.cliente = this.cliente;
                    console.log(this.factura);
                  }
                );
            }
        }
    );
  }

   private _filter(value: string): Observable<Array<Producto>> {
    const filterValue = value.toLowerCase();
    return this.facturaService.filtrarProductos(filterValue);
  }

  public mostrarNombre(producto?: Producto): string | undefined {
    return producto?.nombre;
  }

  public seleccionarProducto(event: MatAutocompleteSelectedEvent) {
    let producto: Producto = event.option.value as Producto;
    if (this.existeItem(producto.id)) {
      this.incrementaCantidad(producto.id);
    } else {
      let nuevoItem: ItemFactura = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }
    this.autocompleteControl.reset();
    event.option.focus();
    event.option.deselect();
  }

  public actualisarCantidad(id: number, event: any){
    let cantidad: number = event.target.value as number;
    if (cantidad <= 0) {
      return this.eliminarItemFactura(id);
    }
    this.factura.items = this.factura.items.map(
      (item: ItemFactura) => {
        if (id === item.producto.id) {
          item.cantidad = cantidad;
        }
        return item;
      }
    );
  }

  public existeItem(id: number): boolean {
    let existe: boolean = false;
    this.factura.items.forEach(
      (item: ItemFactura) => {
        if (id === item.producto.id) {
          existe = true;
        }
      }
    );
    return existe;
  }

  public incrementaCantidad(id: number):void {
    this.factura.items = this.factura.items.map(
      (item: ItemFactura) => {
        if (id === item.producto.id) {
          ++item.cantidad;
        }
        return item;
      }
    );
  }

  public eliminarItemFactura(id: number) {
    this.factura.items = this.factura.items.filter(
      (item: ItemFactura) => id !== item.producto.id);
  }

  public guardar(frmFactura: any) {
    if (frmFactura.invalid) {
      Swal.fire(
          this.titulo,
          `Existen campos requeridos sin diligenciar.`,
          'info'
        );
      return;
    }
    if (!this.factura.items.length) {
      this.autocompleteControl.setErrors({'invalid': true});
      Swal.fire(
          this.titulo,
          `Debe agregar almenos una linea a la factura.`,
          'info'
        );
      return;
    }
    this.facturaService.guardarFactura(this.factura).subscribe(
      (factura: Factura) => {
        Swal.fire(
          this.titulo,
          `La Factura ${factura.descripcion} ha sido creada con exito!`,
          'success'
        );
        this.router.navigate(['/clientes']);
      }
    );
  }
}
