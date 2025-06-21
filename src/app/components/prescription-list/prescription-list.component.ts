import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PrescriptionService } from '../../services/prescription.service';
import { ClientService } from '../../services/client.service';
import { Prescription, Client } from '../../models/data.models';

@Component({
  selector: 'app-prescription-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './prescription-list.component.html',
  styleUrls: ['./prescription-list.component.scss'],
})
export class PrescriptionListComponent implements OnInit {
  prescriptions: Prescription[] = [];
  client: Client | undefined;

  // Propiedad para guardar la URL de la imagen que se mostrará en el modal
  selectedImageUrl: string | null = null;

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
          this.clientService
            .getClient(clientId)
            .subscribe((client) => (this.client = client));
          return this.prescriptionService.getPrescriptions(clientId);
        })
      )
      .subscribe((prescriptions) => {
        this.prescriptions = prescriptions;
      });
  }

  /**
   * Muestra el modal con la imagen seleccionada.
   * @param imageUrl La URL de la imagen a mostrar.
   */
  showImage(imageUrl: string): void {
    this.selectedImageUrl = imageUrl;
  }

  /**
   * Cierra el modal de la imagen.
   */
  closeImageModal(): void {
    this.selectedImageUrl = null;
  }
}
