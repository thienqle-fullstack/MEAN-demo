import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private url = "http://localhost:3000"
  
  constructor(private http: HttpClient,private router : Router) { 
    if(window.location.href.includes('herokuapp')) {
      this.url = '';
    } else {
      this.url = "http://localhost:3000"
    }

  }

  /* Using observable */
  // getEmployees():Observable<any>{
  //   return this.http.get(this.url + "/api/employees");
  // }

  /* Using Promise */
  getEmployees() {
    return this.http.get(this.url + "/api/employees").toPromise();
  }

  addEmployees(employee):Observable<any>{
    return this.http.post(this.url + "/api/employees",employee);
  }

  deleteEmployee(employee):Observable<any>{
    return this.http.delete(this.url + "/api/employees/" + employee._id);
  }

  getOneEmployee(id):Observable<any>{
    return this.http.get(this.url + "/api/employees/" + id)
  }

}
