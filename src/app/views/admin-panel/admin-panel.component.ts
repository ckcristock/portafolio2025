import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para directivas como *ngIf
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Para hacer peticiones HTTP
import { FormsModule } from '@angular/forms'; // Necesario para el binding de formularios

@Component({
  selector: 'app-admin-panel',
  standalone: true, // ¡Este componente es standalone!
  imports: [
    CommonModule, // Para directivas comunes de Angular
    HttpClientModule, // Para poder usar HttpClient
    FormsModule, // Para el manejo de formularios y [(ngModel)]
  ],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'], // O .scss si usas Sass
})
export class AdminPanelComponent implements OnInit {
  // Propiedades para la subida de equipos
  selectedTeamsFile: File | null = null; // Almacena el archivo de equipos seleccionado
  teamsUploadMessage: string = ''; // Mensaje de estado para la subida de equipos
  teamsUploadError: boolean = false; // Indica si hubo un error en la subida de equipos

  // Propiedades para la subida de jugadores
  selectedPlayersFile: File | null = null; // Almacena el archivo de jugadores seleccionado
  playersUploadMessage: string = ''; // Mensaje de estado para la subida de jugadores
  playersUploadError: boolean = false; // Indica si hubo un error en la subida de jugadores

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Puedes añadir lógica de inicialización si es necesaria
  }

  /**
   * Maneja la selección de un archivo para subir equipos.
   * @param event El evento de cambio del input de archivo.
   */
  onTeamsFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedTeamsFile = input.files[0];
      this.teamsUploadMessage = ''; // Limpia mensajes anteriores al seleccionar un nuevo archivo
      this.teamsUploadError = false;
    } else {
      this.selectedTeamsFile = null;
    }
  }

  /**
   * Envía el archivo de equipos seleccionado al backend.
   */
  uploadTeamsFile(): void {
    if (!this.selectedTeamsFile) {
      this.teamsUploadMessage = 'Por favor, selecciona un archivo primero.';
      this.teamsUploadError = true;
      return;
    }

    this.teamsUploadMessage = 'Subiendo equipos...';
    this.teamsUploadError = false;

    const formData = new FormData();
    formData.append('file', this.selectedTeamsFile); // 'file' es el nombre que espera tu backend de Laravel

    this.http.post('/api/teams/upload', formData).subscribe(
      (response: any) => {
        this.teamsUploadMessage =
          response.message || 'Equipos subidos correctamente.';
        this.teamsUploadError = false;
        this.selectedTeamsFile = null; // Limpia el archivo después de una subida exitosa
      },
      (error) => {
        console.error('Error al subir equipos:', error);
        this.teamsUploadMessage =
          error.error.error || 'Error desconocido al subir equipos.';
        this.teamsUploadError = true;
      }
    );
  }

  /**
   * Maneja la selección de un archivo para subir jugadores.
   * @param event El evento de cambio del input de archivo.
   */
  onPlayersFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedPlayersFile = input.files[0];
      this.playersUploadMessage = ''; // Limpia mensajes anteriores
      this.playersUploadError = false;
    } else {
      this.selectedPlayersFile = null;
    }
  }

  /**
   * Envía el archivo de jugadores seleccionado al backend.
   */
  uploadPlayersFile(): void {
    if (!this.selectedPlayersFile) {
      this.playersUploadMessage = 'Por favor, selecciona un archivo primero.';
      this.playersUploadError = true;
      return;
    }

    this.playersUploadMessage = 'Subiendo jugadores...';
    this.playersUploadError = false;

    const formData = new FormData();
    formData.append('file', this.selectedPlayersFile); // 'file' es el nombre que espera tu backend

    this.http.post('/api/players/upload', formData).subscribe(
      (response: any) => {
        this.playersUploadMessage =
          response.message || 'Jugadores subidos correctamente.';
        this.playersUploadError = false;
        this.selectedPlayersFile = null; // Limpia el archivo
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
