import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[appDebounceClick]',
})
export class DebounceClickDirective {
  @Input() debounceTime = 500;
  @Output() debounceClick = new EventEmitter();
  private clicks = new Subject();
  private subscription: Subscription;
  countClicks: number = 0;

  constructor() {}

  ngOnInit() {
    this.subscription = this.clicks.pipe(debounceTime(this.debounceTime)).subscribe((e) => {
      this.debounceClick.emit(e);
      this.countClicks = 0;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('click', ['$event'])
  clickEvent(event) {
    // event.preventDefault();
    // event.stopPropagation();
    event.clickValue = ++this.countClicks;
    this.clicks.next(event);
  }
}
