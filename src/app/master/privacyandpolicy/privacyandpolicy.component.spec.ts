import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyandpolicyComponent } from './privacyandpolicy.component';

describe('PrivacyandpolicyComponent', () => {
  let component: PrivacyandpolicyComponent;
  let fixture: ComponentFixture<PrivacyandpolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivacyandpolicyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivacyandpolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
