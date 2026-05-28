import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { BreadcrumbService } from './services/breadcrumb';
import { AuthService } from './services/auth';

import {
  trigger,
  transition,
  style,
  animate,
  query,
  group
} from '@angular/animations';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule
  ],
  template: `

<!-- ✅ LOGIN PAGE ONLY -->
<ng-container *ngIf="isAuthPage(); else mainLayout">
  <router-outlet></router-outlet>
</ng-container>

<!-- ✅ MAIN APP -->
<ng-template #mainLayout>

<div class="layout">

  <!-- SIDEBAR -->
  <aside class="sidebar" [class.collapsed]="isSidebarCollapsed">

    <!-- TOGGLE -->
    <div class="toggle-btn" (click)="toggleSidebar()">
      <i class="fa fa-bars"></i>
    </div>

    <!-- LOGO -->
    <div class="logo">

      <img
        src="assets/trinet-logo-white.png"
        class="logo-full"
        alt="TriNet"
      />

      <img
        src="assets/trinet-logo-icon.png"
        class="logo-icon"
        alt="Logo"
      />

    </div>

    <!-- NAV -->
    <nav>

      <a routerLink="/employees" routerLinkActive="active">
        <i class="fa fa-users"></i>
        <span class="menu-text">Employees</span>
      </a>

      <a routerLink="/add-employee" routerLinkActive="active">
        <i class="fa fa-user-plus"></i>
        <span class="menu-text">Add Employee</span>
      </a>

      <a routerLink="/reports" routerLinkActive="active">
        <i class="fa fa-chart-bar"></i>
        <span class="menu-text">Reports</span>
      </a>

      <a routerLink="/settings" routerLinkActive="active">
        <i class="fa fa-cog"></i>
        <span class="menu-text">Settings</span>
      </a>

    </nav>

  </aside>

  <!-- MAIN -->
  <div class="main">

    <!-- HEADER -->
    <header class="header">

      <h1 class="brand-logo">
        <span class="tri">People</span><span class="net">Hub</span>
      </h1>

      <div class="header-right">

        <!-- DARK MODE -->
        <button class="theme-toggle" (click)="toggleTheme()">
          <i class="fa" [ngClass]="isDarkMode ? 'fa-sun' : 'fa-moon'"></i>
        </button>

        <!-- PROFILE -->
        <div class="profile" (click)="toggleProfile()">

          <div class="avatar">S</div>
          <span class="username">Sanjay</span>
          <i class="fa fa-chevron-down"></i>

          <!-- DROPDOWN -->
          <div class="dropdown" *ngIf="isProfileOpen">

            <a>
              <i class="fa fa-user"></i> Profile
            </a>

            <a>
              <i class="fa fa-cog"></i> Settings
            </a>

            <div class="divider"></div>

            <a (click)="logout()">
              <i class="fa fa-sign-out-alt"></i> Logout
            </a>

          </div>
        </div>

      </div>
    </header>

    <!-- BREADCRUMB -->
    <div class="breadcrumb">
      <ng-container *ngFor="let bc of breadcrumbs; let last = last">
        <a *ngIf="!last" [routerLink]="bc.url">{{ bc.label }}</a>
        <span *ngIf="last">{{ bc.label }}</span>
        <span *ngIf="!last"> › </span>
      </ng-container>
    </div>

    <!-- CONTENT -->
    <main class="content">
      
      <div [@routeAnimations]="prepareRoute(outlet)">
        <router-outlet #outlet="outlet"></router-outlet>
      </div>

    </main>

  </div>

</div>

</ng-template>
`,

animations: [
  trigger('routeAnimations', [
    transition('* <=> *', [

      query(':enter, :leave', [
        style({
          position: 'absolute',
          width: '100%'
        })
      ], { optional: true }),

      query(':enter', [
        style({ opacity: 0 })
      ], { optional: true }),

      query(':enter', [
        animate('120ms ease-out', style({ opacity: 1 }))
      ], { optional: true })

    ])
  ])
]
,
  styleUrls: ['./app.css']
})

export class AppComponent implements OnInit {

  breadcrumbs: any[] = [];
  isSidebarCollapsed = false;
  isDarkMode = false;
  isProfileOpen = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit() {

    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.body.classList.add('dark');
    }

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


logout() {
  this.auth.logout();
  this.router.navigate(['/login']);
}


toggleProfile() {
  this.isProfileOpen = !this.isProfileOpen;
}

toggleTheme() {
  this.isDarkMode = !this.isDarkMode;

  document.body.classList.toggle('dark', this.isDarkMode);

  localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
}


  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
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

@HostListener('document:click', ['$event'])
onClickOutside(event: any) {
  const target = event.target.closest('.profile');

  if (!target) {
    this.isProfileOpen = false;
  }
}


isAuthPage(): boolean {
  return this.router.url.includes('login');
}

prepareRoute(outlet: any) {
  return outlet?.activatedRouteData?.['animation'];
}

}
``