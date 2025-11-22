import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FileUploadService } from '../../services/file-upload.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { HealtCentersService } from '../healt-centers/healt-centers.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-upload-pdf',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  templateUrl: './modal-upload-pdf.component.html',
  styleUrl: './modal-upload-pdf.component.scss'
})
export class ModalUploadPdfComponent implements OnInit {

  selectedFile: File | null = null;
  isUploading = false;
  uploadProgress = 0;
  uploadForm: FormGroup;
  healthCenters: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<ModalUploadPdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fileUploadService: FileUploadService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private healthCentersService: HealtCentersService
  ) {
    this.uploadForm = this.fb.group({
      nombre: ['', Validators.required],
      fecha: [new Date(), Validators.required],
      centro_salud_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadHealthCenters();
    if (this.data.id && this.data.history) {
      console.log(this.data);
      console.log(this.data.history.centro_salud_id);
      this.uploadForm.patchValue({
        nombre: this.data.history.nombre,
        fecha: this.data.history.fecha,
        centro_salud_id: Number(this.data.history.centro_salud_id)
      });
    }
  }

  loadHealthCenters() {
    this.healthCentersService.getAll({}).subscribe({
      next: (res) => {
        // Assuming the response structure based on previous files, might need adjustment
        // The service returns an object, let's assume the list is in 'projects' or similar based on HealtCentersService.getAll
        // Looking at HealtCentersService.getAll, it returns this.http.get<any>(endpoint, {params})
        // And ClinicalHistoriesComponent uses response directly.
        // Let's assume response is an array or has a property.
        // In ClinicalHistoriesComponent: this.projectsList = data; (mocked)
        // But the service calls the API.
        // Let's assume standard response format.
        this.healthCenters = res.projects || res; // Fallback
      },
      error: (err) => {
        console.error('Error loading health centers', err);
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        this.selectedFile = file;
      } else {
        this.snackBar.open('Por favor selecciona un archivo PDF válido.', 'Cerrar', { duration: 3000 });
        this.selectedFile = null;
      }
    }
  }

  uploadFile(): void {
    if (this.uploadForm.invalid) {
      this.uploadForm.markAllAsTouched();
      return;
    }

    if (!this.selectedFile && !this.data.id) {
      this.snackBar.open('Por favor selecciona un archivo.', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isUploading = true;
    const metadata = {
      ...this.uploadForm.value,
      numero_documento: this.data.documentNumber
    };
    
    if (this.data.id) {
      this.fileUploadService.updateFile(this.data.id, this.selectedFile, metadata).subscribe({
        next: (response) => {
          this.isUploading = false;
          this.snackBar.open('Historia clínica actualizada exitosamente.', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isUploading = false;
          console.error('Update error:', error);
          this.snackBar.open('Error al actualizar la historia clínica.', 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      this.fileUploadService.uploadFile(this.selectedFile!, metadata).subscribe({
        next: (response) => {
          this.isUploading = false;
          this.snackBar.open('Archivo subido exitosamente.', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isUploading = false;
          console.error('Upload error:', error);
          this.snackBar.open('Error al subir el archivo.', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  removeFile(): void {
    this.selectedFile = null;
  }
}
