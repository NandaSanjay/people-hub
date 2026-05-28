import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SalaryPipe } from '../../pipes/salary-pipe';
import { HighlightDirective } from '../../directives/highlight';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SalaryPipe,
    HighlightDirective,
    FormsModule
  ],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.css']   // ✅ FIXED
})
export class EmployeeListComponent implements OnInit {

  employees: any[] = [];
  pagedEmployees: any[] = [];

  page = 1;
  pageSize = 10;

  totalEmployees = 0;
  totalDepartments = 0;
  avgSalary = 0;
  activeEmployees = 0;

  searchTerm: string = '';


  selectedDepartment: string = 'all';
  filteredEmployees: any[] = [];


  constructor(
    private empService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('EmployeeList loaded ✅');

    this.empService.getEmployees().subscribe(res => {
      console.log('API Response ✅', res);

      this.employees = res.users || [];

      // ✅ Metrics
      this.totalEmployees = this.employees.length;

      this.totalDepartments = new Set(
        this.employees.map(e => e.company?.department)
      ).size;

      this.avgSalary = Math.floor(
        this.employees.reduce((sum, e) => sum + (e.age || 25) * 1000, 0) /
        this.totalEmployees
      );

      this.activeEmployees = this.totalEmployees;
      this.filteredEmployees = [...this.employees];
      this.updatePage();
      this.cdr.detectChanges();   // ✅ SINGLE call
    });
  }

filterEmployees() {
  const term = this.searchTerm.toLowerCase();

  const filtered = this.employees.filter(emp =>
    emp.firstName.toLowerCase().includes(term) ||
    emp.lastName.toLowerCase().includes(term) ||
    emp.email.toLowerCase().includes(term) ||
    (emp.company?.department || '').toLowerCase().includes(term)
  );

  this.page = 1;

  this.pagedEmployees = filtered.slice(0, this.pageSize);
}

applyFilters() {

  let filtered = [...this.employees];

  // ✅ Apply search filter
  if (this.searchTerm) {
    const term = this.searchTerm.toLowerCase();

    filtered = filtered.filter(emp =>
      emp.firstName.toLowerCase().includes(term) ||
      emp.lastName.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term)
    );
  }

  // ✅ Apply department filter
  if (this.selectedDepartment !== 'all') {
    filtered = filtered.filter(emp =>
      (emp.company?.department || '') === this.selectedDepartment
    );
  }

  this.filteredEmployees = filtered;

  this.page = 1;
  this.updatePage(filtered);
}



updatePage(data: any[] = this.filteredEmployees) {
  const start = (this.page - 1) * this.pageSize;
  const end = start + this.pageSize;
  this.pagedEmployees = data.slice(start, end);
}

  nextPage() {
    if (this.page * this.pageSize < this.employees.length) {
      this.page++;
      this.updatePage();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.updatePage();
    }
  }

  deleteEmployee(emp: any) {
    if (confirm('Delete ' + emp.firstName + '?')) {
      this.employees = this.employees.filter(e => e !== emp);

      // ✅ Recalculate everything
      this.totalEmployees = this.employees.length;
      this.updatePage();
    }
  }

  editEmployee(emp: any) {
    alert('Edit Employee: ' + emp.firstName);
  }

  get totalPages(): number {
    return Math.ceil(this.employees.length / this.pageSize);
  }


get departments(): string[] {
  return [
    'all',
    ...new Set(
      this.employees
        .map(e => e.company?.department)
        .filter(Boolean)
    )
  ];
}

}
``