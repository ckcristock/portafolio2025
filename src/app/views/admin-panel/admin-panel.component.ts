import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { FileUploadService } from '../../services/file-upload.service';
import { TeamService } from '../../services/team.service'; // Servicio para CRUD de equipos
import { PlayerService } from '../../services/player.service'; // ¡Importar PlayerService!

// Modales de formulario
import { TeamFormModalComponent } from '../../shared/modals/team-form-modal/team-form-modal.component';
import { PlayerFormModalComponent } from '../../shared/modals/player-form-modal/player-form-modal.component'; // ¡Importar PlayerFormModalComponent!

import { TableComponent } from '../../components/table/table.component'; // Importar app-table

// Interfaz para la definición de columnas de la tabla
interface TableColumn {
  key: string;
  header: string;
  type?: 'text' | 'number' | 'date' | 'link' | 'actions';
  linkRoute?: string;
  actions?: { icon: string; tooltip: string; color?: string; event: string }[];
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    TableComponent,
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
  teamsData: any[] = [];
  teamColumns: TableColumn[] = [
    { key: 'id', header: 'ID', type: 'number' },
    { key: 'name', header: 'Nombre', type: 'text' },
    { key: 'city', header: 'Ciudad', type: 'text' },
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

  // --- NUEVAS PROPIEDADES PARA GESTIÓN DE JUGADORES (CRUD) ---
  playersData: any[] = []; // Array que contendrá los datos de los jugadores para la tabla
  playerColumns: TableColumn[] = [
    // Definición de las columnas para la tabla de gestión de jugadores
    { key: 'id', header: 'ID', type: 'number' },
    { key: 'name', header: 'Nombre', type: 'text' },
    { key: 'position', header: 'Posición', type: 'text' },
    { key: 'team_name', header: 'Equipo', type: 'text' }, // Asumo que el backend enviará team_name
    { key: 'birth_date', header: 'Fecha Nac.', type: 'date' },
    // Columna para acciones:
    {
      key: 'actions',
      header: 'Acciones',
      type: 'actions',
      actions: [
        {
          icon: 'fas fa-edit',
          tooltip: 'Editar Jugador',
          color: 'primary',
          event: 'edit',
        },
        {
          icon: 'fas fa-trash',
          tooltip: 'Eliminar Jugador',
          color: 'warn',
          event: 'delete',
        },
      ],
    },
  ];
  allTeams: any[] = []; // Necesaria para el selector de equipo en el PlayerFormModal
  // --------------------------------------------------

  constructor(
    private http: HttpClient,
    private fileUploadService: FileUploadService,
    private teamService: TeamService,
    private playerService: PlayerService, // ¡Inyectar PlayerService!
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchTeams(); // Cargar la lista de equipos para el CRUD de Equipos
    this.fetchPlayers(); // ¡NUEVO! Cargar la lista de jugadores para el CRUD de Jugadores
    this.fetchAllTeamsForSelects(); // Cargar todos los equipos para los selects de modales
  }

  // --- MÉTODOS PARA GESTIÓN DE EQUIPOS (CRUD) ---

  fetchTeams(): void {
    this.teamService.getTeams().subscribe(
      (data) => {
        this.teamsData = data;
      },
      (error) => {
        console.error(
          'Error al cargar equipos para el panel de administración:',
          error
        );
      }
    );
  }

  onTeamTableAction(event: { action: string; element: any }): void {
    switch (event.action) {
      case 'edit':
        this.openTeamFormModal(event.element);
        break;
      case 'delete':
        this.deleteTeam(event.element.id);
        break;
      default:
        console.warn(
          'Acción desconocida en la tabla de equipos:',
          event.action
        );
    }
  }

  openTeamFormModal(team?: any): void {
    const dialogRef = this.dialog.open(TeamFormModalComponent, {
      width: '400px',
      data: { team: team },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.id) {
          this.teamService.updateTeam(result.id, result).subscribe(
            (res) => {
              alert('Equipo actualizado correctamente.');
              this.fetchTeams();
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
          this.teamService.createTeam(result).subscribe(
            (res) => {
              alert('Equipo creado correctamente.');
              this.fetchTeams();
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

  deleteTeam(teamId: number): void {
    if (
      confirm(
        '¿Estás seguro de que quieres eliminar este equipo? Esta acción es irreversible.'
      )
    ) {
      this.teamService.deleteTeam(teamId).subscribe(
        () => {
          alert('Equipo eliminado correctamente.');
          this.fetchTeams();
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

  // --- NUEVOS MÉTODOS PARA GESTIÓN DE JUGADORES (CRUD) ---

  /**
   * Obtiene la lista de jugadores desde el backend para la tabla de gestión.
   * Carga la relación 'team' para mostrar el nombre del equipo.
   */
  fetchPlayers(): void {
    this.playerService.getPlayers().subscribe(
      // Asumo que getPlayers ya trae la relación 'team'
      (data) => {
        // Mapear para añadir team_name directamente al jugador para la tabla
        this.playersData = data.map((player) => ({
          ...player,
          team_name: player.team ? player.team.name : 'N/A', // Añade el nombre del equipo
        }));
      },
      (error) => {
        console.error(
          'Error al cargar jugadores para el panel de administración:',
          error
        );
      }
    );
  }

  /**
   * Obtiene todos los equipos para usar en los selectores de los formularios de jugadores/partidos.
   */
  fetchAllTeamsForSelects(): void {
    this.teamService.getTeams().subscribe(
      (data) => {
        this.allTeams = data;
      },
      (error) => {
        console.error('Error al cargar equipos para selectores:', error);
      }
    );
  }

  /**
   * Maneja las acciones de los botones dentro de la tabla de jugadores.
   * Se activa por el Output `(actionClick)` del componente `app-table`.
   * @param event Objeto que contiene la acción ('edit' o 'delete') y el elemento (jugador) afectado.
   */
  onPlayerTableAction(event: { action: string; element: any }): void {
    switch (event.action) {
      case 'edit':
        this.openPlayerFormModal(event.element); // Abre modal en modo edición
        break;
      case 'delete':
        this.deletePlayer(event.element.id); // Llama al método de eliminación
        break;
      default:
        console.warn(
          'Acción desconocida en la tabla de jugadores:',
          event.action
        );
    }
  }

  /**
   * Abre el modal para crear o editar un jugador.
   * @param player Objeto de jugador a editar (opcional). Si no se proporciona, es modo creación.
   */
  openPlayerFormModal(player?: any): void {
    const dialogRef = this.dialog.open(PlayerFormModalComponent, {
      width: '450px', // Ancho del modal de formulario de jugador
      data: { player: player, teams: this.allTeams }, // Pasa el jugador y la lista de equipos
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.id) {
          // Si el resultado tiene un ID, es una actualización
          this.playerService.updatePlayer(result.id, result).subscribe(
            (res) => {
              alert('Jugador actualizado correctamente.');
              this.fetchPlayers();
            },
            (err) => {
              console.error('Error al actualizar jugador:', err);
              alert(
                'Error al actualizar jugador: ' +
                  (err.error?.message || 'Desconocido')
              );
            }
          );
        } else {
          // Si no tiene ID, es una creación
          this.playerService.createPlayer(result).subscribe(
            (res) => {
              alert('Jugador creado correctamente.');
              this.fetchPlayers();
            },
            (err) => {
              console.error('Error al crear jugador:', err);
              alert(
                'Error al crear jugador: ' +
                  (err.error?.message || 'Desconocido')
              );
            }
          );
        }
      }
    });
  }

  /**
   * Elimina un jugador de la base de datos.
   * @param playerId El ID del jugador a eliminar.
   */
  deletePlayer(playerId: number): void {
    if (
      confirm(
        '¿Estás seguro de que quieres eliminar este jugador? Esta acción es irreversible.'
      )
    ) {
      this.playerService.deletePlayer(playerId).subscribe(
        () => {
          alert('Jugador eliminado correctamente.');
          this.fetchPlayers();
        },
        (error) => {
          console.error('Error al eliminar jugador:', error);
          alert(
            'Error al eliminar jugador: ' +
              (error.error?.message || 'Desconocido')
          );
        }
      );
    }
  }

  // --- MÉTODOS PARA SUBIDA DE ARCHIVOS (EXISTENTES) ---
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
          this.fetchPlayers(); // ¡Recargar la tabla de jugadores después de la subida masiva!
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
