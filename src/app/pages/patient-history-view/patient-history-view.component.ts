import { Direction, BidiModule } from '@angular/cdk/bidi';
import { AfterViewInit, Component, Inject, Renderer2 } from '@angular/core';
import { InConfiguration } from '@core';
import { ConfigService } from '@config';
import { DOCUMENT } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { UnsubscribeOnDestroyAdapter } from '@shared';

@Component({
selector: 'app-patient-history-view',
  templateUrl: './patient-history-view.component.html',
  styleUrls: [],
  standalone: true,
})
export class PatientHistoryViewComponent {
  ngAfterViewInit(): void {
  }

  constructor(private router: Router){}

  back() {
    this.router.navigate(['/patient'])
  }
}
