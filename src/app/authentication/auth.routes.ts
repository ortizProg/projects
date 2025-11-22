import { Route } from "@angular/router";
import { Page404Component } from "./page404/page404.component";
import { SigninComponent } from "./signin/signin.component";
import { SignInUserComponent } from "./sign-in-user/sign-in-user.component";
export const AUTH_ROUTE: Route[] = [
  {
    path: "",
    redirectTo: "signin",
    pathMatch: "full",
  },
  {
    path: "signin",
    component: SigninComponent,
  },
  {
    path: "sign-in-user",
    component: SignInUserComponent,
  },
  {
    path: "page404",
    component: Page404Component,
  },
  { path: '**', redirectTo: 'page404', pathMatch: 'full' },

];
