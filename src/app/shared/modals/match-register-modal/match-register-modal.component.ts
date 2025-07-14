// src/app/shared/modals/match-register-modal/match-register-modal.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importaciones de Angular Material para el diálogo
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-match-register-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDividerModule,
  ],
  templateUrl: './match-register-modal.component.html',
  styleUrls: ['./match-register-modal.component.scss'],
})
export class MatchRegisterModalComponent implements OnInit {
  matchData: any = {
    home_team_id: null,
    away_team_id: null,
    home_team_score: 0,
    away_team_score: 0,
    location: '',
    match_date: this.getCurrentDateTimeLocal(),
    status: 'finished',
  };

  allTeams: any[] = [];
  homePlayers: any[] = [];
  awayPlayers: any[] = [];

  playerStats: {
    [playerId: number]: { goals: number; played_full_match: boolean };
  } = {};

  // Propiedades para mostrar mensajes de error específicos en el modal
  modalErrorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<MatchRegisterModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.teams) {
      this.allTeams = data.teams;
    }
  }

  ngOnInit(): void {}

  getCurrentDateTimeLocal(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }

  onTeamSelectionChange(): void {
    // Restablece los mensajes de error
    this.modalErrorMessage = '';

    // Limpia los jugadores y estadísticas anteriores
    this.homePlayers = [];
    this.awayPlayers = [];
    this.playerStats = {}; // Restablece las estadísticas de jugadores al cambiar equipos

    // Carga los jugadores para el equipo local
    if (this.matchData.home_team_id) {
      const homeTeam = this.allTeams.find(
        (t) => t.id === this.matchData.home_team_id
      );
      if (homeTeam && homeTeam.players) {
        this.homePlayers = homeTeam.players;
        this.initializePlayerStats(this.homePlayers);
      }
    }

    // Carga los jugadores para el equipo visitante
    if (this.matchData.away_team_id) {
      const awayTeam = this.allTeams.find(
        (t) => t.id === this.matchData.away_team_id
      );
      if (awayTeam && awayTeam.players) {
        this.awayPlayers = awayTeam.players;
        this.initializePlayerStats(this.awayPlayers);
      }
    }
  }

  initializePlayerStats(players: any[]): void {
    players.forEach((player) => {
      if (!this.playerStats[player.id]) {
        this.playerStats[player.id] = { goals: 0, played_full_match: false };
      }
    });
  }

  /**
   * Valida que la suma de goles individuales coincida con el marcador del equipo.
   * @returns true si la validación es exitosa, false si hay inconsistencia.
   */
  validateGoalsConsistency(): boolean {
    let homeGoalsSum = 0;
    this.homePlayers.forEach((player) => {
      homeGoalsSum += this.playerStats[player.id]?.goals || 0;
    });

    let awayGoalsSum = 0;
    this.awayPlayers.forEach((player) => {
      awayGoalsSum += this.playerStats[player.id]?.goals || 0;
    });

    if (homeGoalsSum !== this.matchData.home_team_score) {
      this.modalErrorMessage = `La suma de goles del Equipo Local (${homeGoalsSum}) no coincide con el marcador (${this.matchData.home_team_score}).`;
      return false;
    }

    if (awayGoalsSum !== this.matchData.away_team_score) {
      this.modalErrorMessage = `La suma de goles del Equipo Visitante (${awayGoalsSum}) no coincide con el marcador (${this.matchData.away_team_score}).`;
      return false;
    }

    return true;
  }

  /**
   * Se llama al enviar el formulario del partido.
   * Cierra el modal y pasa los datos completos del partido y las estadísticas de jugadores.
   */
  onSubmit(): void {
    // Validaciones básicas del formulario
    this.modalErrorMessage = ''; // Limpia cualquier mensaje de error anterior
    if (this.matchData.home_team_id === this.matchData.away_team_id) {
      this.modalErrorMessage =
        'El equipo local y el visitante no pueden ser el mismo.';
      return;
    }
    if (
      !this.matchData.home_team_id ||
      !this.matchData.away_team_id ||
      !this.matchData.location ||
      !this.matchData.match_date
    ) {
      this.modalErrorMessage =
        'Por favor, completa todos los campos del partido.';
      return;
    }

    // ¡NUEVA VALIDACIÓN!
    if (!this.validateGoalsConsistency()) {
      return; // Detiene el envío si la validación de goles falla
    }

    // Preparar los datos de los jugadores a enviar
    const playersToSubmit: {
      player_id: number;
      goals: number;
      played_full_match: boolean;
    }[] = [];
    // Recopila jugadores de ambos equipos
    const allParticipatingPlayers = [...this.homePlayers, ...this.awayPlayers];

    // Solo incluye jugadores con al menos 1 gol o que jugaron el partido completo
    allParticipatingPlayers.forEach((player) => {
      const stats = this.playerStats[player.id];
      if (stats && (stats.goals > 0 || stats.played_full_match)) {
        playersToSubmit.push({
          player_id: player.id,
          goals: stats.goals || 0, // Asegura que sea 0 si es null/undefined
          played_full_match: stats.played_full_match || false,
        });
      }
    });

    // Envía los datos del partido y las estadísticas de los jugadores
    const result = {
      ...this.matchData,
      players_stats: playersToSubmit, // Añade este array al objeto resultado
    };

    this.dialogRef.close(result);
  }

  /**
   * Cierra el modal sin guardar ningún dato.
   */
  onCancel(): void {
    this.dialogRef.close();
  }
}
