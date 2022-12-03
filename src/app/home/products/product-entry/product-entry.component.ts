import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-product-entry',
  templateUrl: './product-entry.component.html',
  styleUrls: ['./product-entry.component.scss']
})
export class ProductEntryComponent implements OnInit {
  inputForm:any;
  categories:any = ['Domestic', 'Commercial'];

  constructor(private fb: FormBuilder, private PService: ProductsService) { }

  ngOnInit(): void {
    this.createForm();
    this.searchProducts();
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

  searchProducts(){
    this.PService.getProducts({search_key:{}}).subscribe(res=>{

    })
  }

}
