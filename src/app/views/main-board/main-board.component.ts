import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Proporciona directivas comunes como *ngIf, *ngFor
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Para hacer peticiones HTTP
import { TableComponent } from '../../components/table/table.component'; // Importa tu componente de tabla reutilizable
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)] para los filtros

// Importaciones de Angular Material para el diálogo
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Importa MatDialog y MatDialogModule

// Importación de servicios
import { TeamService } from '../../services/team.service'; // Asegúrate de que la ruta sea correcta
import { PlayerService } from '../../services/player.service'; // Asegúrate de que la ruta sea correcta
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
  standalone: true, // ¡Este componente es standalone!
  imports: [
    CommonModule,
    HttpClientModule,
    TableComponent,
    FormsModule,
    MatDialogModule, // ¡Añade MatDialogModule aquí para poder usar MatDialog!
  ],
  templateUrl: './main-board.component.html',
  styleUrls: ['./main-board.component.scss'],
})
export class MainBoardComponent implements OnInit {
  // --- Propiedades para la Tabla de Equipos (Posiciones) ---
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

  // --- Propiedades para la Tabla de Goleadores ---
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

  // --- Propiedades para la Tabla de Valla Menos Vencida ---
  originalCleanSheetsData: any[] = [];
  cleanSheetsData: any[] = [];
  cleanSheetsColumns: TableColumn[] = [
    { key: 'name', header: 'Portero', type: 'text' },
    { key: 'team_name', header: 'Equipo', type: 'text' },
    { key: 'clean_sheets_count', header: 'Vallas Inv.', type: 'number' },
  ];
  minCleanSheetsFilter: number | null = null;
  goalkeeperTeamFilter: string = '';

  // --- Propiedades para el Registro de Partido (solo 'allTeams' se mantiene aquí) ---
  allTeams: any[] = []; // Se usará para pasar al modal

  // newMatch, matchResultMessage, matchResultError se mueven al modal

  constructor(
    private http: HttpClient, // Lo dejamos por si lo necesitas para cosas específicas
    private teamService: TeamService,
    private playerService: PlayerService,
    private partidoService: PartidoService,
    private cleanSheetService: CleanSheetService,
    private dialog: MatDialog // ¡Inyecta MatDialog!
  ) {}

  ngOnInit(): void {
    this.fetchTeamsStandings();
    this.fetchTopScorers();
    this.fetchCleanSheets();
    this.fetchAllTeams(); // Carga la lista de equipos para el formulario de partidos
  }

  // Se mantiene para el formulario de registro de partido
  fetchAllTeams(): void {
    this.teamService.getTeams().subscribe(
      (data) => {
        this.allTeams = data;
      },
      (error) => {
        console.error('Error al cargar todos los equipos:', error);
      }
    );
  }

  /**
   * Abre el modal para registrar un nuevo partido.
   * Reemplaza el método registerMatchResult anterior.
   */
  openMatchRegisterModal(): void {
    const dialogRef = this.dialog.open(MatchRegisterModalComponent, {
      width: '700px', // Ancho del modal, ajusta según necesidad
      data: { teams: this.allTeams }, // Pasamos la lista de equipos al modal
    });

    dialogRef.afterClosed().subscribe((result) => {
      // 'result' contendrá los datos del partido si el usuario hizo clic en "Registrar"
      if (result) {
        console.log('Partido registrado desde modal:', result);
        this.partidoService.createPartido(result).subscribe(
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

  // --- Métodos de carga de datos para las tablas (existentes) ---

  /**
   * Obtiene los datos de la tabla de posiciones de equipos desde el backend.
   */
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

  /**
   * Obtiene los datos de los máximos goleadores desde el backend.
   */
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

  /**
   * Obtiene los datos de la valla menos vencida desde el backend.
   */
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

  /**
   * Maneja la subida de un archivo (XLS/CSV) para la tabla de Equipos.
   * @param file El archivo File seleccionado por el usuario.
   */
  onTeamFileUpload(file: File): void {
    console.log('Archivo de equipos seleccionado para subir:', file.name);
    const formData = new FormData();
    formData.append('file', file);

    this.http.post('/api/teams/upload', formData).subscribe(
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

  // --- Métodos de Filtrado para cada Tabla (existentes) ---

  /**
   * Aplica filtros a la tabla de posiciones de Equipos.
   */
  applyTeamFilter(): void {
    let filteredData = [...this.originalTeamsStandingsData];
    if (this.teamNameFilter) {
      filteredData = filteredData.filter((team) =>
        team.name.toLowerCase().includes(this.teamNameFilter.toLowerCase())
      );
    }
    this.teamsStandingsData = filteredData;
  }

  /**
   * Aplica filtros a la tabla de Goleadores (goles, equipo, edad).
   */
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

  /**
   * Aplica filtros a la tabla de Vallas Menos Vencidas (vallas invictas, equipo).
   */
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

  // --- Métodos para Estadísticas Generales de Equipos (existentes) ---

  /**
   * Calcula el promedio de puntos de los equipos.
   */
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

  /**
   * Obtiene la mejor diferencia de goles (GD) entre los equipos.
   */
  getBestGD(): number {
    if (this.teamsStandingsData.length === 0) {
      return 0;
    }
    return Math.max(...this.teamsStandingsData.map((team) => team.GD));
  }
}
