// src/app/services/player.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private apiUrl = 'http://localhost:8000/api/players'; // URL base para los endpoints de jugadores

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los jugadores.
   * GET /api/players
   */
  getPlayers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Obtiene un jugador por su ID.
   * GET /api/players/{id}
   * @param id El ID del jugador.
   */
  getPlayer(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo jugador.
   * POST /api/players
   * @param player Los datos del nuevo jugador.
   */
  createPlayer(player: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, player);
  }

  /**
   * Actualiza un jugador existente.
   * PUT /api/players/{id}
   * @param id El ID del jugador a actualizar.
   * @param player Los datos actualizados del jugador.
   */
  updatePlayer(id: number, player: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, player);
  }

  /**
   * Elimina un jugador.
   * DELETE /api/players/{id}
   * @param id El ID del jugador a eliminar.
   */
  deletePlayer(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene la lista de los máximos goleadores.
   * GET /api/players/top-scorers
   */
  getTopScorers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top-scorers`);
  }
}
