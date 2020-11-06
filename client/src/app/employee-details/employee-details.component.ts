import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { concatMap } from 'rxjs/operators';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private data: DataService) { }

  id; //Will get it from activated route
  employee; //will get employee information 
  randomColor; //Create random color for profile picture

  ngOnInit(): void {
    let getID = this.activatedRoute.paramMap.pipe(
      concatMap(
        (params: ParamMap) => {
          this.id = params.get('id')
          return this.data.getOneEmployee(this.id);
        }
      )
    )

    getID.subscribe(
      (data) => {this.employee = data},
      (err) => {console.log(err)}
    )

    this.randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
  }
  

}
