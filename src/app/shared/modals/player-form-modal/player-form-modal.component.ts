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
import { MatSelectModule } from '@angular/material/select'; // Para seleccionar el equipo

// Importar TeamService para obtener la lista de equipos si es necesario
import { TeamService } from '../../../services/team.service'; // Asegúrate de que la ruta sea correcta
import { PlayerService } from '../../../services/player.service'; // Para cargar el jugador por ID si fuera necesario

@Component({
  selector: 'app-player-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule, // Asegúrate de importar MatSelectModule
  ],
  templateUrl: './player-form-modal.component.html',
  styleUrls: ['./player-form-modal.component.scss'],
})
export class PlayerFormModalComponent implements OnInit {
  player: any = {
    id: null,
    name: '',
    position: '',
    team_id: null,
    birth_date: null,
  }; // Objeto para el jugador
  allTeams: any[] = []; // Lista de todos los equipos para el selector
  isEditMode: boolean = false;
  modalTitle: string = 'Crear Nuevo Jugador';
  modalErrorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<PlayerFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Recibe { player?: any, teams: any[] }
    private teamService: TeamService // Inyecta TeamService para cargar equipos
  ) {
    // Si se pasa un objeto 'player' (modo edición)
    if (data && data.player) {
      this.player = { ...data.player };
      this.isEditMode = true;
      this.modalTitle = 'Editar Jugador';
      // Formatear la fecha de nacimiento para input type="date"
      if (this.player.birth_date) {
        this.player.birth_date = new Date(this.player.birth_date)
          .toISOString()
          .split('T')[0];
      }
    }
    // Asegurarse de recibir la lista de equipos
    if (data && data.teams) {
      this.allTeams = data.teams;
    }
  }

  ngOnInit(): void {
    // Si la lista de equipos no se pasa por 'data', cárgala aquí
    if (this.allTeams.length === 0) {
      this.teamService.getTeams().subscribe(
        (teams) => (this.allTeams = teams),
        (error) =>
          console.error(
            'Error al cargar equipos para el modal de jugador:',
            error
          )
      );
    }
  }

  onSubmit(): void {
    this.modalErrorMessage = ''; // Limpiar errores anteriores
    if (!this.player.name || !this.player.position || !this.player.team_id) {
      this.modalErrorMessage = 'Nombre, posición y equipo son obligatorios.';
      return;
    }
    // Convertir la fecha a formato ISO string si es necesario para el backend
    if (this.player.birth_date) {
      this.player.birth_date = new Date(this.player.birth_date)
        .toISOString()
        .slice(0, 10);
    }

    this.dialogRef.close(this.player);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
