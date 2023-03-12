import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from './services/global.service';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'gas_app';
  pages: any = []

  constructor(private gs:GlobalService, private router: Router, private ts: ToastService) {
    if (!sessionStorage.getItem('user_info')) {
      this.router.navigate(['/login']);
    }
  }

  hideSidebar(e:any){
    if(!e) this.gs.displaysidebar = false;
  }

  ngOnInit(): void {
    this.initPages();
  }

  initPages() {
    this.pages = [
      { name: "Allocate Executive Area", link: ['home', 'area-allocation'], icon: "pi pi-user-plus" },
      { name: "Default Area Allocation", link: ['home', 'default-area'], icon: "pi pi-users" },
      { name: "Delivery Area", link: ['home', 'delivery-area'], icon: "pi pi-globe" },
      { name: "Credit Settlement", link: ['home', 'credit-settlement'], icon: "pi pi-money-bill" },
      { name: "Roles", link: ['home', 'roles'], icon: "pi pi-sitemap" },
      { name: "Employees", link: ['home', 'employees'], icon: "pi pi-users" },
      { name: "Products", link: ['home', 'products'], icon: "pi pi-database" },
      { name: "Reports", link: ['home', 'report'], icon: "pi pi-users" },
      { name: "Sales Entry", link: ['home', 'sales-entry'], icon: "pi pi-users" },
    ];
    const session: any = sessionStorage.getItem('previledge');
    const previlege: any = JSON.parse(session);
    const data = previlege.filter((v: any) => v.view);
    const views = data.map((v: any) => v.screen);
    this.pages = this.pages.filter((p: any) => views.includes(p.name));
    if (this.pages.length === 0) {
      sessionStorage.clear();
      this.ts.showWarningToaster('Warning', 'No Previledges given. Please contact administrator');
      this.router.navigate(['login']);
    }
    else {
      this.router.navigate([this.pages[0].link.join('/')])
    }
  }

  handleChange(index: any) {
    this.router.navigate(this.pages[index].link);
    this.hideSidebar(false)
  }
  
  get displaysidebar(){
    return this.gs.displaysidebar
  }
}
