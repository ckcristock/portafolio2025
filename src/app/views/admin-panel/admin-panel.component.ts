// src/app/admin-panel/admin-panel.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { FileUploadService } from '../../services/file-upload.service';
import { TeamService } from '../../services/team.service';
import { TeamFormModalComponent } from '../../shared/modals/team-form-modal/team-form-modal.component';
import { TableComponent } from '../../components/table/table.component'; // Import app-table

// Interfaz para la definición de columnas de la tabla (actualizada para 'actions')
interface TableColumn {
  key: string;
  header: string;
  type?: 'text' | 'number' | 'date' | 'link' | 'actions'; // Add 'actions' type
  linkRoute?: string;
  // Define actions properties if type is 'actions'
  actions?: { icon: string; tooltip: string; color?: string; event: string }[];
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule, // Para inyectar HttpClient
    FormsModule, // Para el manejo de formularios
    MatDialogModule, // Para usar MatDialog
    TableComponent, // Para usar el componente de tabla
  ],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'], // O .scss si usas Sass
})
export class AdminPanelComponent implements OnInit {
  // Propiedades para la subida de equipos
  selectedTeamsFile: File | null = null;
  teamsUploadMessage: string = '';
  teamsUploadError: boolean = false;

  // Propiedades para la subida de jugadores
  selectedPlayersFile: File | null = null;
  playersUploadMessage: string = '';
  playersUploadError: boolean = false;

  // --- PROPIEDADES PARA GESTIÓN DE EQUIPOS (CRUD) ---
  teamsData: any[] = []; // Array que contendrá los datos de los equipos para la tabla
  teamColumns: TableColumn[] = [
    // Definición de las columnas para la tabla de gestión de equipos
    { key: 'id', header: 'ID', type: 'number' },
    { key: 'name', header: 'Nombre', type: 'text' },
    { key: 'city', header: 'Ciudad', type: 'text' },
    // Columna para acciones: define los botones que se renderizarán en 'app-table'
    {
      key: 'actions',
      header: 'Acciones',
      type: 'actions',
      actions: [
        {
          icon: 'fas fa-edit',
          tooltip: 'Editar Equipo',
          color: 'primary',
          event: 'edit',
        },
        {
          icon: 'fas fa-trash',
          tooltip: 'Eliminar Equipo',
          color: 'warn',
          event: 'delete',
        },
      ],
    },
  ];
  // --------------------------------------------------

  constructor(
    private http: HttpClient, // Lo mantenemos por si hay subidas de archivos directas
    private fileUploadService: FileUploadService, // Servicio para subir archivos
    private teamService: TeamService, // Servicio para CRUD de equipos
    private dialog: MatDialog // Servicio para abrir modales de Angular Material
  ) {}

  ngOnInit(): void {
    this.fetchTeams(); // Cargar la lista de equipos al inicializar el componente
  }

  // --- MÉTODOS PARA GESTIÓN DE EQUIPOS (CRUD) ---

  /**
   * Obtiene la lista de equipos desde el backend para la tabla de gestión.
   */
  fetchTeams(): void {
    this.teamService.getTeams().subscribe(
      (data) => {
        this.teamsData = data; // Asigna los equipos obtenidos a la propiedad 'teamsData'
      },
      (error) => {
        console.error(
          'Error al cargar equipos para el panel de administración:',
          error
        );
      }
    );
  }

  /**
   * Maneja las acciones de los botones dentro de la tabla de equipos.
   * Se activa por el Output `(actionClick)` del componente `app-table`.
   * @param event Objeto que contiene la acción ('edit' o 'delete') y el elemento (equipo) afectado.
   */
  onTeamTableAction(event: { action: string; element: any }): void {
    switch (event.action) {
      case 'edit':
        this.openTeamFormModal(event.element); // Abre modal en modo edición
        break;
      case 'delete':
        this.deleteTeam(event.element.id); // Llama al método de eliminación
        break;
      default:
        console.warn(
          'Acción desconocida en la tabla de equipos:',
          event.action
        );
    }
  }

