import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../services/theme.service'; // IMPORTANTE

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule], // Necesario para *ngIf
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit, OnDestroy {
  isDarkMode: boolean = true;
  private themeSubscription!: Subscription;

  @Output() toggleSidebarEvent = new EventEmitter<void>();

  // Inyectamos el servicio
  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Nos suscribimos para saber el estado actual del tema
    this.themeSubscription = this.themeService.isDark$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
  }

  ngOnDestroy(): void {
    // Buena práctica para evitar fugas de memoria
    this.themeSubscription.unsubscribe();
  }

  /**
   * Llama al servicio para cambiar el tema
   */
  toggleTheme() {
    this.themeService.toggleTheme();
  }

  /**
   * Emite el evento para mostrar/ocultar el sidebar en móviles
   */
  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }
}
