import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerAddEditComponent } from './banner-add-edit.component';

describe('BannerAddEditComponent', () => {
  let component: BannerAddEditComponent;
  let fixture: ComponentFixture<BannerAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannerAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
