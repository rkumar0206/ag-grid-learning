import { Component } from '@angular/core';
import { IFilterAngularComp } from 'ag-grid-angular';
import {IFilterParams} from 'ag-grid-community';

@Component({
  standalone: true,
  template: `
    <div style="padding: 10px; display: flex; flex-direction: column; gap: 5px;">
      <b>Status Filter</b>
      <select (change)="onStatusChange($event)">
        <option value="all">Show All</option>
        <option value="success">Success Only</option>
        <option value="failure">Failure Only</option>
      </select>
    </div>
  `
})
export class StatusFilter implements IFilterAngularComp {

  private params!: IFilterParams;
  private currentValue: string = 'all';

  // Getting access to the Grid API and callbacks.
  agInit(params: IFilterParams): void {
    this.params = params;
  }

  // The actual "If" statement that hides or shows rows.
  doesFilterPass(params: any): boolean {
    const val = params.data.successful;
    if (this.currentValue === 'success') return val === true;
    if (this.currentValue === 'failure') return val === false;
    return true;
  }

  // Controlling the filter icon
  isFilterActive(): boolean {
    return this.currentValue !== 'all';
  }

  onStatusChange(event: any) {
    this.currentValue = event.target.value;
    this.params.filterChangedCallback();
  }

  // Exporting and importing the filter's state.
  getModel() { return { value: this.currentValue }; }
  setModel(model: any) { this.currentValue = model ? model.value : 'all'; }
}
