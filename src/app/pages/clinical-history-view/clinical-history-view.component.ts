import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { ActivatedRoute, Router } from '@angular/router';
import { HealtCentersService } from '../healt-centers/healt-centers.service';

@Component({
  selector: 'app-clinical-history-view',
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
  templateUrl: './clinical-history-view.component.html',
  styleUrl: './clinical-history-view.component.scss'
})
export class ClinicalHistoryViewComponent implements OnInit {
  documentNumber: number = Number(this.routerActivated?.snapshot?.paramMap?.get('document'));

breadscrums = [
    {
      title: 'Gestión de historias clinicas',
      items: [],
      active: 'Visualización'
    }
  ];

  breadscrumsDetails = [
    {
      title: ''
    }
  ]

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _healtCentersService: HealtCentersService,
    private readonly dialogModel: MatDialog,
    private readonly _snackBar: MatSnackBar,
    private router: Router,
    private routerActivated: ActivatedRoute,
  ) {

  }

  ngOnInit() {

  }

}
