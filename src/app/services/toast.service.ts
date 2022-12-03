import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toastService: MessageService) { }
  showSuccessToaster(title: string, messege: string) { 
    this.toastService.add({ severity: 'success', summary: title, detail: messege, })
  }
  showErrorToaster(title: string, messege: string) { 
    this.toastService.add({ severity: 'error', summary: title, detail: messege, })
  }
  showWarningToaster(title: string, messege: string) { 
    this.toastService.add({ severity: 'warn', summary: title, detail: messege, })
  }
  showInfoToaster(title: string, messege: string) { 
    this.toastService.add({ severity: 'info', summary: title, detail: messege, })
  }
}
