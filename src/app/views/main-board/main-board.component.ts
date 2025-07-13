import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Proporciona directivas comunes como *ngIf, *ngFor
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Para hacer peticiones HTTP
import { TableComponent } from '../../components/table/table.component'; // Importa tu componente de tabla reutilizable
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)] para los filtros

// Importación de servicios
import { TeamService } from '../../services/team.service'; // Asegúrate de que la ruta sea correcta
import { PlayerService } from '../../services/player.service'; // ¡Importa PlayerService!
import { PartidoService } from '../../services/partido.service'; // Asegúrate de que la ruta sea correcta
import { CleanSheetService } from '../../services/clean-sheet.service'; // ¡Importa CleanSheetService!

// Definición de la interfaz para el tipo de columna, para asegurar el tipado correcto
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
    CommonModule, // Para directivas comunes de Angular
    HttpClientModule, // Para inyectar HttpClient en el constructor
    TableComponent, // Importa el componente de tabla para usarlo en la plantilla
    FormsModule, // Importa FormsModule para el binding de doble vía [(ngModel)] en los inputs de filtro
  ],
  templateUrl: './main-board.component.html',
  styleUrls: ['./main-board.component.scss'],
})
export class MainBoardComponent implements OnInit {
  // --- Propiedades para la Tabla de Equipos (Posiciones) ---
  originalTeamsStandingsData: any[] = []; // Almacena los datos originales sin filtrar
  teamsStandingsData: any[] = []; // Los datos que se mostrarán en la tabla (se filtran aquí)
  teamsStandingsColumns: TableColumn[] = [
    // Definición de las columnas para la tabla de equipos
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
  teamNameFilter: string = ''; // Variable para el filtro por nombre de equipo

  // --- Propiedades para la Tabla de Goleadores ---
  originalTopScorersData: any[] = []; // Almacena los datos originales de goleadores
  topScorersData: any[] = []; // Los datos de goleadores que se mostrarán
  topScorersColumns: TableColumn[] = [
    // Definición de las columnas para la tabla de goleadores
    { key: 'name', header: 'Jugador', type: 'text' },
    { key: 'team_name', header: 'Equipo', type: 'text' },
    { key: 'total_goals', header: 'Goles', type: 'number' },
    { key: 'age', header: 'Edad', type: 'number' }, // Columna para la edad (asumiendo que el backend la envía)
  ];
  minGoalsFilter: number | null = null; // Filtro por goles mínimos
  playerTeamFilter: string = ''; // Filtro por equipo del jugador
  minAgeFilter: number | null = null; // Filtro por edad mínima
  maxAgeFilter: number | null = null; // Filtro por edad máxima

  // --- Propiedades para la Tabla de Valla Menos Vencida ---
  originalCleanSheetsData: any[] = []; // Almacena los datos originales de vallas menos vencidas
  cleanSheetsData: any[] = []; // Los datos de vallas menos vencidas que se mostrarán
  cleanSheetsColumns: TableColumn[] = [
    // Definición de las columnas para la tabla de vallas
    { key: 'name', header: 'Portero', type: 'text' },
    { key: 'team_name', header: 'Equipo', type: 'text' },
    { key: 'clean_sheets_count', header: 'Vallas Inv.', type: 'number' },
  ];
  minCleanSheetsFilter: number | null = null; // Filtro por vallas invictas mínimas
  goalkeeperTeamFilter: string = ''; // Filtro por equipo del portero

  // --- Propiedades para el Registro de Partido ---
  allTeams: any[] = []; // Lista de todos los equipos para los selectores
  newMatch: any = {
    // Objeto para almacenar los datos del nuevo partido a registrar
    home_team_id: null,
    away_team_id: null,
    home_team_score: 0,
    away_team_score: 0,
    location: '',
    match_date: this.getCurrentDateTimeLocal(), // Inicializa con la fecha y hora actual
    status: 'finished', // Por defecto, se asume que el partido ya terminó al registrarlo
  };
  matchResultMessage: string = ''; // Mensaje de estado para el registro de partido
  matchResultError: boolean = false; // Indica si hubo un error en el registro

  constructor(
    private http: HttpClient,
    private teamService: TeamService,
    private playerService: PlayerService, // ¡Inyecta PlayerService!
    private partidoService: PartidoService,
    private cleanSheetService: CleanSheetService // ¡Inyecta CleanSheetService!
  ) {}

  ngOnInit(): void {
    // Al iniciar el componente, carga los datos para cada tabla
    this.fetchTeamsStandings();
    this.fetchTopScorers();
    this.fetchCleanSheets();
    this.fetchAllTeams(); // Carga la lista de equipos para el formulario de partidos
  }

  /**
   * Obtiene la fecha y hora actual en formato local para el input datetime-local.
   */
  getCurrentDateTimeLocal(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Ajusta a la zona horaria local
    return now.toISOString().slice(0, 16); // Formato YYYY-MM-DDTHH:MM
  }

  /**
   * Obtiene todos los equipos desde TeamService para llenar los selectores del formulario de partido.
   */
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
   * Registra un nuevo partido utilizando PartidoService.
   * Se llama al enviar el formulario del partido.
   */
  registerMatchResult(): void {
    // Validación básica del formulario en el frontend
    if (this.newMatch.home_team_id === this.newMatch.away_team_id) {
      this.matchResultMessage =
        'El equipo local y el visitante no pueden ser el mismo.';
      this.matchResultError = true;
      return;
    }
    if (
      !this.newMatch.home_team_id ||
      !this.newMatch.away_team_id ||
      !this.newMatch.location ||
      !this.newMatch.match_date
    ) {
      this.matchResultMessage =
        'Por favor, completa todos los campos del partido.';
      this.matchResultError = true;
      return;
    }

    this.matchResultMessage = 'Registrando partido...';
    this.matchResultError = false;

    this.partidoService.createPartido(this.newMatch).subscribe(
      (response) => {
        this.matchResultMessage = 'Partido registrado exitosamente.';
        this.matchResultError = false;
        // Reiniciar el formulario después del registro exitoso
        this.newMatch = {
          home_team_id: null,
          away_team_id: null,
          home_team_score: 0,
          away_team_score: 0,
          location: '',
          match_date: this.getCurrentDateTimeLocal(),
          status: 'finished',
        };
        // Recargar todas las tablas para que reflejen los nuevos resultados
        this.fetchTeamsStandings();
        this.fetchTopScorers();
        this.fetchCleanSheets();
      },
      (error) => {
        console.error('Error al registrar el partido:', error);
        this.matchResultMessage =
          error.error.message || 'Error desconocido al registrar el partido.';
        this.matchResultError = true;
      }
    );
  }

  // --- Métodos de carga de datos para las tablas (existentes, con correcciones) ---

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
        this.applyTeamFilter(); // Aplica cualquier filtro existente al cargar los datos
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
    // ¡CORREGIDO! Ahora llama a playerService.getTopScorers()
    this.playerService.getTopScorers().subscribe(
      (data) => {
        this.originalTopScorersData = data; // Almacena los datos originales
        this.applyTopScorersFilter(); // Aplica cualquier filtro existente
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
    // ¡CORREGIDO! Ahora llama a cleanSheetService.getCleanSheets()
    this.cleanSheetService.getCleanSheets().subscribe(
      (data) => {
        this.originalCleanSheetsData = data; // Almacena los datos originales
        this.applyCleanSheetsFilter(); // Aplica cualquier filtro existente
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
    const formData = new FormData(); // Crea un objeto FormData para enviar el archivo
    formData.append('file', file); // Añade el archivo al FormData con la clave 'file'

    this.http.post('/api/teams/upload', formData).subscribe(
      // Envía la petición POST al endpoint de carga
      (response) => {
        console.log('Subida de equipos exitosa:', response);
        alert('Equipos importados correctamente!');
        this.fetchTeamsStandings(); // Vuelve a cargar los equipos para actualizar la tabla
      },
      (error) => {
        console.error('Error al subir equipos:', error);
        // Muestra un mensaje de error más específico si el backend lo proporciona
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
    let filteredData = [...this.originalTeamsStandingsData]; // Empieza con una copia de los datos originales

    if (this.teamNameFilter) {
      // Filtra por nombre de equipo (case-insensitive)
      filteredData = filteredData.filter((team) =>
        team.name.toLowerCase().includes(this.teamNameFilter.toLowerCase())
      );
    }
    this.teamsStandingsData = filteredData; // Actualiza los datos visibles en la tabla
  }

  /**
   * Aplica filtros a la tabla de Goleadores (goles, equipo, edad).
   */
  applyTopScorersFilter(): void {
    let filteredData = [...this.originalTopScorersData]; // Empieza con una copia de los datos originales

    if (this.minGoalsFilter !== null) {
      // Filtra por goles mínimos
      filteredData = filteredData.filter(
        (player) => player.total_goals >= this.minGoalsFilter!
      );
    }
    if (this.playerTeamFilter) {
      // Filtra por nombre de equipo del jugador (case-insensitive)
      filteredData = filteredData.filter((player) =>
        player.team_name
          .toLowerCase()
          .includes(this.playerTeamFilter.toLowerCase())
      );
    }
    if (this.minAgeFilter !== null) {
      // Filtra por edad mínima, solo si 'age' existe
      filteredData = filteredData.filter(
        (player) => player.age && player.age >= this.minAgeFilter!
      );
    }
    if (this.maxAgeFilter !== null) {
      // Filtra por edad máxima, solo si 'age' existe
      filteredData = filteredData.filter(
        (player) => player.age && player.age <= this.maxAgeFilter!
      );
    }

    this.topScorersData = filteredData; // Actualiza los datos visibles en la tabla
  }

  /**
   * Aplica filtros a la tabla de Vallas Menos Vencidas (vallas invictas, equipo).
   */
  applyCleanSheetsFilter(): void {
    let filteredData = [...this.originalCleanSheetsData]; // Empieza con una copia de los datos originales

    if (this.minCleanSheetsFilter !== null) {
      // Filtra por vallas invictas mínimas
      filteredData = filteredData.filter(
        (goalkeeper) =>
          goalkeeper.clean_sheets_count >= this.minCleanSheetsFilter!
      );
    }
    if (this.goalkeeperTeamFilter) {
      // Filtra por nombre de equipo del portero (case-insensitive)
      filteredData = filteredData.filter((goalkeeper) =>
        goalkeeper.team_name
          .toLowerCase()
          .includes(this.goalkeeperTeamFilter.toLowerCase())
      );
    }
    this.cleanSheetsData = filteredData; // Actualiza los datos visibles en la tabla
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
