// src/app/services/team.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Hace que el servicio esté disponible en toda la aplicación
})
export class TeamService {
  private apiUrl = 'http://localhost:8000/api/teams'; // URL base para los endpoints de equipos en Laravel

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los equipos.
   * GET /api/teams
   */
  getTeams(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Obtiene un equipo por su ID.
   * GET /api/teams/{id}
   * @param id El ID del equipo.
   */
  getTeam(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo equipo.
   * POST /api/teams
   * @param team Los datos del nuevo equipo.
   */
  createTeam(team: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, team);
  }

  /**
   * Actualiza un equipo existente.
   * PUT /api/teams/{id}
   * @param id El ID del equipo a actualizar.
   * @param team Los datos actualizados del equipo.
   */
  updateTeam(id: number, team: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, team);
  }

  /**
   * Elimina un equipo.
   * DELETE /api/teams/{id}
   * @param id El ID del equipo a eliminar.
   */
  deleteTeam(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene la tabla de posiciones de los equipos.
   * GET /api/teams/standings
   */
  getStandings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/standings`);
  }
}
