import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  inputForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private ps: ProductsService, private toast: ToastService, private router: Router) { }

  ngOnInit(): void {
    sessionStorage.clear();
    this.inputForm = this.fb.group({
      user_name: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  onloginClick() {
    if (this.inputForm.invalid) {
      this.toast.showWarningToaster('Warning', 'Please fill all the fields');
      return;
    }
    this.ps.searchEmployee({ search_key: { ...this.inputForm.value } }).subscribe((res: any) => {
      if (res && res.data.length) {
        sessionStorage.setItem('user_info', JSON.stringify(res.data[0]))
        this.toast.showSuccessToaster('Success', 'Logged in ');
        this.searchRole(res.data[0].role)
      }
      else {
        this.toast.showWarningToaster('Warning', 'Wrong Credentials. Please try again.');
      }
    }, e => {
      this.toast.showErrorToaster('Error', 'Service Unavailale. Please try again later.');
    })

  }

  searchRole(role: any) {
    this.ps.searchRole({ search_key: { role } }).subscribe((res: any) => {
      if (res.data[0]) {
        sessionStorage.setItem('previledge', JSON.stringify(res.data[0].previledge))
        if (role === "Delivery Executive") {
          this.router.navigate(['/home/sales-entry'])
        }
        else {
          this.router.navigate(['/products'])
        }
      }
    }, e => {
      this.toast.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }
}
