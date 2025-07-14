import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-team-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './team-form-modal.component.html',
  styleUrls: ['./team-form-modal.component.scss'],
})
export class TeamFormModalComponent implements OnInit {
  team: any = { id: null, name: '', city: '' }; // Objeto para el equipo: id (null para nuevo), name, city
  isEditMode: boolean = false; // Bandera para saber si es edición (true) o creación (false)
  modalTitle: string = 'Crear Nuevo Equipo'; // Título del modal
  modalErrorMessage: string = ''; // Mensaje de error para validaciones internas del modal

  constructor(
    public dialogRef: MatDialogRef<TeamFormModalComponent>, // Referencia para cerrar el diálogo
    @Inject(MAT_DIALOG_DATA) public data: any // Datos inyectados al modal (aquí esperamos el objeto 'team' si es edición)
  ) {
    // Si se recibió un objeto 'team' en los datos (significa que es modo edición)
    if (data && data.team) {
      this.team = { ...data.team }; // Clonar el objeto para no modificar el original directamente en el formulario
      this.isEditMode = true; // Establecer modo edición
      this.modalTitle = 'Editar Equipo'; // Cambiar título del modal
    }
  }

  ngOnInit(): void {
    // Método que se ejecuta al inicializar el componente. Puedes añadir lógica adicional aquí si es necesario.
  }

  /**
   * Maneja el envío del formulario del modal.
   * Valida los datos y cierra el modal pasando el objeto 'team'.
   */
  onSubmit(): void {
    // Validación simple en el frontend
    if (!this.team.name) {
      this.modalErrorMessage = 'El nombre del equipo es obligatorio.';
      return; // No cierra el modal si hay error
    }
    this.dialogRef.close(this.team); // Cierra el modal y devuelve el objeto equipo (con o sin id)
  }

  /**
   * Cierra el modal sin guardar ningún cambio.
   */
  onCancel(): void {
    this.dialogRef.close(); // Cierra el modal sin devolver ningún valor (se interpreta como cancelación)
  }
}
