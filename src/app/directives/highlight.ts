import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {
  constructor(private el: ElementRef) {}

  @HostListener('mouseenter')
  onEnter() {
    this.el.nativeElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
  }

  @HostListener('mouseleave')
  onLeave() {
    this.el.nativeElement.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
  }
}