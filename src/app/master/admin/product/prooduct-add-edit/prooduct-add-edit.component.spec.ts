import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProoductAddEditComponent } from './prooduct-add-edit.component';

describe('ProoductAddEditComponent', () => {
  let component: ProoductAddEditComponent;
  let fixture: ComponentFixture<ProoductAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProoductAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProoductAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
