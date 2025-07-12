// src/app/services/partido.service.ts
// Este servicio manejará las operaciones CRUD para los partidos y todas las
// operaciones relacionadas con las estadísticas de jugadores por partido (match_players).
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PartidoService {
  private apiUrl = 'http://localhost:8000/api/matches'; // URL base para los endpoints de partidos

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los partidos.
   * GET /api/matches
   */
  getPartidos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Obtiene un partido por su ID.
   * GET /api/matches/{id}
   * @param id El ID del partido.
   */
  getPartido(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo partido.
   * POST /api/matches
   * @param partido Los datos del nuevo partido.
   */
  createPartido(partido: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, partido);
  }

  /**
   * Actualiza un partido existente.
   * PUT /api/matches/{id}
   * @param id El ID del partido a actualizar.
   * @param partido Los datos actualizados del partido.
   */
  updatePartido(id: number, partido: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, partido);
  }

  /**
   * Elimina un partido.
   * DELETE /api/matches/{id}
   * @param id El ID del partido a eliminar.
   */
  deletePartido(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // --- Métodos para MatchPlayer (estadísticas de jugadores en partidos) ---

  /**
   * Obtiene los jugadores y sus estadísticas para un partido específico.
   * GET /api/matches/{partido}/players
   * @param partidoId El ID del partido.
   */
  getMatchPlayers(partidoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${partidoId}/players`);
  }

  /**
   * Adjunta jugadores a un partido y/o actualiza sus estadísticas.
   * POST /api/matches/{partido}/players
   * @param partidoId El ID del partido.
   * @param playersData Un array de objetos con player_id y estadísticas.
   */
  attachPlayersToMatch(
    partidoId: number,
    playersData: any[]
  ): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/${partidoId}/players`, {
      players: playersData,
    });
  }

  /**
   * Actualiza las estadísticas de un jugador específico en un partido.
   * PUT /api/matches/{partido}/players/{player}
   * @param partidoId El ID del partido.
   * @param playerId El ID del jugador.
   * @param stats Los datos de las estadísticas a actualizar.
   */
  updateMatchPlayerStats(
    partidoId: number,
    playerId: number,
    stats: any
  ): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/${partidoId}/players/${playerId}`,
      stats
    );
  }

  /**
   * Desvincula un jugador de un partido.
   * DELETE /api/matches/{partido}/players/{player}
   * @param partidoId El ID del partido.
   * @param playerId El ID del jugador.
   */
  detachPlayerFromMatch(partidoId: number, playerId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/${partidoId}/players/${playerId}`
    );
  }
}
