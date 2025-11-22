import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  // TODO: Update this with the actual endpoint from environment or config
  private apiUrl = 'http://localhost:3000/api/v1/clinical-histories'; 

  constructor(private http: HttpClient) { }

  uploadFile(file: File, metadata: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('nombre', metadata.nombre);
    formData.append('fecha', metadata.fecha);
    formData.append('centro_salud_id', metadata.centro_salud_id);
    formData.append('numero_documento', metadata.numero_documento);

    return this.http.post(this.apiUrl, formData);
  }
}
