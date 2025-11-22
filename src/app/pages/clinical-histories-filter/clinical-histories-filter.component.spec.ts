import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalHistoriesFilterComponent } from './clinical-histories-filter.component';

describe('ClinicalHistoriesFilterComponent', () => {
  let component: ClinicalHistoriesFilterComponent;
  let fixture: ComponentFixture<ClinicalHistoriesFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicalHistoriesFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicalHistoriesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
