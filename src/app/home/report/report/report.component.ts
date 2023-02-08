import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  dateForm: FormGroup = new FormGroup({});
  configuration: Config = { ...DefaultConfig };
  columns: Columns[] = [];
  tableData = [];

  constructor(private toastService: ToastService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
    this.initTable();
  }


  createForm() {
    const date = new Date();
    date.setHours(0, 0, 0, 0)
    this.dateForm = this.fb.group({
      allocation_date: [date, Validators.required]
    })
  }

  initTable() {
    this.configuration = { ...DefaultConfig };
    this.configuration.fixedColumnWidth = true;
    this.configuration.horizontalScroll = true;
    this.configuration.rows = 10;
    this.columns = [
      { key: '', title: 'SL #' },
      { key: 'area', title: 'Area' },
      { key: 'name', title: 'Name' },
      { key: 'given', title: 'Given' },
      { key: 'diff', title: 'Diff' },
      { key: 'total', title: 'Total' },
      { key: 'dom', title: 'Dom (No Subsidy)' },
      { key: 'ws', title: 'WS' },
      { key: 'card', title: 'Card' },
      { key: 'online', title: 'Online' },
      { key: 'credit', title: 'Credit' },
      { key: 'mis/dep', title: 'Mis/Dep' },
      { key: 'exp', title: 'Exp' },
      { key: 'bhim', title: 'BHIM' },
      { key: '2000', title: '2000' },
      { key: '500', title: '500' },
      { key: '200', title: '200' },
      { key: '100', title: '100' },
      { key: '50', title: '50' },
      { key: '20', title: '20' },
      { key: '10', title: '10' },
      { key: 'cash', title: 'Cash' },
      { key: 'diff', title: 'Diff' },
      { key: 'nc_cy', title: 'NC Cyli' },
      { key: 'otv_cy', title: 'OTV Cyli' },
      { key: 'cash', title: 'NC Cyli' },
    ];
  }

}
