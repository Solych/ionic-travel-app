import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent implements OnInit {

  @Input() data: any[];
  @Input() index: number;
  @Output() changeIndex = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {}

  previous() {
    if (!this.index) {
      return;
    }
    this.changeIndex.emit(this.index - 1);
  }

  next() {
    if (this.index === this.data.length - 1) {
      return;
    }
    this.changeIndex.emit(this.index + 1);
  }

}
