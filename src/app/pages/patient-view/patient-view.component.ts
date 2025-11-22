import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Route, Router } from "@angular/router";

@Component({
  selector: 'app-modal-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './patient-view.component.html',
})
export class PatientViewComponent {

  constructor(private route: Router) {}

  logout() {
    sessionStorage.removeItem('patient');
    this.route.navigate(['/authentication/sign-in-user'])
  }

  seeHistory() {
    this.route.navigate(['/patient/history'])
  }

}
