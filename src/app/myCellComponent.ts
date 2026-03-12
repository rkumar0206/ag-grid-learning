import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from "ag-grid-community";

@Component({
  standalone: true,
  template: `<button (click)="buttonClicked()">+</button>{{value}}`
})
export class MyCellComponent implements ICellRendererAngularComp {

  public value!: String;

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.value = params.value;
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return true;
  }

  buttonClicked() {
    alert('clicked');
  }

}
