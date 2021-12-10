import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterProductCardComponent } from './footer-product-card.component';

describe('FooterProductCardComponent', () => {
  let component: FooterProductCardComponent;
  let fixture: ComponentFixture<FooterProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterProductCardComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterProductCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
