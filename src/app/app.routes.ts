import { Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail';
import { AddEmployeeComponent } from './components/add-employee/add-employee';
import { authGuard } from './guards/auth-guard';
import { LoginComponent } from './components/login/login';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    canActivate: [authGuard],
    children: [

{ 
  path: 'employees', 
  component: EmployeeListComponent,
  data: { animation: 'EmployeesPage' }
},

{ 
  path: 'employee/:id', 
  component: EmployeeDetailComponent,
  data: { animation: 'DetailPage' }
},

{ 
  path: 'add-employee', 
  component: AddEmployeeComponent,
  data: { animation: 'AddPage' }
},
      { path: '', redirectTo: 'employees', pathMatch: 'full' }
    ]
  }
];
