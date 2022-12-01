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
      {name:"Products", link:['home', 'products']},
      {name:"Delivery Execute", link:['home', 'delivery-executive']}
    ]
  }

  handleChange(event:any){
    const index = event.index;
    this.router.navigate(this.pages[index].link);  }
}
