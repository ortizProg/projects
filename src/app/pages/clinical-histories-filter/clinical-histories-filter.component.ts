import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';
import { ModalProjectComponent } from '../modal-project/modal-project.component';
import { DateTime } from "luxon";
import { Router } from '@angular/router';
import { HealtCentersService } from '../healt-centers/healt-centers.service';

@Component({
  selector: 'app-clinical-histories',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    MatFormFieldModule,
    MatOptionModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './clinical-histories-filter.component.html',
  styleUrl: './clinical-histories-filter.component.scss'
})
export class ClinicalHistoriesFilterComponent implements OnInit {

  breadscrums = [
    {
      title: 'Gestión de historias clinicas',
      items: [],
      active: 'Filtro'
    }
  ];

  breadscrumsDetails = [
    {
      title: ''
    }
  ]

  // search
  projectFormSearchFilter!: FormGroup;

  isLoading = false;

  constructor(
    private readonly _formBuilder: FormBuilder,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.createprojectFormSearchFilter();
  }

  private createprojectFormSearchFilter() {
    this.projectFormSearchFilter = this._formBuilder.group({
      documentNumber: [null, Validators.required],
    })
  }

  search() {
    this.router.navigate([`/pages/clinical-histories/${this.projectFormSearchFilter.get('documentNumber')?.value}`])
  }

}
