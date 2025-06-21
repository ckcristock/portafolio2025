import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core'; // <-- Importamos ViewChild y ElementRef
import { CommonModule, formatDate } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
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

  validationErrors: { [key: string]: string[] } = {};
  isSaving = false; // <-- AÑADIDO: Propiedad para el estado de carga

  // --- AÑADIDO: Referencia al contenedor del modal para hacer scroll ---
  @ViewChild('formModal') formModal!: ElementRef;

  @HostListener('window:keydown.escape', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.showForm) {
      this.closeForm();
    }
  }

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
    this.validationErrors = {};
    this.isSaving = true; // <-- Activamos el estado de carga

    const formData = new FormData();
    Object.keys(this.currentPrescription).forEach((key) => {
      const value = (this.currentPrescription as any)[key];
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
      saveObservable = this.prescriptionService.updatePrescription(
        this.currentPrescription.id_formula!,
        formData
      );
    } else {
      formData.append('id_cliente', this.clientId.toString());
      saveObservable = this.prescriptionService.addPrescription(formData);
    }

    saveObservable.subscribe({
      next: () => {
        this.isSaving = false; // <-- Desactivamos el estado de carga
        this.loadPrescriptions().subscribe();
        this.closeForm();
      },
      error: (err: HttpErrorResponse) => {
        this.isSaving = false; // <-- Desactivamos el estado de carga
        if (err.status === 422 && err.error && err.error.errors) {
          this.validationErrors = err.error.errors;
          // --- AÑADIDO: Hacemos scroll hacia arriba para mostrar el error ---
          try {
            this.formModal.nativeElement.scrollTop = 0;
          } catch (scrollErr) {
            console.error('No se pudo hacer scroll al error', scrollErr);
          }
        } else {
          this.validationErrors = {
            general: [
              'Ocurrió un error inesperado. Por favor, inténtelo de nuevo.',
            ],
          };
        }
        console.error('Error al guardar la fórmula', err);
      },
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
    this.validationErrors = {};
    this.isEditing = false;
    this.selectedFile = null;
    this.currentPrescription = this.getInitialPrescriptionForm();
    this.showForm = true;
  }

  openEditForm(prescription: Prescription): void {
    this.validationErrors = {};
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
