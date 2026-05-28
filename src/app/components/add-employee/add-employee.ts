import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Add Employee</h2>

    <form (ngSubmit)="addEmployee()">
      <input [(ngModel)]="employee.firstName" name="firstName" placeholder="First Name" required />
      <input [(ngModel)]="employee.lastName" name="lastName" placeholder="Last Name" required />
      <input [(ngModel)]="employee.email" name="email" placeholder="Email" />

      <button type="submit">Add</button>
    </form>
  `
})
export class AddEmployeeComponent {

  employee: any = {};

  addEmployee() {
    console.log('Employee Added:', this.employee);
    alert('Employee Added Successfully!');
  }
}