// src/app/shared/modals/match-register-modal/match-register-modal.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para directivas como *ngFor
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)]

// Importaciones de Angular Material para el diálogo y otros componentes usados en el modal
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog'; // ¡Añade MatDialogModule aquí!
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-match-register-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule, // ¡Añade este módulo! Provee mat-dialog-title, mat-dialog-content, mat-dialog-actions
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
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

  onSubmit(): void {
    if (this.matchData.home_team_id === this.matchData.away_team_id) {
      alert('El equipo local y el visitante no pueden ser el mismo.');
      return;
    }
    if (
      !this.matchData.home_team_id ||
      !this.matchData.away_team_id ||
      !this.matchData.location ||
      !this.matchData.match_date
    ) {
      alert('Por favor, completa todos los campos del partido.');
      return;
    }
    this.dialogRef.close(this.matchData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
