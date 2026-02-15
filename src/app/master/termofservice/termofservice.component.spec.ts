import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermofserviceComponent } from './termofservice.component';

describe('TermofserviceComponent', () => {
  let component: TermofserviceComponent;
  let fixture: ComponentFixture<TermofserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermofserviceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermofserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
