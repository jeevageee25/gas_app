import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  product_details = [];
  updated_products = [];
  data_entry = {};
  displaysidebar = false;
  
  constructor() { }

  groupBy(arr: any, groups: any) {
    let grouped = {};
    arr.forEach(function (a: any) {
      groups.reduce(function (o: any, g: any, i: any) {
        o[a[g]] = o[a[g]] || (i + 1 === groups.length ? [] : {});
        return o[a[g]];
      }, grouped).push(a);
    });
    return grouped;
  }

  getPreviledge(screen:any){
    const data:any = sessionStorage.getItem('previledge');
    return  JSON.parse(data).find((d:any)=>d.screen===screen);
  }
}
