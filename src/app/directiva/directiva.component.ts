import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
  styleUrls: ['./directiva.component.css']
})
export class DirectivaComponent implements OnInit {

  public listaCurso: Array<string> = [
    'TypeScript',
    'JavaScript',
    'Java SE',
    'C#',
    'PHP'
  ];

  public habilitar: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  public setHabilitar(): void {
    this.habilitar = !this.habilitar;
  }

}