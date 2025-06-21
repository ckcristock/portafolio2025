import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs'; // 'of' se importa desde 'rxjs'
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
  currentPrescription!: Partial<Prescription>;
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
        switchMap(() => this.clientService.getClient(this.clientId)), // Corregido: usa getClient
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
      }),
      catchError((error) => {
        console.error('Error al cargar fórmulas:', error);
        this.prescriptions = [];
        return of([]);
      })
    );
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  savePrescription(): void {
    const formData = new FormData();

    // Construimos el FormData a partir del objeto del formulario
    Object.keys(this.currentPrescription).forEach((key) => {
      const value = (this.currentPrescription as any)[key];
      // Solo añadimos el valor si no es nulo, para no enviar campos vacíos innecesarios
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    if (this.selectedFile) {
      formData.append(
        'imagen_formula',
        this.selectedFile,
        this.selectedFile.name
      );
    }

    let saveObservable: Observable<Prescription>;

    if (this.isEditing) {
      // Corregido: Llamada al servicio con los argumentos correctos
      saveObservable = this.prescriptionService.updatePrescription(
        this.currentPrescription.id_formula!,
        formData
      );
    } else {
      formData.append('id_cliente', this.clientId.toString());
      // Corregido: Llamada al servicio con el argumento correcto
      saveObservable = this.prescriptionService.addPrescription(formData);
    }

    saveObservable.subscribe({
      next: () => {
        this.loadPrescriptions().subscribe();
        this.closeForm();
      },
      error: (err) => console.error('Error al guardar la fórmula', err),
    });
  }

  getInitialPrescriptionForm(): Partial<Prescription> {
    return {
      fecha: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      folio_doctor: '',
      od_esfera: 0,
      od_cilindro: 0,
      od_eje: 0,
      av_od: '20/20',
      oi_esfera: 0,
      oi_cilindro: 0,
      oi_eje: 0,
      av_oi: '20/20',
      dp: 0,
      adicion: 0,
      observaciones: '',
      ruta_imagen: '',
    };
  }

  openAddForm(): void {
    this.isEditing = false;
    this.selectedFile = null;
    this.currentPrescription = this.getInitialPrescriptionForm();
    this.showForm = true;
  }

  openEditForm(prescription: Prescription): void {
    this.isEditing = true;
    this.selectedFile = null;
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

  showImage(imageUrl: string | null): void {
    if (imageUrl) {
      this.selectedImageUrl = imageUrl;
    }
  }
  closeImageModal(): void {
    this.selectedImageUrl = null;
  }
}
