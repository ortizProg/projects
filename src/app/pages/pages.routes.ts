import { Route } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { AdminGuard } from '@core/guard/admin.guard';
import { HealtCentersComponent } from './healt-centers/healt-centers.component';
import { HealtCenterDetailComponent } from './healt-center-detail/healt-center-detail.component';
import { ClinicalHistoriesComponent } from './clinical-histories/clinical-histories.component';
import { ClinicalHistoriesFilterComponent } from './clinical-histories-filter/clinical-histories-filter.component';
import { ClinicalHistoryViewComponent } from './clinical-history-view/clinical-history-view.component';

export const PAGES_ROUTE: Route[] = [
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'healt-centers',
    component: HealtCentersComponent
  },
  {
    path: 'healt-centers/:id',
    component: HealtCenterDetailComponent
  },
  {
    path: 'clinical-histories',
    component: ClinicalHistoriesFilterComponent,
  },
  {
    path: 'clinical-histories/:document',
    component: ClinicalHistoriesComponent,
  },
  {
    path: 'clinical-history/:id',
    component: ClinicalHistoryViewComponent,
  },
];
