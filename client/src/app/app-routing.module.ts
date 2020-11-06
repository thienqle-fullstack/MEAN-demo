import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { EmployeesListComponent } from './employees-list/employees-list.component';

const routes: Routes = [
  {path: '', redirectTo: 'employees', pathMatch: 'full'}, //empty
  {path:"employees",component: EmployeesListComponent},
  {path:"employees/:id",component: EmployeeDetailsComponent},
  {path: '**', redirectTo: 'employees', pathMatch: 'full'} //page not found
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
