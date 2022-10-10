import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../usuarios/auth.service';
import Swal from 'sweetalert2';
import { Cliente } from '../cliente';
import { ClientesService } from '../clientes.service';
import { ModalService } from './modal.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() public cliente: Cliente;
  @Output() renderisar: any = new EventEmitter<boolean>();
  public titulo: string = "Detalle del Cliente";
  private foto: File;
  public progreso: number = 0;

  constructor(
    private _clienteService: ClientesService,
    public authService: AuthService,
    public modalServices: ModalService
  ) { }

  ngOnInit(): void {
  }

  public seleccionarFoto(foto: any) {
    this.foto = foto.target.files[0];
    this.progreso = 0;
    console.log(this.foto);
    if (this.foto.type.indexOf('image') < 0) {
      Swal.fire(
        'Error seleccionar imagen:',
        `Debe ser de tipo imagen!`,
        'error'
      );
      this.foto = null;
    }
  }

  public subirFoto() {
    if (!this.foto) {
      Swal.fire(
        'Error Upload:',
        `Debe seleccionar una foto!`,
        'error'
      );
    } else {
        this._clienteService.subirFoto(this.foto, this.cliente.id).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progreso = Math.round((event.loaded/event.total) * 100);
            } else if (event.type === HttpEventType.Response) {
              let response: any = event.body;
              this.cliente = response.cliente as Cliente;
              Swal.fire(
                'Se subio la foto',
                response.mensaje,
                'success'
              );
              this.renderisar.emit(true);
              //this.progreso = 0;
            }
          },
          (error: any) => {
            console.error(`Codigo de error => ${error.status}`);
          }
        );
    }
  }

  public cerrarModal() {
    this.cliente = null;
    this.foto = null;
    this.progreso = 0;
    this.modalServices.cerrarModal();
  }
}
