import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  pages: any = []

  constructor(private router: Router, private ts: ToastService) { }

  ngOnInit(): void {
    this.initPages();
  }

  initPages() {
    this.pages = [
      { name: "Products", link: ['home', 'products'], icon: "pi pi-database" },
      { name: "Delivery Area", link: ['home', 'delivery-area'], icon: "pi pi-globe" },
      { name: "Allocate Executive Area", link: ['home', 'area-allocation'], icon: "pi pi-user-plus" },
      { name: "Roles", link: ['home', 'roles'], icon: "pi pi-sitemap" },
      { name: "Employees", link: ['home', 'employees'], icon: "pi pi-users" },
      { name: "Default Area Allocation", link: ['home', 'default-area'], icon: "pi pi-users" },
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

  handleChange(event: any) {
    const index = event.index;
    this.router.navigate(this.pages[index].link);
  }

  onLogout() {
    sessionStorage.clear();
    this.ts.showSuccessToaster('', 'Successfully Logged out');
    this.router.navigate(['/login']);
  }
}
