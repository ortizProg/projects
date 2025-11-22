import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealtCenterDetailComponent } from './healt-center-detail.component';

describe('HealtCenterDetailComponent', () => {
  let component: HealtCenterDetailComponent;
  let fixture: ComponentFixture<HealtCenterDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealtCenterDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealtCenterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
