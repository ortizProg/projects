import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { UserService } from "../users/users.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { debounceTime, distinctUntilChanged } from "rxjs";
import Swal from "sweetalert2";
import { ROLES } from "@shared/models/enums";
import { HealtCentersService } from "../healt-centers/healt-centers.service";


@Component({
  selector: 'app-modal-project',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './modal-project.component.html',
  styleUrl: './modal-project.component.scss'
})
export class ModalProjectComponent implements OnInit {

  id!: number;
  formProject!: FormGroup;
  administratorValues: any[] = [];
  showFieldAdministrator: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly _formBuilder: FormBuilder,
    private readonly _healtCentersService: HealtCentersService,
    private readonly dialogRef: MatDialogRef<ModalProjectComponent>,
    private readonly _snackBar: MatSnackBar,
    private readonly _userService: UserService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.analizeAdministratorField();
    this.loadData(this.data.id);
    this.getAllAdministrator();
  }

  // Carga los datos necesarios para iniciar el formulario
  private loadData(id: number) {

    this.id = id;

    if(!id) return this.initForm();

    this.getDataByProject(id);

  }

  /**
   * Obtiene la data inicial del proyecto
  */
  private getDataByProject(id: number) {
    this._healtCentersService.getById(id).subscribe({
      next: (response) => {
        this.initForm();
        this.formProject.patchValue(response.projects)
      },
      error: (err) => {
        console.log(err);
      }
    })

  }

  /**
   * Inicia el formgroup para el formulario
  */
  private initForm() {
    this.formProject = this._formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      administrador_id: [undefined],
    })
  }

  /**
   * Validador personalizado para la contraseña
  */
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password?.value !== confirmPassword?.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  /**
   * Obtiene todos los administradores disponibles
  */
  getAllAdministrator() {
    this._userService.getAllAdministrator().subscribe({
      next: (res) => {
        this.administratorValues = res.users;
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  analizeAdministratorField() {
    if(!this.data.id) return this.hideAdministratorField();

    this.showAdministratorField();
  }

  /**
   * Oculta el field administrador y elimina las validaciones
  */
  private hideAdministratorField() {
    this.showFieldAdministrator = false;

    const control = this.formProject.get('administrador_id');

    // Filtra el validador que quieres eliminar (ej: Validators.email)
    const newValidators = control?.validator
      ? [] // Mantén solo los necesarios
      : null;

    // Asigna los nuevos validadores
    control?.setValidators(newValidators);

    // Actualiza el estado
    control?.updateValueAndValidity();

  }

  /**
   * Muestra el field administrador
   */
  private showAdministratorField() {
    this.showFieldAdministrator = true;
    console.log("🚀 ~ ModalProjectComponent ~ showAdministratorField ~ this.showFieldAdministrator:", this.showFieldAdministrator)
    this.formProject.get('administrador_id')?.addValidators(Validators.required);
  }

  onSubmit() {

    //Valida que el formulario no sea valido

    if(this.formProject.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos', 'error');
      return;
    }

    if(!this.id) return this.create();

    this.update()
  }

  private create() {

    // Se obtiene la informacion necesaria

    const userDataInformation = {
      nombre: this.formProject.get('nombre')?.value,
      descripcion: this.formProject.get('descripcion')?.value,
      administrador_id: this.formProject.get('administrador_id')?.value,
    }

    // Envia la petición para crear el proyecto

    this._healtCentersService.create(userDataInformation).subscribe({
      next: (response) => {
        this._snackBar.open(response.message, 'Cerrar', {duration: 5000});
        this.formProject.reset();
        this.dialogRef.close(true);
      },
      error: (error) => {
        const errorMessage = error.error?.result || 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
        this._snackBar.open(errorMessage, 'Cerrar', {duration: 5000});
      }
    })
  }

  /**
   * Actualiza un proyecto existente
  */
  private update() {

    // Se obtiene la informacion necesaria

    const dataInformation = {
      nombre: this.formProject.get('nombre')?.value,
      descripcion: this.formProject.get('descripcion')?.value,
      administrador_id: this.formProject.get('administrador_id')?.value,
    }

    // Envia la petición para actualizar el proyecto

    this._healtCentersService.update(this.id, dataInformation).subscribe({
      next: (response) => {
        this._snackBar.open(response.message, 'Cerrar', {duration: 5000});
        this.formProject.reset();
        this.dialogRef.close(true);
      },
      error: (error) => {
        const errorMessage = error.error?.result || 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
        this._snackBar.open(errorMessage, 'Cerrar', {duration: 5000});
      }
    })
  }

}
