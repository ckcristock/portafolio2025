// src/app/main-board/main-board.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TableComponent } from '../../components/table/table.component'; // Asegura la ruta correcta
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Importación de servicios
import { TeamService } from '../../services/team.service';
import { PlayerService } from '../../services/player.service'; // Necesitamos PlayerService aquí
import { PartidoService } from '../../services/partido.service';
import { CleanSheetService } from '../../services/clean-sheet.service';

// Importa el componente del modal
import { MatchRegisterModalComponent } from '../../shared/modals/match-register-modal/match-register-modal.component';

// Definición de la interfaz para el tipo de columna
interface TableColumn {
  key: string;
  header: string;
  type?: 'text' | 'number' | 'date' | 'link';
  linkRoute?: string;
}

@Component({
  selector: 'app-main-board',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    TableComponent,
    FormsModule,
    MatDialogModule,
  ],
  templateUrl: './main-board.component.html',
  styleUrls: ['./main-board.component.scss'],
})
export class MainBoardComponent implements OnInit, OnDestroy {
  // ... (Propiedades de tablas y filtros - sin cambios aquí) ...
  originalTeamsStandingsData: any[] = [];
  teamsStandingsData: any[] = [];
  teamsStandingsColumns: TableColumn[] = [
    { key: 'position', header: 'Posición', type: 'number' },
    { key: 'name', header: 'Equipo', type: 'text' },
    { key: 'PJ', header: 'PJ', type: 'number' },
    { key: 'PG', header: 'PG', type: 'number' },
    { key: 'PE', header: 'PE', type: 'number' },
    { key: 'PP', header: 'PP', type: 'number' },
    { key: 'GF', header: 'GF', type: 'number' },
    { key: 'GC', header: 'GC', type: 'number' },
    { key: 'GD', header: 'GD', type: 'number' },
    { key: 'PUNTOS', header: 'PUNTOS', type: 'number' },
  ];
  teamNameFilter: string = '';

  originalTopScorersData: any[] = [];
  topScorersData: any[] = [];
  topScorersColumns: TableColumn[] = [
    { key: 'name', header: 'Jugador', type: 'text' },
    { key: 'team_name', header: 'Equipo', type: 'text' },
    { key: 'total_goals', header: 'Goles', type: 'number' },
    { key: 'age', header: 'Edad', type: 'number' },
  ];
  minGoalsFilter: number | null = null;
  playerTeamFilter: string = '';
  minAgeFilter: number | null = null;
  maxAgeFilter: number | null = null;

  originalCleanSheetsData: any[] = [];
  cleanSheetsData: any[] = [];
  cleanSheetsColumns: TableColumn[] = [
    { key: 'name', header: 'Portero', type: 'text' },
    { key: 'team_name', header: 'Equipo', type: 'text' },
    { key: 'clean_sheets_count', header: 'Vallas Inv.', type: 'number' },
  ];
  minCleanSheetsFilter: number | null = null;
  goalkeeperTeamFilter: string = '';

  allTeams: any[] = []; // Esta lista contendrá los equipos CON sus jugadores

  constructor(
    private http: HttpClient, // Lo mantenemos por si hay subidas de archivos directas (Admin Panel)
    private teamService: TeamService,
    private playerService: PlayerService, // Inyecta PlayerService
    private partidoService: PartidoService,
    private cleanSheetService: CleanSheetService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchTeamsStandings();
    this.fetchTopScorers();
    this.fetchCleanSheets();
    this.fetchAllTeamsWithPlayers(); // Llama a este método para cargar equipos con jugadores
  }

  ngOnDestroy(): void {}

  /**
   * Obtiene todos los equipos con sus jugadores para llenar los selectores del formulario de partido.
   * Usará el endpoint /api/teams?withPlayers=true
   */
  fetchAllTeamsWithPlayers(): void {
    this.http
      .get<any[]>('http://localhost:8000/api/teams?withPlayers=true')
      .subscribe(
        // Añade ?withPlayers=true
        (data) => {
          this.allTeams = data; // allTeams ahora tendrá los equipos con su array 'players'
          console.log('Equipos cargados con jugadores:', this.allTeams);
        },
        (error) => {
          console.error('Error al cargar equipos con jugadores:', error);
          // Fallback: Si el backend no soporta ?withPlayers=true o da error,
          // simplemente carga los equipos sin jugadores. El modal mostrará "No hay jugadores disponibles".
          this.teamService.getTeams().subscribe((data) => {
            this.allTeams = data;
            console.warn(
              'Equipos cargados sin jugadores. El modal no mostrará la lista de jugadores por equipo.'
            );
          });
        }
      );
  }

  // ... (resto de los métodos, incluyendo openMatchRegisterModal que usa this.allTeams) ...

