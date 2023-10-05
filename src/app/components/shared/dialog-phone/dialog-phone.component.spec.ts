import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPhoneComponent } from './dialog-phone.component';

describe('DialogPhoneComponent', () => {
  let component: DialogPhoneComponent;
  let fixture: ComponentFixture<DialogPhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPhoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
