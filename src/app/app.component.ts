import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gas_app';

  constructor(private router: Router) {
    if (!sessionStorage.getItem('user_info')) {
      this.router.navigate(['/login']);
    }
  }
}
