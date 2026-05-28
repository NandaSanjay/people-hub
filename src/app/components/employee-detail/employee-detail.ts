import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';
import { BreadcrumbService } from '../../services/breadcrumb';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-detail.html',
  styleUrls: ['./employee-detail.css']
})
export class EmployeeDetailComponent implements OnInit {

  employee: any = null;

  activeTab: string = 'profile';

  selectTab(tab: string) {
    this.activeTab = tab;
  }


constructor(
  private route: ActivatedRoute,
  private empService: EmployeeService,
  private cdr: ChangeDetectorRef,
  private router: Router,
  private breadcrumbService: BreadcrumbService

) {}


  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

 

this.empService.getEmployees().subscribe(res => {
  const emp = res.users.find((e: any) => e.id === id);

  this.employee = emp ? { ...emp } : null;

  if (this.employee) {
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Employees', url: '/employees' },
      { label: `${this.employee.firstName} ${this.employee.lastName}`, url: '' }
    ]);
  }

  this.cdr.detectChanges();
});
``

  }
}