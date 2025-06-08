import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service'; // IMPORTANTE

@Component({
  selector: 'app-root',
  standalone: true, // Asumo que usas Standalone por los imports en el decorador
  imports: [CommonModule, RouterOutlet, TopBarComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  // Implementamos OnInit
  title = 'angular';
  sidebarActive = false;

  // Inyectamos el servicio
  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // Al iniciar la app, cargamos el tema
    this.themeService.loadTheme();
  }

  onToggleSidebar() {
    this.sidebarActive = !this.sidebarActive;
  }
}
