import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalHistoriesComponent } from './clinical-histories.component';

describe('ClinicalHistoriesComponent', () => {
  let component: ClinicalHistoriesComponent;
  let fixture: ComponentFixture<ClinicalHistoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicalHistoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicalHistoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
