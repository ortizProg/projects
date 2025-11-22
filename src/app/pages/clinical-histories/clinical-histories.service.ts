import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { URL_SERVICIOS } from "@core/models/config";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ClinicalHistoriesService {


  urlBaseServices: string = URL_SERVICIOS;

  constructor(private readonly http: HttpClient) { };

  /**
   * Crea un centro de salud
   * @param data
   * @returns
   */
  create(data: any): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/healt-centers/create`;
    return this.http.post<any>(endpoint, data)
  }

  /**
   * Actualiza un proyecto
   * @param projectId
   * @param projectData
   * @returns
   */
  update(projectId: number, projectData: any): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/healt-centers/update/${projectId}`;
    return this.http.put<any>(endpoint, projectData)
  }

  /**
   * Elimina un proyecto
   * @param userId
   * @returns
   */
  delete(userId: number): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/healt-centers/delete/${userId}`;
    return this.http.delete<any>(endpoint)
  }

  /**
   * Obtiene todos los proyectos disponibles para el usuario actualmente logueado
   * @param filters
   * @returns
   */
  getAll(filters: any): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/healt-centers`;
    const params = new HttpParams({fromObject: {
      nombre: filters?.name || '',
      email: filters?.email || ''
    }})
    return this.http.get<any>(endpoint, {params})
  }

  /**
   * Obtiene la información de un proyecto
   * @param id
   * @returns
   */
  getById(id: number): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/healt-centers/${id}`;
    return this.http.get<any>(endpoint).pipe(
      map((response) => {
        const project = response.projects;
        project.administrador_id = project.administrador_id ? Number(project.administrador_id) : undefined;
        return response;
      })
    )
  }

  /**
   * Elimina la asociación de un usuario con un proyecto
   * @param userId
   * @param projectId
   * @returns
   */
  disassociateUser(userId: number, projectId: number) {
    const endpoint = `${this.urlBaseServices}/api/v1/healt-centers/disassociate`;
    return this.http.delete<any>(
      endpoint,
      {
        body: {
          usuario_id: userId,
          proyecto_id: projectId
        }
      }
    );
  }

  /**
   * Obtiene todos los usuarios que pueden, pero no han sido asociados a un proyecto
   * @param projectId
   * @returns
   */
  getAllAvailableUsers(projectId: number): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/healt-centers/users/availables/${projectId}`;
    return this.http.get<any>(endpoint)
  }

  /**
   * Obtiene las historias clinicas de un paciente por su numero de documento
   * @param documentNumber
   * @returns
   */
  getHistoryByPatientId(documentNumber: number): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/clinical-histories/patient/${documentNumber}`;
    return this.http.get<any>(endpoint);
  }

}
