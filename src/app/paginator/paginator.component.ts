import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, OnChanges {

    @Input() paginador: any;
    public paginas: Array<number> = [];
    public desde: number;
    public hasta: number;

    constructor() { }

    ngOnInit(): void {
        this.cargarPaginacion();
    }

    ngOnChanges(changes: SimpleChanges): void {
        let paginadorActualizado = changes['paginador'];
        if (paginadorActualizado.previousValue) {
            this.cargarPaginacion();
        }
    }

    private cargarPaginacion() {
        this.desde = Math.min(Math.max(1, this.paginador.number - 4), this.paginador.totalPages - 5);
        this.hasta = Math.max(Math.min(this.paginador.totalPages, this.paginador.number + 4), 5);
        if (this.paginador.totalPages > 5) {
            this.paginas = new Array(this.hasta - this.desde + 1).fill(0).map(
                (valor, indice) => {
                    return indice + this.desde;
                }
            );
        } else {
            this.paginas = new Array(this.paginador.totalPages).fill(0).map(
                (valor, indice) => {
                    return indice + 1;
                }
            );
        }
    }
}
