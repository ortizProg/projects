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
import { ModalUploadPdfComponent } from '../modal-upload-pdf/modal-upload-pdf.component';
import { DateTime } from "luxon";
import { ActivatedRoute, Router } from '@angular/router';
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
    MatProgressSpinnerModule,
    ModalUploadPdfComponent
  ],
  templateUrl: './clinical-histories.component.html',
  styleUrl: './clinical-histories.component.scss'
})
export class ClinicalHistoriesComponent implements OnInit {
  documentNumber: number = Number(this.routerActivated?.snapshot?.paramMap?.get('document'));

  displayedColumns: string[] = [
    'centro_salud',
    'fecha_de_consulta',
    'descripcion',
    'action'
  ]

  breadscrums = [
    {
      title: 'Gestión de historias clinicas',
      items: [],
      active: `${this.documentNumber}`
    }
  ];

  breadscrumsDetails = [
    {
      title: ''
    }
  ]

  // table
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

  // search
  projectFormSearchFilter!: FormGroup;

  projectsList: any[] = [];

  isLoading = false;

  projectDefaultFilterSearch: any = {
    name: undefined,
    email: undefined
  }

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
    this.createprojectFormSearchFilter();
    this.getAllProjects();
    this.handleprojectFilterChange('name', 'name');
    this.handleprojectFilterChange('email', 'email');
  }

  private createprojectFormSearchFilter() {
    this.projectFormSearchFilter = this._formBuilder.group({
      name: [''],
      email: ['']
    })
  }

  // Escucha los cambios en los filtros de nombre y email
  private handleprojectFilterChange(controlName: string, filterKey: string) {
    this.projectFormSearchFilter.controls[controlName].valueChanges.pipe(
    debounceTime(500),
    distinctUntilChanged()
    ).subscribe((value: any ) => {
    this.projectDefaultFilterSearch[filterKey] = value;
    console.log(this.projectDefaultFilterSearch);
    this.getAllProjects({ ...this.projectDefaultFilterSearch, [filterKey]: value });
    });

}

  // Obtiene todos los projectos asociados al proyecto
  private getAllProjects(filters?: any) {
    this.isLoading = true;
    this._healtCentersService.getAll(filters).subscribe({
      next: (response) => {

        const data = [
          {
            id: 1,
            centro_salud: 'Sura 30 de Agosto',
            descripcion: 'Consulta por operación de mano',
            fecha_de_consulta: '2025-06-03T22:51:32.918Z',
          },
          {
            id: 2,
            centro_salud: 'Sura 30 de Agosto',
            descripcion: 'Consulta post operatoria',
            fecha_de_consulta: '2025-05-03T22:51:32.918Z',
          },
          {
            id: 3,
            centro_salud: 'Idime Dosquebradas',
            descripcion: 'Consulta por accidente laboral',
            fecha_de_consulta: '2025-03-03T22:51:32.918Z',
          }
        ];

        this.projectsList = data;
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    })
  }

  // Abre el modal para abrir el formulario
  openModal(id?: number) {
    if (id) {
      // Si hay ID, es edición, usamos el modal de proyecto (o el que corresponda para editar)
      // Asumiendo que la edición sigue usando ModalProjectComponent o similar
      const dialogRef = this.dialogModel.open(ModalProjectComponent, {
        data: {id}
      });

      dialogRef.afterClosed().subscribe(() => {
        this.getAllProjects();
      })
    } else {
      // Si no hay ID, es creación/subida, usamos el nuevo modal de PDF
      const dialogRef = this.dialogModel.open(ModalUploadPdfComponent, {
        width: '600px',
        data: {}
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.getAllProjects();
        }
      })
    }
  }

  //Elimina un proyecto
  deleteProject(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this._healtCentersService.delete(id).subscribe({
          next: (response) => {
            this._snackBar.open(response.message, 'Cerrar', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });

            // Actualizar la lista de proyectos después de eliminar
            this.getAllProjects(); // Método que carga los proyectos
          },
          error: (error) => {
            const errorMessage = error.error?.message || 'Error al eliminar el proyecto';
            this._snackBar.open(errorMessage, 'Cerrar', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  viewDetailByHealtCenter(id: number) {
    this.router.navigate([`/pages/clinical-history/${id}`])
  }

  formatDate(date: string) {
    return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_SHORT);
  }

}
