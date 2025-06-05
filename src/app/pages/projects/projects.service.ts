import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { URL_SERVICIOS } from "@core/models/config";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ProjectsService {


  urlBaseServices: string = URL_SERVICIOS;

  constructor(private readonly http: HttpClient) { };

  /**
   * Crea un proyecto
   * @param data
   * @returns
   */
  createProject(data: any): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/projects/create`;
    return this.http.post<any>(endpoint, data)
  }

  /**
   * Actualiza un proyecto
   * @param projectId
   * @param projectData
   * @returns
   */
  updateProject(projectId: number, projectData: any): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/projects/update/${projectId}`;
    return this.http.put<any>(endpoint, projectData)
  }

  /**
   * Elimina un proyecto
   * @param userId
   * @returns
   */
  deleteProject(userId: number): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/projects/delete/${userId}`;
    return this.http.delete<any>(endpoint)
  }

  /**
   * Obtiene todos los proyectos disponibles para el usuario actualmente logueado
   * @param filters
   * @returns
   */
  getAllProjects(filters: any): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/projects`;
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
  getProjectById(id: number): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/projects/${id}`;
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
    const endpoint = `${this.urlBaseServices}/api/v1/projects/disassociate`;
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
    const endpoint = `${this.urlBaseServices}/api/v1/projects/users/availables/${projectId}`;
    return this.http.get<any>(endpoint)
  }

}
