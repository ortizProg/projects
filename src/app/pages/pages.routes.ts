import { Route } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { AdminGuard } from '@core/guard/admin.guard';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';

export const PAGES_ROUTE: Route[] = [
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'projects',
    component: ProjectsComponent
  },
  {
    path: 'projects/:id',
    component: ProjectDetailComponent
  }
];
