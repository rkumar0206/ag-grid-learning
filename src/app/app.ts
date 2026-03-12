import {Component, signal} from '@angular/core';
import {AgGridModule} from 'ag-grid-angular';
import {ColDef, GridReadyEvent, ModuleRegistry, themeQuartz} from 'ag-grid-community';
import {AllEnterpriseModule} from 'ag-grid-enterprise';
import {every, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AsyncPipe} from '@angular/common';

ModuleRegistry.registerModules([AllEnterpriseModule])

@Component({
  selector: 'app-root',
  imports: [AgGridModule, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  public rowData!: Observable<any[]>;

  constructor(private http: HttpClient) {
  }

  myTheme = themeQuartz.withParams({
    foregroundColor: 'rgb(14, 100, 15)',
    backgroundColor: 'rgb(241, 247, 255)',
    headerBackgroundColor: 'rgb(220, 230, 240)',
    rowHoverColor: 'rgba(14, 100, 15, 0.1)',
  });

  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
    filter: true,
    sortable: true,
    resizable: true,
    enableRowGroup: true,
  };

  readonly colDefs = signal<ColDef[]>([
    { field: 'athlete', filter: true },
    { field: 'age' },
    { field: 'country' },
    { field: 'year'},
    { field: 'date', filter: 'agDateColumnFilter' },
    { field: 'sport' },
    {
      field: 'gold',
      aggFunc: 'sum', // Enterprise: sums medals in group rows
      valueFormatter: p => p.value ?? 0
    },
    {
      field: 'silver',
      aggFunc: 'sum',
      valueFormatter: p => p.value ?? 0
    },
    {
      field: 'bronze',
      aggFunc: 'sum',
      valueFormatter: p => p.value ?? 0
    },
    {
      field: 'total',
      aggFunc: 'sum',
      valueFormatter: p => p.value ?? 0,
      cellStyle: { fontWeight: 'bold' }
    }
  ]);

  onGridReady($event: GridReadyEvent<any>) {
    this.rowData = this.http.get<any[]>('https://www.ag-grid.com/example-assets/olympic-winners.json')
  }

  protected readonly every = every;
}
