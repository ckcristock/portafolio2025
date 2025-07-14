// src/app/admin-panel/partido-form-modal/partido-form-modal.component.ts
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
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';

import { TeamService } from '../../../services/team.service';
import { PlayerService } from '../../../services/player.service';
import { PartidoService } from '../../../services/partido.service';

@Component({
  selector: 'app-partido-form-modal',
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
  templateUrl: './partido-form-modal.component.html',
  styleUrls: ['./partido-form-modal.component.scss'],
})
export class PartidoFormModalComponent implements OnInit {
  partido: any = {
    id: null,
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
    [playerId: number]: {
      goals: number;
      played_full_match: boolean;
      assists?: number;
    };
  } = {};

  isEditMode: boolean = false;
  modalTitle: string = 'Registrar Nuevo Partido';
  modalErrorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<PartidoFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private teamService: TeamService,
    private playerService: PlayerService,
    private partidoService: PartidoService
  ) {
    if (data && data.teams) {
      this.allTeams = data.teams;
    }

    if (data && data.partido) {
      this.partido = { ...data.partido };
      this.isEditMode = true;
      this.modalTitle = 'Editar Partido';

      if (this.partido.match_date) {
        this.partido.match_date = new Date(this.partido.match_date)
          .toISOString()
          .slice(0, 16);
      }

      if (this.partido.players && this.partido.players.length > 0) {
        this.partido.players.forEach((p: any) => {
          this.playerStats[p.id] = {
            goals: p.pivot.goals,
            played_full_match: p.pivot.played_full_match,
            assists: p.pivot.assists || 0,
          };
        });
      }
    }
  }

  ngOnInit(): void {
    if (this.allTeams.length === 0 || !this.allTeams[0].players) {
      this.fetchAllTeamsWithPlayers();
    } else {
      this.onTeamSelectionChange();
    }
  }

  getCurrentDateTimeLocal(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }

  fetchAllTeamsWithPlayers(): void {
    this.teamService.getTeams().subscribe(
      (data) => {
        this.allTeams = data;
        this.onTeamSelectionChange();
      },
      (error) => {
        console.error(
          'Error al cargar equipos con jugadores para el modal de partido:',
          error
        );
        this.teamService.getTeams().subscribe((teams) => {
          this.allTeams = teams;
          this.onTeamSelectionChange();
        });
      }
    );
  }

  onTeamSelectionChange(): void {
    this.modalErrorMessage = '';

    if (
      this.partido.home_team_id === this.partido.away_team_id &&
      this.partido.home_team_id !== null
    ) {
      this.modalErrorMessage =
        'El equipo local y el visitante no pueden ser el mismo.';
    }

    const homeTeam = this.allTeams.find(
      (t) => t.id === this.partido.home_team_id
    );
    this.homePlayers = homeTeam ? homeTeam.players : [];
    this.initializePlayerStats(this.homePlayers);

    const awayTeam = this.allTeams.find(
      (t) => t.id === this.partido.away_team_id
    );
    this.awayPlayers = awayTeam ? awayTeam.players : [];
    this.initializePlayerStats(this.awayPlayers);
  }

  initializePlayerStats(players: any[]): void {
    players.forEach((player) => {
      if (!this.playerStats[player.id]) {
        this.playerStats[player.id] = {
          goals: 0,
          played_full_match: false,
          assists: 0,
        };
      }
    });
  }

  validateGoalsConsistency(): boolean {
    let homeGoalsSum = 0;
    this.homePlayers.forEach((player) => {
      homeGoalsSum += this.playerStats[player.id]?.goals || 0;
    });

    let awayGoalsSum = 0;
    this.awayPlayers.forEach((player) => {
      awayGoalsSum += this.playerStats[player.id]?.goals || 0;
    });

    if (homeGoalsSum !== this.partido.home_team_score) {
      this.modalErrorMessage = `La suma de goles del Equipo Local (${homeGoalsSum}) no coincide con el marcador (${this.partido.home_team_score}).`;
      return false;
    }

    if (awayGoalsSum !== this.partido.away_team_score) {
      this.modalErrorMessage = `La suma de goles del Equipo Visitante (${awayGoalsSum}) no coincide con el marcador (${this.partido.away_team_score}).`;
      return false;
    }

    return true;
  }

  onSubmit(): void {
    this.modalErrorMessage = '';

    if (
      !this.partido.home_team_id ||
      !this.partido.away_team_id ||
      !this.partido.location ||
      !this.partido.match_date
    ) {
      this.modalErrorMessage =
        'Por favor, completa todos los campos del partido.';
      return;
    }
    if (this.partido.home_team_id === this.partido.away_team_id) {
      this.modalErrorMessage =
        'El equipo local y el visitante no pueden ser el mismo.';
      return;
    }

    if (!this.validateGoalsConsistency()) {
      return;
    }

    const playersToSubmit: {
      player_id: number;
      goals: number;
      played_full_match: boolean;
      assists?: number;
    }[] = [];
    const allParticipatingPlayers = [...this.homePlayers, ...this.awayPlayers];

    allParticipatingPlayers.forEach((player) => {
      const stats = this.playerStats[player.id];
      if (
        stats &&
        (stats.goals > 0 ||
          stats.played_full_match ||
          (stats.assists && stats.assists > 0))
      ) {
        playersToSubmit.push({
          player_id: player.id,
          goals: stats.goals || 0,
          played_full_match: stats.played_full_match || false,
          assists: stats.assists || 0,
        });
      }
    });

    const result = {
      ...this.partido,
      players_stats: playersToSubmit,
    };

    this.dialogRef.close(result);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // --- NUEVOS GETTERS PARA NOMBRES DE EQUIPOS ---
  get homeTeamName(): string {
    const team = this.allTeams.find((t) => t.id === this.partido.home_team_id);
    return team ? team.name : 'Selecciona un equipo';
  }

  get awayTeamName(): string {
    const team = this.allTeams.find((t) => t.id === this.partido.away_team_id);
    return team ? team.name : 'Selecciona un equipo';
  }
  // ---------------------------------------------
}
