// src/app/services/clean-sheet.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CleanSheetService {
  private apiUrl = 'http://localhost:8000/api/clean-sheets'; // URL para el endpoint de valla menos vencida

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de porteros con la "valla menos vencida".
   * GET /api/clean-sheets
   */
  getCleanSheets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
