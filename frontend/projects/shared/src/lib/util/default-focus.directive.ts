import {Directive, ElementRef, OnInit} from '@angular/core';

@Directive({
  selector: '[ceDefaultFocus]',
  standalone: true
})
export class DefaultFocusDirective implements OnInit {

  constructor(protected elementRef: ElementRef) { }

  ngOnInit(): void {
    this.elementRef.nativeElement.focus();
  }

}