  /**
   * Abre el modal para crear o editar un equipo.
   * @param team Objeto de equipo a editar (opcional). Si no se proporciona, es modo creación.
   */
  openTeamFormModal(team?: any): void {
    const dialogRef = this.dialog.open(TeamFormModalComponent, {
      width: '400px', // Ancho del modal de formulario
      data: { team: team }, // Pasa el objeto 'team' si estamos editando, de lo contrario es nulo
    });

    dialogRef.afterClosed().subscribe((result) => {
      // 'result' contendrá el objeto del equipo si el usuario hizo clic en 'Crear'/'Guardar Cambios'
      if (result) {
        if (result.id) {
          // Si el objeto tiene un ID, es una actualización (PUT)
          this.teamService.updateTeam(result.id, result).subscribe(
            (res) => {
              alert('Equipo actualizado correctamente.');
              this.fetchTeams(); // Recargar la lista de equipos después de la actualización
            },
            (err) => {
              console.error('Error al actualizar equipo:', err);
              alert(
                'Error al actualizar equipo: ' +
                  (err.error?.message || 'Desconocido')
              );
            }
          );
        } else {
          // Si el objeto NO tiene un ID, es una creación (POST)
          this.teamService.createTeam(result).subscribe(
            (res) => {
              alert('Equipo creado correctamente.');
              this.fetchTeams(); // Recargar la lista de equipos después de la creación
            },
            (err) => {
              console.error('Error al crear equipo:', err);
              alert(
                'Error al crear equipo: ' +
                  (err.error?.message || 'Desconocido')
              );
            }
          );
        }
      }
    });
  }

  /**
   * Elimina un equipo de la base de datos.
   * @param teamId El ID del equipo a eliminar.
   */
  deleteTeam(teamId: number): void {
    // Se podría integrar un ConfirmDialogComponent aquí para una mejor UX
    if (
      confirm(
        '¿Estás seguro de que quieres eliminar este equipo? Esta acción es irreversible.'
      )
    ) {
      this.teamService.deleteTeam(teamId).subscribe(
        () => {
          alert('Equipo eliminado correctamente.');
          this.fetchTeams(); // Recargar la lista de equipos después de la eliminación
        },
        (error) => {
          console.error('Error al eliminar equipo:', error);
          alert(
            'Error al eliminar equipo: ' +
              (error.error?.message || 'Desconocido')
          );
        }
      );
    }
  }

  // --- MÉTODOS PARA SUBIDA DE ARCHIVOS (EXISTENTES) ---
  // Estos métodos se mantienen tal cual, ya que gestionan la subida masiva.

  onTeamsFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedTeamsFile = input.files[0];
      this.teamsUploadMessage = '';
      this.teamsUploadError = false;
    } else {
      this.selectedTeamsFile = null;
    }
  }

  uploadTeamsFile(): void {
    if (!this.selectedTeamsFile) {
      this.teamsUploadMessage = 'Por favor, selecciona un archivo primero.';
      this.teamsUploadError = true;
      return;
    }
    this.teamsUploadMessage = 'Subiendo equipos...';
    this.teamsUploadError = false;

    this.fileUploadService.uploadTeamsFile(this.selectedTeamsFile).subscribe(
      (response: any) => {
        this.teamsUploadMessage =
          response.message || 'Equipos subidos correctamente.';
        this.teamsUploadError = false;
        this.selectedTeamsFile = null;
        this.fetchTeams(); // Recargar la tabla de equipos después de la subida masiva
      },
      (error) => {
        console.error('Error al subir equipos:', error);
        this.teamsUploadMessage =
          error.error.error || 'Error desconocido al subir equipos.';
        this.teamsUploadError = true;
      }
    );
  }

  onPlayersFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedPlayersFile = input.files[0];
      this.playersUploadMessage = '';
      this.playersUploadError = false;
    } else {
      this.selectedPlayersFile = null;
    }
  }

  uploadPlayersFile(): void {
    if (!this.selectedPlayersFile) {
      this.playersUploadMessage = 'Por favor, selecciona un archivo primero.';
      this.playersUploadError = true;
      return;
    }
    this.playersUploadMessage = 'Subiendo jugadores...';
    this.playersUploadError = false;

    this.fileUploadService
      .uploadPlayersFile(this.selectedPlayersFile)
      .subscribe(
        (response: any) => {
          this.playersUploadMessage =
            response.message || 'Jugadores subidos correctamente.';
          this.playersUploadError = false;
          this.selectedPlayersFile = null;
          // Si tienes una tabla de jugadores aquí, la recargarías: this.fetchPlayers(); (futuro CRUD de Jugadores)
        },
        (error) => {
          console.error('Error al subir jugadores:', error);
          this.playersUploadMessage =
            error.error.error || 'Error desconocido al subir jugadores.';
          this.playersUploadError = true;
        }
      );
  }
}
