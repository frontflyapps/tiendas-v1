import {Directive, ElementRef} from '@angular/core';

@Directive({selector: '[lazyImg]'})
export class LazyImgDirective {
    constructor({nativeElement}: ElementRef<HTMLImageElement>) {
        const supports = 'loading' in HTMLImageElement.prototype;

        if (supports) {
            nativeElement.setAttribute('loading', 'lazy');
        }
    }
}
