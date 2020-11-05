import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { concatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css']
})
export class EmployeesListComponent implements OnInit {

  employees = []

  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.data.getEmployees().subscribe(
      (data) => { this.employees = data},
      (err) => {console.log("There is an error")}
    )
  }

  addEmployee() {
    let newEmployee = {
      _id: this.getNextId(),
      name: Math.random().toString(20).substr(2,10).replace(/[0-9]/gi,''),
      age: Math.floor(Math.random()*100),
      salary: Math.floor(Math.random()*100) * 1000
    }
    let addNew = this.data.addEmployees(newEmployee).pipe(
      concatMap((data) => {return this.data.getEmployees()})
    )

    addNew.subscribe(
      (data) => { this.employees = data;},
      (err) => {console.log("There is an error")}
    )
  }

  deleteEmployee(employee){
    let deteleObservable = this.data.deleteEmployee(employee).pipe(
      concatMap((data) => {return this.data.getEmployees()})
    )

    deteleObservable.subscribe(
      (data) => { this.employees = data;},
      (err) => {console.log("There is an error")}
    )
  }
  
  getNextId(){
    let nextID = 0;
    this.employees.forEach(e => {
      if(nextID<=e._id) nextID=e._id;
    })
    return nextID+1;
  }

}
