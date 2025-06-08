import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private isDark = new BehaviorSubject<boolean>(true); // Inicia en true (dark)
  isDark$ = this.isDark.asObservable();

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * Carga el tema desde localStorage o la preferencia del sistema.
   */
  loadTheme() {
    const savedTheme = localStorage.getItem('isDarkMode');
    if (savedTheme !== null) {
      this.setTheme(JSON.parse(savedTheme));
    } else {
      // Si no hay nada guardado, por defecto usamos el tema oscuro como base.
      this.setTheme(true);
    }
  }

  /**
   * Aplica el tema (añadiendo/quitando la clase 'dark-mode' del body) y lo guarda.
   */
  private setTheme(isDark: boolean) {
    this.isDark.next(isDark);
    localStorage.setItem('isDarkMode', JSON.stringify(isDark));

    if (isDark) {
      this.renderer.addClass(document.body, 'dark-mode');
      this.renderer.removeClass(document.body, 'light-mode');
    } else {
      this.renderer.addClass(document.body, 'light-mode');
      this.renderer.removeClass(document.body, 'dark-mode');
    }
  }

  /**
   * Alterna entre modo oscuro y claro.
   */
  toggleTheme() {
    this.setTheme(!this.isDark.value);
  }
}
