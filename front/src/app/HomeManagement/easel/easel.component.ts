import { Component, OnInit, Input } from '@angular/core';
import { PieceSet } from 'src/app/SharedKernel/Piece';

@Component({
  selector: 'app-easel',
  templateUrl: './easel.component.html',
  styleUrls: ['./easel.component.scss']
})
export class EaselComponent implements OnInit {

  @Input('pieces') pieces: PieceSet[];
  
  constructor() { }

  ngOnInit() {
  }

}
