import {Component, signal} from '@angular/core';
import {AgGridModule} from 'ag-grid-angular';
import {ColDef, GridOptions, GridReadyEvent, ModuleRegistry, themeQuartz} from 'ag-grid-community';
import {AllEnterpriseModule} from 'ag-grid-enterprise';
import {Observable} from 'rxjs';
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

  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
    filter: true,
    sortable: true,
    resizable: true
  };

  readonly colDefs = signal<ColDef[]>([
    {field: 'country', enableRowGroup: true, rowGroup: true, hide: true},
    {field: 'athlete', filter: true, enableRowGroup: true, rowGroup: true, hide: true},
    {field: 'age'},
    {field: 'year', enableRowGroup: true,},
    {field: 'date', filter: 'agDateColumnFilter'},
    {field: 'sport'},
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
      cellStyle: {fontWeight: 'bold'}
    }
  ]);

  public gridOptions: GridOptions = {
    // --- ROW GROUPING DISPLAY MODES ---
    groupDisplayType: 'singleColumn',          // Combines all row groups into one dedicated 'Auto Group' column.
    // groupDisplayType: 'multipleColumns',    // Creates a separate group column for every column that has 'rowGroup: true'.
    // groupDisplayType: 'groupRows',          // Renders groups as full-width rows spanning the entire grid width.
    // groupDisplayType: 'custom',             // Provides no default grouping columns; developer must define where groups appear.

    // --- SELECTION & ANIMATION ---
    rowSelection: 'single',                    // Restricts selection to one row at a time; required for checkboxes to function.
    animateRows: true,                         // Enables smooth CSS transitions when rows are sorted, filtered, or expanded.

    // --- GROUP NAVIGATION & VISIBILITY ---
    // groupHideOpenParents: true,             // Hides the parent group row once it is expanded (common in 'folder' style UIs).
    // showOpenedGroup: true,                  // Forces the group name to remain visible in the child row when grouped by multiple columns.

    // --- UI PANELS ---
    rowGroupPanelShow: "always",               // Shows the 'Drop columns here to group' bar at the top (can be 'always', 'onlyWhenGrouping', or 'never').
    sideBar: true,                             // Displays the right-hand panel containing Filters and Column management tools.
    suppressDragLeaveHidesColumns: true,       // Prevents columns from being hidden if you accidentally drag them outside the grid area.

    // --- FULL WIDTH GROUP SETTINGS (Used when groupDisplayType is 'groupRows') ---
    groupRowRendererParams: {
      suppressCount: true                      // Hides the number of children (e.g., '(5)') normally shown next to the group name.
    },

    // --- AUTO GROUP COLUMN DEFINITION (The 'Master' Group Column) ---
    autoGroupColumnDef: {
      // headerName: 'Custom Group header',    // Overrides the default header text for the auto-generated group column.
      // cellRenderer: 'agGroupCellRenderer',  // The engine that handles expand/collapse UI; rarely changed but can be customized.
      // field: 'sport',                       // Forces the group column to use a specific data field for its labels.

      cellRendererParams: {
        // suppressCount: true,                // Hides the row count specifically for the Auto Group column.
        // checkbox: true,                     // Shows a selection checkbox inside the group cell (requires rowSelection to be set).
        // innerRenderer: (params: any) => { return `<b>${params.value}</b>`; } // Customizes the text label inside the group without breaking the expand/collapse logic.
      }
    }
  };

  onGridReady($event: GridReadyEvent<any>) {
    this.rowData = this.http.get<any[]>('https://www.ag-grid.com/example-assets/olympic-winners.json')
  }

  myTheme = themeQuartz.withParams({
    foregroundColor: 'rgb(14, 100, 15)',
    backgroundColor: 'rgb(241, 247, 255)',
    headerBackgroundColor: 'rgb(220, 230, 240)',
    rowHoverColor: 'rgba(14, 100, 15, 0.1)',
  });
}
