import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { BreadcrumbService } from './services/breadcrumb';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule
  ],
  template: `
  <header class="header">
    <div class="logo">TriNet PeopleHub</div>

    <nav class="menu">
      <a routerLink="/employees" routerLinkActive="active"
         [routerLinkActiveOptions]="{ exact: true }">Employees</a>

      <a routerLink="/add-employee" routerLinkActive="active">Add Employee</a>
      <a routerLink="/reports" routerLinkActive="active">Reports</a>
      <a routerLink="/settings" routerLinkActive="active">Settings</a>
    </nav>

    <nav class="breadcrumb">
      <ng-container *ngFor="let bc of breadcrumbs; let last = last">
        <a *ngIf="!last" [routerLink]="bc.url">{{ bc.label }}</a>
        <span *ngIf="last">{{ bc.label }}</span>
        <span *ngIf="!last"> › </span>
      </ng-container>
    </nav>
  </header>

  <main class="container">
    <router-outlet></router-outlet>
  </main>
`,
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {

  breadcrumbs: any[] = [];

  constructor(
    private router: Router,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit() {

    // ✅ Subscribe to breadcrumb updates
    this.breadcrumbService.breadcrumbs$.subscribe(bc => {
      this.breadcrumbs = bc;
    });

    // ✅ Handle route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateRouteBreadcrumb();
      });
  }

  updateRouteBreadcrumb() {
    const url = this.router.url;

    if (url === '/employees') {
      this.breadcrumbService.setBreadcrumbs([
        { label: 'Employees', url: '/employees' }
      ]);
    }

    else if (url.startsWith('/employee/')) {
      this.breadcrumbService.setBreadcrumbs([
        { label: 'Employees', url: '/employees' },
        { label: '...', url: '' }   // temporary placeholder
      ]);
    }

    else if (url.includes('add-employee')) {
      this.breadcrumbService.setBreadcrumbs([
        { label: 'Employees', url: '/employees' },
        { label: 'Add Employee', url: '' }
      ]);
    }
  }
}
``