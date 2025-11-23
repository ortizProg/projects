import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-in-user',
  templateUrl: './sign-in-user.component.html',
  styleUrls: ['./sign-in-user.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  standalone: true,
})
export class SignInUserComponent implements OnInit {
  authForm!: UntypedFormGroup;
  submitted = false;
  loading = false;
  returnUrl!: string;
  error = '';
  hide = true;

  email = '';
  password = '';

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
  ) { }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      id: [null, Validators.required],
      expeditionDate: [null, Validators.required]
    });
  }
  get f() {
    return this.authForm.controls;
  }

  onSubmit() {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }
    this.submitted = true;
    this.loading = true;
    
    const { id, expeditionDate } = this.authForm.value;
    // Formatear fecha si es necesario, asumiendo que el input date devuelve YYYY-MM-DD
    // Si es un objeto Date, convertirlo a string
    let formattedDate = expeditionDate;
    if (expeditionDate instanceof Date) {
        formattedDate = expeditionDate.toISOString().split('T')[0];
    }

    this.authService.loginPatient(id, formattedDate).subscribe({
      next: (res) => {
        this.loading = false;
        sessionStorage.setItem('accessToken', res.token);
        // Redirigir a la página de historias clínicas del paciente
        this.router.navigate([`/patient`]);
      },
      error: (error) => {
        this.loading = false;
        this.submitted = false;
        this.error = error.error?.message || 'Error al iniciar sesión';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.error
        });
      }
    });
  }


}
