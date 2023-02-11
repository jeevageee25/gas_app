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
  nestedConfiguration: Config = { ...DefaultConfig };
  columns: Columns[] = [];
  nestedColumns: Columns[] = [];
  tableData = [{}];

  constructor(private toastService: ToastService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
    this.initTable();
    this.initConfig();
  }


  createForm() {
    const date = new Date();
    date.setHours(0, 0, 0, 0)
    this.dateForm = this.fb.group({
      allocation_date: [date, Validators.required]
    })
  }

  initTable() {
    this.columns = [
      { key: '', title: 'SL #' },
      { key: 'area', title: 'Area' },
      { key: 'executive_id', title: 'Executive Name' },
      { key: 'allocated', title: 'Allocated' },
      { key: 'returned', title: 'Returned' },
      { key: 'supplied', title: 'Supplied' },
      { key: 'expected_amount', title: 'Expected Amount' },
      { key: 'collected_amount', title: 'Collected Amount' },
      { key: 'difference', title: 'Difference' },
    ];
    this.nestedColumns = [
      { key: 'no', title: 'Sl #', width: '5%' },
      { key: 'product', title: 'Product' },
      { key: 'price', title: 'Price' },
      { key: 'allocated', title: 'Allocated' },
      { key: 'supplied', title: 'Supplied' },
      { key: 'payment_methpd', title: 'Payment Method' },
      { key: 'expected_amount', title: 'Expected Amount' },
      { key: 'collected_amount', title: 'Collected Amount' },
      { key: 'difference', title: 'Difference' },
    ];
  }

  initConfig() {
    this.configuration = { ...DefaultConfig };
    this.configuration.detailsTemplate = true;
    this.configuration.fixedColumnWidth = false;
    this.configuration.showDetailsArrow = true;
    this.configuration.rows = 10;
    this.nestedConfiguration = { ...DefaultConfig };
    this.nestedConfiguration.fixedColumnWidth = false;
    this.nestedConfiguration.rows = 5;
  }

}
