import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  //Products

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

  // Delivery Area

  searchArea(payload:any){
    return this.http.post(environment.apiurl + `api/area/search`, payload)
  }

  addArea(payload:any){
    return this.http.post(environment.apiurl + `api/area/add`, payload)
  }

  updateArea(payload:any){
    return this.http.post(environment.apiurl + `api/area/update`, payload)
  }

  deleteArea(_id:any){
    return this.http.delete(environment.apiurl + `api/area/delete/${_id}`)
  }

  // Roles

  searchRole(payload:any){
    return this.http.post(environment.apiurl + `api/role/search`, payload)
  }

  addRole(payload:any){
    return this.http.post(environment.apiurl + `api/role/add`, payload)
  }

  updateRole(payload:any){
    return this.http.post(environment.apiurl + `api/role/update`, payload)
  }

  deleteRole(_id:any){
    return this.http.delete(environment.apiurl + `api/role/delete/${_id}`)
  }

  // Executives

  searchEmployee(payload:any){
    return this.http.post(environment.apiurl + `api/executive/search`, payload)
  }

  addEmployee(payload:any){
    return this.http.post(environment.apiurl + `api/executive/add`, payload)
  }

  updateEmployee(payload:any){
    return this.http.post(environment.apiurl + `api/executive/update`, payload)
  }

  deleteEmployee(_id:any){
    return this.http.delete(environment.apiurl + `api/executive/delete/${_id}`)
  }
}
