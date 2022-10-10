import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClientesService } from './clientes.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ModalService } from './detalle/modal.service';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  public clientes: Array<Cliente> = [];
  public clienteSeleccionado: Cliente = null;
  public paginador: any;

  constructor(
    private _clientesServicce: ClientesService,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public modalServices: ModalService
  ) { }

  ngOnInit(): void {
      this.cargarClientes();
  }

  public cargarClientes() {
      let page: number = 1;
      this.activatedRoute.paramMap.subscribe(
          (params) => {
              if (params.get('page') != null && params.get('page') != undefined) {
                  page = +params.get('page');
              }
              this._clientesServicce.getClientes(page).subscribe(
                  (resp: any) => {
                     this.clientes = resp.content as Array<Cliente>;
                     this.paginador = resp;
                  }
              );
          }
      );
  }

  public editar(id: any) {
    this.router.navigate(['/clientes/edit', id]);
  }

  public delete(cliente: Cliente) {
    Swal.fire({
      title: `¿Esta seguro que quiere eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Si, eliminar!',
      denyButtonText: `No, calcelar!`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this._clientesServicce.deleteCliente(cliente.id).subscribe(
          (resp: any) => {
            this.clientes = this.clientes.filter(cli => cli !== cliente);
            Swal.fire(
              'Cliente Eliminado',
              `El cliente ${cliente.nombre} ${cliente.apellido} ha sido eliminado con exito!`,
              'success'
            );
          }
        );
      }
    });
  }

  public ablirModal(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.modalServices.abrirModal();
  }
}
