import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Prescription } from '../models/data.models';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionService {
  private prescriptions: Prescription[] = [
    // Fórmulas para Sofía García (id_cliente: 1)
    {
      id_formula: 1,
      id_cliente: 1,
      fecha: '2025-06-20',
      od_esfera: -1.75,
      od_cilindro: -0.5,
      od_eje: 95,
      od_av: '20/20',
      oi_esfera: -2.25,
      oi_cilindro: -0.75,
      oi_eje: 175,
      oi_av: '20/20',
      dp: 61.0,
      adicion: 2.25,
      observaciones:
        'Prescripción más reciente. Se recomienda antireflejo y Blue Block.',
      imageUrl:
        'https://i.postimg.cc/J4v1h6V7/eyeglass-prescription-example.png',
    },
    {
      id_formula: 2,
      id_cliente: 1,
      fecha: '2024-05-15',
      od_esfera: -1.5,
      od_cilindro: -0.5,
      od_eje: 90,
      od_av: '20/25',
      oi_esfera: -2.0,
      oi_cilindro: -0.75,
      oi_eje: 180,
      oi_av: '20/20',
      dp: 60.5,
      adicion: 2.0,
      observaciones:
        'Revisión anual. Paciente reporta leve cansancio al final del día.',
      imageUrl:
        'https://i.postimg.cc/J4v1h6V7/eyeglass-prescription-example.png',
    },
    {
      id_formula: 4,
      id_cliente: 1,
      fecha: '2023-04-30',
      od_esfera: -1.25,
      od_cilindro: -0.5,
      od_eje: 90,
      od_av: '20/30',
      oi_esfera: -1.75,
      oi_cilindro: -0.5,
      oi_eje: 180,
      oi_av: '20/25',
      dp: 60.5,
      adicion: 2.0,
      observaciones:
        'Primera prescripción registrada en el sistema. Lentes de lectura.',
    },
    // Fórmula para Carlos Martinez (id_cliente: 2)
    {
      id_formula: 3,
      id_cliente: 2,
      fecha: '2025-01-15',
      od_esfera: -0.5,
      od_cilindro: 0,
      od_eje: 0,
      od_av: '20/20',
      oi_esfera: -0.75,
      oi_cilindro: 0,
      oi_eje: 0,
      oi_av: '20/20',
      dp: 62.0,
      adicion: 1.5,
      observaciones: 'Lentes para lectura ocasional.',
    },
  ];

  constructor() {}

  getPrescriptions(clientId: number): Observable<Prescription[]> {
    return of(this.prescriptions.filter((p) => p.id_cliente === clientId)).pipe(
      map((prescriptions) =>
        prescriptions.sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        )
      )
    );
  }

  addPrescription(
    prescription: Omit<Prescription, 'id_formula'>
  ): Observable<Prescription> {
    const newId =
      this.prescriptions.length > 0
        ? Math.max(...this.prescriptions.map((p) => p.id_formula)) + 1
        : 1;
    const newPrescription = { ...prescription, id_formula: newId };
    this.prescriptions.push(newPrescription);
    return of(newPrescription);
  }

  updatePrescription(
    prescriptionToUpdate: Prescription
  ): Observable<Prescription> {
    const index = this.prescriptions.findIndex(
      (p) => p.id_formula === prescriptionToUpdate.id_formula
    );
    if (index > -1) {
      this.prescriptions[index] = prescriptionToUpdate;
    }
    return of(prescriptionToUpdate);
  }

  deletePrescription(id: number): Observable<{}> {
    const index = this.prescriptions.findIndex((p) => p.id_formula === id);
    if (index > -1) {
      this.prescriptions.splice(index, 1);
    }
    return of({});
  }
}