  openMatchRegisterModal(): void {
    const dialogRef = this.dialog.open(MatchRegisterModalComponent, {
      width: '750px', // Ancho del modal, ajusta según necesidad
      data: { teams: this.allTeams }, // ¡Pasamos la lista de equipos CON jugadores!
    });

    dialogRef.afterClosed().subscribe((result) => {
      // 'result' contendrá los datos del partido Y las estadísticas de los jugadores
      if (result) {
        console.log('Datos de partido y jugadores para registrar:', result);
        this.partidoService.createPartido(result).subscribe(
          // Envía el partido y los players_stats
          (res) => {
            alert('Partido registrado exitosamente!');
            // Recargar todas las tablas para que reflejen los nuevos resultados
            this.fetchTeamsStandings();
            this.fetchTopScorers();
            this.fetchCleanSheets();
          },
          (error) => {
            console.error('Error al registrar el partido desde modal:', error);
            alert(
              'Error al registrar partido: ' +
                (error.error?.message || 'Desconocido')
            );
          }
        );
      } else {
        console.log('Modal de registro de partido cerrado sin guardar.');
      }
    });
  }

  // ... (resto de los métodos fetch, onTeamFileUpload, applyFilter, calculateStats - sin cambios) ...

  fetchTeamsStandings(): void {
    this.teamService.getStandings().subscribe(
      (data) => {
        this.originalTeamsStandingsData = data.map((team, index) => ({
          ...team,
          position: index + 1,
        }));
        this.applyTeamFilter();
      },
      (error) => {
        console.error('Error al cargar la tabla de posiciones:', error);
      }
    );
  }

  fetchTopScorers(): void {
    this.playerService.getTopScorers().subscribe(
      (data) => {
        this.originalTopScorersData = data;
        this.applyTopScorersFilter();
      },
      (error) => {
        console.error('Error al cargar goleadores:', error);
      }
    );
  }

  fetchCleanSheets(): void {
    this.cleanSheetService.getCleanSheets().subscribe(
      (data) => {
        this.originalCleanSheetsData = data;
        this.applyCleanSheetsFilter();
      },
      (error) => {
        console.error('Error al cargar valla menos vencida:', error);
      }
    );
  }

  onTeamFileUpload(file: File): void {
    console.log('Archivo de equipos seleccionado para subir:', file.name);
    const formData = new FormData();
    formData.append('file', file);

    this.http
      .post('http://localhost:8000/api/teams/upload', formData)
      .subscribe(
        (response) => {
          console.log('Subida de equipos exitosa:', response);
          alert('Equipos importados correctamente!');
          this.fetchTeamsStandings();
        },
        (error) => {
          console.error('Error al subir equipos:', error);
          alert(
            'Error al importar equipos: ' + (error.error.error || 'Desconocido')
          );
        }
      );
  }

  applyTeamFilter(): void {
    let filteredData = [...this.originalTeamsStandingsData];
    if (this.teamNameFilter) {
      filteredData = filteredData.filter((team) =>
        team.name.toLowerCase().includes(this.teamNameFilter.toLowerCase())
      );
    }
    this.teamsStandingsData = filteredData;
  }

  applyTopScorersFilter(): void {
    let filteredData = [...this.originalTopScorersData];
    if (this.minGoalsFilter !== null) {
      filteredData = filteredData.filter(
        (player) => player.total_goals >= this.minGoalsFilter!
      );
    }
    if (this.playerTeamFilter) {
      filteredData = filteredData.filter((player) =>
        player.team_name
          .toLowerCase()
          .includes(this.playerTeamFilter.toLowerCase())
      );
    }
    if (this.minAgeFilter !== null) {
      filteredData = filteredData.filter(
        (player) => player.age && player.age >= this.minAgeFilter!
      );
    }
    if (this.maxAgeFilter !== null) {
      filteredData = filteredData.filter(
        (player) => player.age && player.age <= this.maxAgeFilter!
      );
    }
    this.topScorersData = filteredData;
  }

  applyCleanSheetsFilter(): void {
    let filteredData = [...this.originalCleanSheetsData];
    if (this.minCleanSheetsFilter !== null) {
      filteredData = filteredData.filter(
        (goalkeeper) =>
          goalkeeper.clean_sheets_count >= this.minCleanSheetsFilter!
      );
    }
    if (this.goalkeeperTeamFilter) {
      filteredData = filteredData.filter((goalkeeper) =>
        goalkeeper.team_name
          .toLowerCase()
          .includes(this.goalkeeperTeamFilter.toLowerCase())
      );
    }
    this.cleanSheetsData = filteredData;
  }

  calculateAveragePoints(): number {
    if (this.teamsStandingsData.length === 0) {
      return 0;
    }
    const totalPoints = this.teamsStandingsData.reduce(
      (sum, team) => sum + team.PUNTOS,
      0
    );
    return totalPoints / this.teamsStandingsData.length;
  }

  getBestGD(): number {
    if (this.teamsStandingsData.length === 0) {
      return 0;
    }
    return Math.max(...this.teamsStandingsData.map((team) => team.GD));
  }
}
