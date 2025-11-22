import { Route } from '@angular/router';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { AuthGuard } from '@core/guard/auth.guard';
import { PatientLayoutComponent } from './layout/patient-layout/patient-layout.component';
import { PatientViewComponent } from './pages/patient-view/patient-view.component';
import { PatientHistoryViewComponent } from './pages/patient-history-view/patient-history-view.component';

export const APP_ROUTE: Route[] = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTE),
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PAGES_ROUTE),
      },
    ],
  },
  {
    path: 'patient',
    component: PatientLayoutComponent,
    canActivate: [],
    children: [
      {
        path: '',
        component: PatientViewComponent
      },
      {
        path: 'history',
        component: PatientHistoryViewComponent
      }
    ],
  },
  {
    path: 'authentication',
    loadChildren: () =>
      import('./authentication/auth.routes').then((m) => m.AUTH_ROUTE),
  },
];
