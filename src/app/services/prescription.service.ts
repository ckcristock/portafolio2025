import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Prescription } from '../models/data.models';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionService {
  private apiUrl = 'http://localhost:8000/api/formulas';

  constructor(private http: HttpClient) {}

  // Obtiene las fórmulas y las ordena por fecha en el frontend
  getPrescriptions(clientId: number): Observable<Prescription[]> {
    return this.http
      .get<Prescription[]>(`${this.apiUrl}/cliente/${clientId}`)
      .pipe(
        map((prescriptions) => {
          if (!prescriptions || prescriptions.length === 0) {
            return [];
          }
          // Aseguramos el orden descendente por fecha
          return prescriptions.sort(
            (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          );
        })
      );
  }

  // Para crear, usamos FormData por la imagen
  addPrescription(formData: FormData): Observable<Prescription> {
    return this.http.post<Prescription>(this.apiUrl, formData);
  }

  // Para actualizar, también usamos FormData con POST, como lo espera el backend
  updatePrescription(id: number, formData: FormData): Observable<Prescription> {
    // Laravel usa una ruta POST para la actualización con archivos
    return this.http.post<Prescription>(`${this.apiUrl}/${id}`, formData);
  }

  deletePrescription(id: number): Observable<{}> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
