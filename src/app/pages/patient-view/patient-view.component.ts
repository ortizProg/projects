import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ClinicalHistoriesService } from "../clinical-histories/clinical-histories.service";

@Component({
  selector: 'app-patient-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './patient-view.component.html',
})
export class PatientViewComponent implements OnInit {

  histories: any[] = [];
  filteredHistories: any[] = [];
  searchTerm: string = '';

  constructor(
    private router: Router,
    private clinicalHistoriesService: ClinicalHistoriesService
  ) {}

  ngOnInit(): void {
    this.getMyHistories();
  }

  getMyHistories() {
    this.clinicalHistoriesService.getMyHistories().subscribe({
      next: (res) => {
        this.histories = res;
        this.filteredHistories = res;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  filterHistories() {
    if (!this.searchTerm) {
      this.filteredHistories = this.histories;
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredHistories = this.histories.filter(h => 
      h.nombre?.toLowerCase().includes(term) ||
      h.doctor?.nombre?.toLowerCase().includes(term) ||
      h.fecha?.includes(term) ||
      h.centro_salud?.nombre?.toLowerCase().includes(term)
    );
  }

  logout() {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('patient');
    this.router.navigate(['/authentication/sign-in-user'])
  }

  seeHistory(url: string) {
    if(url) {
        window.open(url, '_blank');
    }
  }

}
