import {Component, signal} from '@angular/core';
import {AgGridModule} from 'ag-grid-angular';
import {AllCommunityModule, ColDef, GridReadyEvent, ModuleRegistry, themeQuartz} from 'ag-grid-community';
import {every, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AsyncPipe} from '@angular/common';
import {MyCellComponent} from './myCellComponent';

ModuleRegistry.registerModules([AllCommunityModule])

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

  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
    floatingFilter: true,
    editable: true,
  }

  pagination = true
  paginationPageSize = 15;
  paginationPageSizeSelector = [15, 20, 25]

  rowCellRules = {
    'red-row': (p: any) => p.data.make == "Toyota"
  }

  readonly colDefs = signal<ColDef[]>([
    {
      field: 'make',
      headerName: "Company",
      cellRenderer: MyCellComponent,
      flex: 2,
      cellEditor: "agSelectCellEditor", // cell editor provided by ag, used for adding select option while editing
      cellEditorParams: {values: ['Tesla', 'Ford', 'Toyota']},
    },
    {
      field: 'model'
    },
    {
      field: 'price',
      valueFormatter: params => {
        if (params.value == null) return '';
        return '$' + params.value.toLocaleString();
      },
      cellClassRules: {
        'green-cell': p => p.value < 40000,
      }
    },
    {field: 'electric'},
  ])

  onGridReady($event: GridReadyEvent<any>) {
    this.rowData = this.http.get<any[]>('https://ag-grid.com/example-assets/row-data.json')
  }

  protected readonly every = every;
}
