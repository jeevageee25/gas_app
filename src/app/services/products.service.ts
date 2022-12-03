import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

   getProducts(payload:any){
    return this.http.post(environment.apiurl + `api/products/search`, payload)
  }

  addProducts(payload:any){
    return this.http.post(environment.apiurl + `api/products/add`, payload)
  }

  updateProducts(payload:any){
    return this.http.post(environment.apiurl + `api/products/update`, payload)
  }

  deleteProducts(_id:any){
    return this.http.delete(environment.apiurl + `api/products/delete/${_id}`)
  }

}
