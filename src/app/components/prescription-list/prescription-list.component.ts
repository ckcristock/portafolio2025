import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PrescriptionService } from '../../services/prescription.service';
import { ClientService } from '../../services/client.service';
import { Prescription, Client } from '../../models/data.models';

@Component({
  selector: 'app-prescription-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './prescription-list.component.html',
  styleUrls: ['./prescription-list.component.scss'],
})
export class PrescriptionListComponent implements OnInit {
  prescriptions: Prescription[] = [];
  client: Client | undefined;
  clientId!: number;

  selectedImageUrl: string | null = null;

  showForm = false;
  isEditing = false;
  currentPrescription!: Omit<Prescription, 'id_formula'> | Prescription;

  // AÑADIDO: Propiedad para guardar el archivo de imagen seleccionado
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private prescriptionService: PrescriptionService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        tap((params) => {
          this.clientId = Number(params.get('clientId'));
        }),
        switchMap(() => this.clientService.getClient(this.clientId)),
        tap((client) => {
          this.client = client;
        }),
        switchMap(() => this.loadPrescriptions())
      )
      .subscribe();
  }

  loadPrescriptions(): Observable<Prescription[]> {
    return this.prescriptionService.getPrescriptions(this.clientId).pipe(
      tap((prescriptions) => {
        this.prescriptions = prescriptions;
      })
    );
  }

  // AÑADIDO: Método para capturar el archivo del input
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  savePrescription(): void {
    // Aquí es donde en un futuro enviarías el this.selectedFile a tu backend.
    // El backend lo subiría a Azure, y te devolvería la URL.
    // Luego, asignarías esa URL a this.currentPrescription.imageUrl
    // antes de llamar al servicio de guardar.
    console.log('Archivo seleccionado:', this.selectedFile);

    // Como estamos simulando, si hay un archivo, le pondremos una URL de placeholder.
    if (this.selectedFile) {
      this.currentPrescription.imageUrl =
        'https://i.postimg.cc/J4v1h6V7/eyeglass-prescription-example.png';
    }

    if (this.isEditing) {
      this.prescriptionService
        .updatePrescription(this.currentPrescription as Prescription)
        .subscribe(() => {
          this.loadPrescriptions().subscribe();
          this.closeForm();
        });
    } else {
      this.prescriptionService
        .addPrescription(
          this.currentPrescription as Omit<Prescription, 'id_formula'>
        )
        .subscribe(() => {
          this.loadPrescriptions().subscribe();
          this.closeForm();
        });
    }
  }

  openAddForm(): void {
    this.isEditing = false;
    this.selectedFile = null; // Limpiar archivo previo
    this.currentPrescription = {
      ...this.getInitialPrescriptionForm(),
      id_cliente: this.clientId,
    };
    this.showForm = true;
  }

  openEditForm(prescription: Prescription): void {
    this.isEditing = true;
    this.selectedFile = null; // Limpiar archivo previo
    this.currentPrescription = { ...prescription };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  deletePrescription(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta fórmula?')) {
      this.prescriptionService
        .deletePrescription(id)
        .subscribe(() => this.loadPrescriptions().subscribe());
    }
  }

  getInitialPrescriptionForm(): Omit<
    Prescription,
    'id_formula' | 'id_cliente'
  > {
    return {
      fecha: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      od_esfera: 0,
      od_cilindro: 0,
      od_eje: 0,
      oi_esfera: 0,
      oi_cilindro: 0,
      oi_eje: 0,
      dp: 0,
      adicion: 0,
      observaciones: '',
      imageUrl: '',
    };
  }

  showImage(imageUrl: string): void {
    this.selectedImageUrl = imageUrl;
  }
  closeImageModal(): void {
    this.selectedImageUrl = null;
  }
}
