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
import { UserService } from './users.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ModalUserComponent } from '../modal-user/modal-user.component';
import Swal from 'sweetalert2';


export interface User{
  name: string;
}

@Component({
  selector: 'app-users',
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
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'email',
    'role',
    'action'
  ]

  breadscrums = [
    {
      title: 'Gestión de usuarios',
      items: [],
      active: 'Datos básicos'
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
  userFormSearchFilter!: FormGroup;

  usersList: any[] = [];

  isLoading = false;

  userDefaultFilterSearch: any = {
    name: undefined,
    email: undefined
  }

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly dialogModel: MatDialog,
    private readonly _snackBar: MatSnackBar
  ) {

  }

  ngOnInit() {
    this.createUserFormSearchFilter();
    this.getAllUserByAdministrator();
    this.handleUserFilterChange('name', 'name');
    this.handleUserFilterChange('email', 'email');
  }

  private createUserFormSearchFilter() {
    this.userFormSearchFilter = this._formBuilder.group({
      name: [''],
      email: ['']
    })
  }

  // Obtiene el nombre del rol
  getRoleName(rolId: number): string {
    switch (Number(rolId)) {
      case 1:
        return 'Administrador'
      case 2:
        return 'Usuario'
      default:
        return 'Desconocido'
    }
  }

  // Escucha los cambios en los filtros de nombre y email
  private handleUserFilterChange(controlName: string, filterKey: string) {
    this.userFormSearchFilter.controls[controlName].valueChanges.pipe(
    debounceTime(500),
    distinctUntilChanged()
    ).subscribe((value: any ) => {
    this.userDefaultFilterSearch[filterKey] = value;
    console.log(this.userDefaultFilterSearch);
    this.getAllUserByAdministrator({ ...this.userDefaultFilterSearch, [filterKey]: value });
    });

}

  // Obtiene todos los usuarios del administrador
  private getAllUserByAdministrator(filters?: any) {
    this.isLoading = true;
    this.userService.getAllUserByAdministrator(filters).subscribe({
      next: (response) => {
        this.usersList = response.users;
        this.dataSource.data = response.users;
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
    const dialogRef = this.dialogModel.open(ModalUserComponent, {
      data: {id} // Puedes enviar datos iniciales al modal
    });
  }

  //Elimina un usuario
  deleteUser(id: number) {
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
        this.userService.deleteUser(id).subscribe({
          next: (response) => {
            this._snackBar.open(response.message, 'Cerrar', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });

            // Actualizar la lista de usuarios después de eliminar
            this.getAllUserByAdministrator(); // Método que carga los usuarios
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

}
