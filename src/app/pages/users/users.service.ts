import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { URL_SERVICIOS } from "@core/models/config";
import User from "@core/models/user.model";
import { interpolateMagma } from "d3";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class UserService {


  urlBaseServices: string = URL_SERVICIOS;

  constructor(private readonly http: HttpClient) { };

  /**
   * Crea un usuario
   * @param userData
   * @returns
   */
  createUser(userData: any): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/users/create`;
    return this.http.post<any>(endpoint, userData)
  }

  /**
   * Actualiza un usuario
   * @param userId
   * @param userData
   * @returns
   */
  updateUser(userId: number, userData: any): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/users/update/${userId}`;
    return this.http.put<any>(endpoint, userData)
  }

  /**
   * Elimina un usuario por su id
   * @param userId
   * @returns
   */
  deleteUser(userId: number): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/users/delete/${userId}`;
    return this.http.delete<any>(endpoint)
  }

  /**
   * Obtiene todos los usuarios de un administrador
   * @param filters
   * @returns
   */
  getAllUserByAdministrator(filters?: { name: string; email: string; }): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/users`;
    const params = new HttpParams({fromObject: {
      nombre: filters?.name || '',
      email: filters?.email || ''
    }})
    return this.http.get<any>(endpoint, {params})
  }

  /**
   * Obtiene todos los usuarios del rol administrador
   */
  getAllAdministrator(): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/users/rol/1`;
    return this.http.get<any>(endpoint).pipe(
      map((response) => {
        if(!response.users) return response;

        response.users.map((administrator: any) => {
          administrator.administrador_id = Number(administrator.administrador_id);
          return administrator;
        })

        return response;

      })
    )
  }

  /**
   * Obtiene todos los usuarios activos
   */
  getAllUsers(): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/users/rol/2`;
    return this.http.get<any>(endpoint)
  }

  /**
   * Obtiene un usuario en especifico
   * @param id
   * @returns
   */
  getUserById(id: number): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/users/${id}`;
    return this.http.get<any>(endpoint).pipe(
      map((response) => {
        const user = response.user;
        user.administrador_id = user.administrador_id ? Number(user.administrador_id) : undefined;
        return response;
      })
    )
  }

}
