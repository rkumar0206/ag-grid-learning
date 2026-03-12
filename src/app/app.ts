import {Component, signal} from '@angular/core';
import {AgGridModule} from 'ag-grid-angular';
import {ColDef, GridReadyEvent, ModuleRegistry, themeQuartz} from 'ag-grid-community';
import {AllEnterpriseModule} from 'ag-grid-enterprise';
import {every, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AsyncPipe} from '@angular/common';
import {StatusFilter} from './status-filter';

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

  defaultColDef: ColDef = {
    flex: 1
  }

  pagination = true
  paginationPageSize = 15;
  paginationPageSizeSelector = [15, 20, 25]

  readonly colDefs = signal<ColDef[]>([
    { field: 'mission' },
    { field: 'company' },
    {
      field: 'successful',
      headerName: 'Status',
       filter: StatusFilter
    }
  ]);

  onGridReady($event: GridReadyEvent<any>) {
    this.rowData = this.http.get<any[]>('https://www.ag-grid.com/example-assets/space-mission-data.json')
  }

  protected readonly every = every;
}
