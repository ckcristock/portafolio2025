import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para directivas como *ngIf
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Para hacer peticiones HTTP
import { FormsModule } from '@angular/forms'; // Necesario para el binding de formularios
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Para usar MatDialog

import { FileUploadService } from '../../services/file-upload.service'; // Servicio para subida de archivos
import { TeamService } from '../../services/team.service'; // Servicio para CRUD de equipos
import { PlayerService } from '../../services/player.service'; // Servicio para CRUD de jugadores
import { PartidoService } from '../../services/partido.service'; // ¡NUEVO! Servicio para CRUD de partidos

// Modales de formulario
import { TeamFormModalComponent } from '../../shared/modals/team-form-modal/team-form-modal.component';
import { PlayerFormModalComponent } from '../../shared/modals/player-form-modal/player-form-modal.component';
import { PartidoFormModalComponent } from '../../shared/modals/partido-form-modal/partido-form-modal.component'; // ¡NUEVO! Importar PartidoFormModalComponent

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

  // --- PROPIEDADES PARA GESTIÓN DE JUGADORES (CRUD) ---
  playersData: any[] = [];
  playerColumns: TableColumn[] = [
    { key: 'id', header: 'ID', type: 'number' },
    { key: 'name', header: 'Nombre', type: 'text' },
    { key: 'position', header: 'Posición', type: 'text' },
    { key: 'team_name', header: 'Equipo', type: 'text' }, // Asumo que el backend enviará team_name
    { key: 'birth_date', header: 'Fecha Nac.', type: 'date' },
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
  allTeams: any[] = []; // Necesaria para el selector de equipo en el PlayerFormModal y PartidoFormModal
  // --------------------------------------------------

  // --- NUEVAS PROPIEDADES PARA GESTIÓN DE PARTIDOS (CRUD) ---
  partidosData: any[] = [];
  partidoColumns: TableColumn[] = [
    { key: 'id', header: 'ID', type: 'number' },
    { key: 'home_team_name', header: 'Local', type: 'text' }, // Asumo que el backend enviará home_team_name
    { key: 'away_team_name', header: 'Visitante', type: 'text' }, // Asumo que el backend enviará away_team_name
    { key: 'score', header: 'Resultado', type: 'text' }, // Combinación de scores (ej: 2-1)
    { key: 'match_date', header: 'Fecha', type: 'date' },
    { key: 'location', header: 'Ubicación', type: 'text' },
    { key: 'status', header: 'Estado', type: 'text' },
    {
      key: 'actions',
      header: 'Acciones',
      type: 'actions',
      actions: [
        {
          icon: 'fas fa-edit',
          tooltip: 'Editar Partido',
          color: 'primary',
          event: 'edit',
        },
        {
          icon: 'fas fa-trash',
          tooltip: 'Eliminar Partido',
          color: 'warn',
          event: 'delete',
        },
      ],
    },
  ];
  // --------------------------------------------------

  constructor(
    private http: HttpClient,
    private fileUploadService: FileUploadService,
    private teamService: TeamService,
    private playerService: PlayerService,
    private partidoService: PartidoService, // ¡Inyectar PartidoService!
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchTeams();
    this.fetchPlayers();
    this.fetchAllTeamsForSelects(); // Cargar todos los equipos para los selects de modales (jugadores y partidos)
    this.fetchPartidos(); // ¡NUEVO! Cargar la lista de partidos para el CRUD de Partidos
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

  // --- MÉTODOS PARA GESTIÓN DE JUGADORES (CRUD) ---

  fetchPlayers(): void {
    this.playerService.getPlayers().subscribe(
      // Asumo que getPlayers ya trae la relación 'team'
      (data) => {
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

  fetchAllTeamsForSelects(): void {
    // Carga todos los equipos CON jugadores para los selectores de los modales (jugadores y partidos)
    this.teamService.getTeams().subscribe(
      // Asumo que getTeams trae la relación 'players' con ?withPlayers=true
      (data) => {
        this.allTeams = data; // allTeams ahora tendrá los equipos con su array 'players'
      },
      (error) => {
        console.error('Error al cargar equipos para selectores:', error);
        // Fallback si la carga con jugadores falla, para al menos tener los equipos básicos
        this.teamService.getTeams().subscribe((teams) => {
          this.allTeams = teams;
          console.warn(
            'Equipos cargados para selectores sin jugadores. Esto afectará el modal de partidos.'
          );
        });
      }
    );
  }

  onPlayerTableAction(event: { action: string; element: any }): void {
    switch (event.action) {
      case 'edit':
        this.openPlayerFormModal(event.element);
        break;
      case 'delete':
        this.deletePlayer(event.element.id);
        break;
      default:
        console.warn(
          'Acción desconocida en la tabla de jugadores:',
          event.action
        );
    }
  }

  openPlayerFormModal(player?: any): void {
    const dialogRef = this.dialog.open(PlayerFormModalComponent, {
      width: '450px',
      data: { player: player, teams: this.allTeams }, // Pasa el jugador y la lista de equipos
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.id) {
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

  // --- NUEVOS MÉTODOS PARA GESTIÓN DE PARTIDOS (CRUD) ---

  fetchPartidos(): void {
    this.partidoService.getPartidos().subscribe(
      (data) => {
        // Mapear para añadir home_team_name, away_team_name y el score combinado
        this.partidosData = data.map((partido) => ({
          ...partido,
          home_team_name: partido.homeTeam ? partido.homeTeam.name : 'N/A',
          away_team_name: partido.awayTeam ? partido.awayTeam.name : 'N/A',
          score: `${partido.home_team_score} - ${partido.away_team_score}`,
        }));
      },
      (error) => {
        console.error(
          'Error al cargar partidos para el panel de administración:',
          error
        );
      }
    );
  }

  onPartidoTableAction(event: { action: string; element: any }): void {
    switch (event.action) {
      case 'edit':
        this.openPartidoFormModal(event.element);
        break;
      case 'delete':
        this.deletePartido(event.element.id);
        break;
      default:
        console.warn(
          'Acción desconocida en la tabla de partidos:',
          event.action
        );
    }
  }

  openPartidoFormModal(partido?: any): void {
    const dialogRef = this.dialog.open(PartidoFormModalComponent, {
      width: '750px', // Ancho ajustado para el formulario de partido
      data: { partido: partido, teams: this.allTeams }, // Pasa el partido y la lista de equipos con jugadores
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.id) {
          // Actualizar
          this.partidoService.updatePartido(result.id, result).subscribe(
            (res) => {
              alert('Partido actualizado correctamente.');
              this.fetchPartidos();
            },
            (err) => {
              console.error('Error al actualizar partido:', err);
              alert(
                'Error al actualizar partido: ' +
                  (err.error?.message || 'Desconocido')
              );
            }
          );
        } else {
          // Crear
          this.partidoService.createPartido(result).subscribe(
            (res) => {
              alert('Partido creado correctamente.');
              this.fetchPartidos();
            },
            (err) => {
              console.error('Error al crear partido:', err);
              alert(
                'Error al crear partido: ' +
                  (err.error?.message || 'Desconocido')
              );
            }
          );
        }
      }
    });
  }

  deletePartido(partidoId: number): void {
    if (
      confirm(
        '¿Estás seguro de que quieres eliminar este partido? Esta acción es irreversible.'
      )
    ) {
      this.partidoService.deletePartido(partidoId).subscribe(
        () => {
          alert('Partido eliminado correctamente.');
          this.fetchPartidos();
        },
        (error) => {
          console.error('Error al eliminar partido:', error);
          alert(
            'Error al eliminar partido: ' +
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
          this.fetchPlayers(); // Recargar la tabla de jugadores después de la subida masiva
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
