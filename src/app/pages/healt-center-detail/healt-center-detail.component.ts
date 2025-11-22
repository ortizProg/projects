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
import { HealtCentersService } from '../healt-centers/healt-centers.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';
import { ModalProjectComponent } from '../modal-project/modal-project.component';
import { DateTime } from "luxon";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core';
import { ModalProjectAssignComponent } from '../modal-project-assign/modal-project-assign.component';

@Component({
  selector: 'app-project-detail',
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
  templateUrl: './healt-center-detail.component.html',
  styleUrl: './healt-center-detail.component.scss'
})
export class HealtCenterDetailComponent implements OnInit {

  projectId: number = Number(this.routerActivated?.snapshot?.paramMap?.get('id'));
  showActions: boolean = true;

  displayedColumns: string[] = [
    'icon',
    'name',
    'action'
  ]

  project: any;

  breadscrums = [
    {
      title: 'Gestión de proyectos',
      items: ['Proyectos'],
      active: 'Información proyecto'
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

  userList: any[] = [];

  isLoading = false;

  projectDefaultFilterSearch: any = {
    name: undefined,
  }

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _healtCentersService: HealtCentersService,
    private readonly dialogModel: MatDialog,
    private readonly _snackBar: MatSnackBar,
    private routerActivated: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {

  }

  ngOnInit() {

    this.getProject();

  }

  // Obtiene la data del proyecto
  getProject() {
    this._healtCentersService.getById(this.projectId).subscribe((response) => {
      this.project = response.projects;
      this.verifyActionsAllow(this.project.administrador_id);
      this.getAllUsers(response.projects.usuarios);
    })
  }

  // Verifica si el usuario tiene permitido realizar acciones en el proyecto
  private verifyActionsAllow(administradorId: number) {
    const user = this.authService.getAuthFromSessionStorage() ?? {};
    this.showActions = administradorId == user?.id;
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
    });

}

  // Obtiene todos los usuarios asociados al proyecto
  private getAllUsers(users: any[]) {
    this.isLoading = true;
    this.userList = users;
    this.dataSource.data = users;
    this.dataSource.paginator = this.paginator;
    this.isLoading = false;
  }

  // Abre el modal para abrir el formulario
  openModal(id: number) {
    const dialogRef = this.dialogModel.open(ModalProjectAssignComponent, {
      data: {id} // Puedes enviar datos iniciales al modal
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getProject();
    })
  }

  //Elimina la asociación de un usuario con el proyecto
  disassociation(id: number) {
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
        this._healtCentersService.disassociateUser(id, this.projectId).subscribe({
          next: (response) => {
            this._snackBar.open(response.message, 'Cerrar', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });

            // Actualizar la lista de usuarios despues de eliminar un usuario
            this.getProject(); // Método que carga los datos del proyecto
          },
          error: (error) => {
            const errorMessage = error.error?.message || 'Error al eliminar el usuario';
            this._snackBar.open(errorMessage, 'Cerrar', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  formatDate(date: string) {
    if(!date) return '';
    return DateTime.fromISO(date).toFormat('yyyy-MM-dd');
  }

  back() {
    this.router.navigate([`/pages/healt-centers`])
  }

}
