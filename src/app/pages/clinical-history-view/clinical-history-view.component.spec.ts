import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalHistoryViewComponent } from './clinical-history-view.component';

describe('ClinicalHistoryViewComponent', () => {
  let component: ClinicalHistoryViewComponent;
  let fixture: ComponentFixture<ClinicalHistoryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicalHistoryViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicalHistoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
