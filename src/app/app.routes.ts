import { Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail';
import { AddEmployeeComponent } from './components/add-employee/add-employee';


export const routes: Routes = [
  { path: '', component: EmployeeListComponent },  // ✅ DIRECT LOAD
  { path: 'employees', component: EmployeeListComponent },
  { path: 'employee/:id', component: EmployeeDetailComponent },
  { path: 'add-employee', component: AddEmployeeComponent }
];

