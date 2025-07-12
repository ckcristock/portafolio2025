// src/app/services/file-upload.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private baseApiUrl = 'http://localhost:8000/api'; // URL base de tu API

  constructor(private http: HttpClient) {}

  /**
   * Sube un archivo de equipos al backend.
   * POST /api/teams/upload
   * @param file El archivo a subir (File).
   */
  uploadTeamsFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseApiUrl}/teams/upload`, formData);
  }

  /**
   * Sube un archivo de jugadores al backend.
   * POST /api/players/upload
   * @param file El archivo a subir (File).
   */
  uploadPlayersFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseApiUrl}/players/upload`, formData);
  }
}
