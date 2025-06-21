// src/app/services/prescription.service.ts

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Prescription } from '../models/data.models';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionService {
  // Datos de ejemplo simulando la tabla 'formula_optometrica'
  private prescriptions: Prescription[] = [
    {
      id_formula: 1,
      id_cliente: 1,
      fecha: '2025-06-06',
      od_esfera: -1.5,
      od_cilindro: -0.75,
      od_eje: 90,
      oi_esfera: -2,
      oi_cilindro: -0.5,
      oi_eje: 180,
      dp: 60.5,
      adicion: 2,
      observaciones: 'Primer registro de formula con imagen.',
    },
    {
      id_formula: 2,
      id_cliente: 1,
      fecha: '2024-05-20',
      od_esfera: -1.25,
      od_cilindro: -0.75,
      od_eje: 90,
      oi_esfera: -1.75,
      oi_cilindro: -0.5,
      oi_eje: 180,
      dp: 60.5,
      adicion: 2,
      observaciones: 'Revisión anual.',
    },
    {
      id_formula: 3,
      id_cliente: 2,
      fecha: '2025-01-15',
      od_esfera: -0.5,
      od_cilindro: 0,
      od_eje: 0,
      oi_esfera: -0.75,
      oi_cilindro: 0,
      oi_eje: 0,
      dp: 62,
      adicion: 1.5,
      observaciones: 'Lentes para lectura.',
    },
  ];

  constructor() {}

  // Obtener fórmulas de un cliente y ordenarlas por fecha descendente
  getPrescriptions(clientId: number): Observable<Prescription[]> {
    return of(this.prescriptions.filter((p) => p.id_cliente === clientId)).pipe(
      map((prescriptions) =>
        prescriptions.sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        )
      )
    );
  }
}
