import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-entry',
  templateUrl: './product-entry.component.html',
  styleUrls: ['./product-entry.component.scss']
})
export class ProductEntryComponent implements OnInit {
  inputForm:any;
  categories:any = ['Domestic', 'Commercial'];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.inputForm = this.fb.group({
      name: [],
      category:[],
      rate:[]
    })
  }

  onFormSubmit() {

  }

}
