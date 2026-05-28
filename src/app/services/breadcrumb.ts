import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  private breadcrumbSource = new BehaviorSubject<any[]>([]);
  breadcrumbs$ = this.breadcrumbSource.asObservable();

  setBreadcrumbs(breadcrumbs: any[]) {
    this.breadcrumbSource.next(breadcrumbs);
  }
}
``