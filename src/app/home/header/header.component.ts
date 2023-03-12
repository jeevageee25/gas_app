import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  pages: any = []
  
  constructor(private gs:GlobalService, private router: Router, private ts: ToastService) { }

  ngOnInit(): void {
  }

  onLogout() {
    sessionStorage.clear();
    this.ts.showSuccessToaster('', 'Successfully Logged out');
    this.router.navigate(['/login']);
  }

  changeSidebar(){
    this.gs.displaysidebar = true;
  }
}
