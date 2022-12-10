import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  pages:any = []

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.initPages();
  }

  initPages(){
    this.pages = [
      {name:"Products", link:['home', 'products'], icon:"pi pi-database"},
      {name:"Delivery Area", link:['home', 'delivery-area'], icon:"pi pi-globe"},
      {name:"Allocate Executive Area", link:['home', 'area-allocation'], icon:"pi pi-user-plus"},
      {name:"Roles", link:['home', 'roles'], icon:"pi pi-sitemap"},
      {name:"Employees", link:['home', 'employees'], icon:"pi pi-users"},
      {name:"Default Area Allocation", link:['home', 'default-area'], icon:"pi pi-users"},
    ]
  }

  handleChange(event:any){
    const index = event.index;
    this.router.navigate(this.pages[index].link);  }
}
