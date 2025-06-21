import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- IMPORTANTE: Importa CommonModule
import { ActivatedRoute, RouterModule } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PrescriptionService } from '../../services/prescription.service';
import { ClientService } from '../../services/client.service';
import { Prescription, Client } from '../../models/data.models';

@Component({
  selector: 'app-prescription-list',
  standalone: true,
  // IMPORTANTE: Agrega CommonModule aquí. Esto soluciona los errores
  // de *ngIf, *ngFor y los pipes 'date' y 'number'.
  imports: [CommonModule, RouterModule],
  templateUrl: './prescription-list.component.html',
  styleUrls: ['./prescription-list.component.scss'],
})
export class PrescriptionListComponent implements OnInit {
  // Declaraciones de las propiedades que usará la plantilla HTML
  prescriptions: Prescription[] = [];
  client: Client | undefined; // <-- IMPORTANTE: Esta es la propiedad 'client' que faltaba

  constructor(
    private route: ActivatedRoute,
    private prescriptionService: PrescriptionService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const clientId = Number(params.get('clientId'));
          // Cargar datos del cliente y sus prescripciones
          this.clientService.getClient(clientId).subscribe((client) => {
            this.client = client; // Asignamos el valor a la propiedad 'client'
          });
          return this.prescriptionService.getPrescriptions(clientId);
        })
      )
      .subscribe((prescriptions) => {
        this.prescriptions = prescriptions;
      });
  }
}
