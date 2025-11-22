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
    if(this.submitted) return;
    if(this.authForm.invalid) return;
    this.submitted = true;
    sessionStorage.setItem('patient', JSON.stringify(this.authForm.value));
    this.router.navigate(['/patient'])
  }


}
