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



export interface User{
  name: string;
}

@Component({
  selector: 'app-modal-user',
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
  templateUrl: './modal-user.component.html',
  styleUrl: './modal-user.component.scss'
})
export class ModalUserComponent implements OnInit {

  id!: number;
  formCreateUser!: FormGroup;
  administratorValues: any[] = [];
  showFieldAdministrator: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly _formBuilder: FormBuilder,
    private readonly _userService: UserService,
    private readonly dialogRef: MatDialogRef<ModalUserComponent>,
    private readonly _snackBar: MatSnackBar
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadData(this.data.id);
    this.getAllAdministrator();
  }

  // Carga los datos necesarios para iniciar el formulario
  private loadData(id: number) {

    this.id = id;

    if(!id) return this.initForm();

    this.getDataByUser(id);

  }

  /**
   * Obtiene la data inicial del usuario
  */
  private getDataByUser(id: number) {
    this._userService.getUserById(id).subscribe({
      next: (response) => {
        this.initForm();
        this.formCreateUser.patchValue(response.user)
        this.onChangeRole(response.user.rol_id)
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
    this.formCreateUser = this._formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])],
      password: ['', !this.id ? Validators.required : undefined],
      confirmPassword: ['', !this.id ? Validators.required : undefined],
      rol_id: ['', Validators.required],
      administrador_id: [''],
    }, { validators: this.passwordMatchValidator })
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

  onChangeRole(value: string | number) {
    if(Number(value) === ROLES.ADMIN) return this.hideAdministratorField();

    this.showAdministratorField();
  }

  /**
   * Oculta el field administrador y elimina las validaciones
  */
  private hideAdministratorField() {
    this.showFieldAdministrator = false;

    const control = this.formCreateUser.get('administrador_id');

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
    this.formCreateUser.get('administrador_id')?.addValidators(Validators.required);
  }

  onSubmit() {

    //Valida que el formulario no sea valido

    if(this.formCreateUser.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos', 'error');
      return;
    }

    if(!this.id) return this.create();

    this.update()
  }

  private create() {

    // Se obtiene la informacion necesaria

    const userDataInformation = {
      nombre: this.formCreateUser.get('nombre')?.value,
      email: this.formCreateUser.get('email')?.value,
      password: this.formCreateUser.get('password')?.value,
      rol_id: this.formCreateUser.get('rol_id')?.value,
      administrador_id: this.formCreateUser.get('administrador_id')?.value,
    }

    // Envia la petición para crear el usuario

    this._userService.createUser(userDataInformation).subscribe({
      next: (response) => {
        this._snackBar.open(response.message, 'Cerrar', {duration: 5000});
        this.formCreateUser.reset();
        this.dialogRef.close(true);
      },
      error: (error) => {
        const errorMessage = error.error?.result || 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
        this._snackBar.open(errorMessage, 'Cerrar', {duration: 5000});
      }
    })
  }

  /**
   * Actualiza un usuario existente
  */
  private update() {

    // Se obtiene la informacion necesaria

    const userDataInformation = {
      nombre: this.formCreateUser.get('nombre')?.value,
      email: this.formCreateUser.get('email')?.value,
      rol_id: this.formCreateUser.get('rol_id')?.value,
      administrador_id: this.formCreateUser.get('administrador_id')?.value,
    }

    // Envia la petición para actualizar el usuario

    this._userService.updateUser(this.id, userDataInformation).subscribe({
      next: (response) => {
        this._snackBar.open(response.message, 'Cerrar', {duration: 5000});
        this.formCreateUser.reset();
        this.dialogRef.close(true);
      },
      error: (error) => {
        const errorMessage = error.error?.result || 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
        this._snackBar.open(errorMessage, 'Cerrar', {duration: 5000});
      }
    })
  }

}
