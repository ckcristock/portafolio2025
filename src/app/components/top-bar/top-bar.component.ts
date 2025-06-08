import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent implements OnInit {
  isDarkMode = true;

  @HostBinding('class.light-mode') get isLight() {
    return !this.isDarkMode;
  }

  ngOnInit(): void {
    // Comprobar si hay una preferencia guardada (opcional)
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') {
      this.isDarkMode = false;
    } else {
      localStorage.setItem('theme', 'dark'); // Guardar preferencia inicial
    }
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  applyTheme() {
    const body = document.querySelector('body');
    if (body) {
      body.classList.toggle('light-mode', !this.isDarkMode);
    }
  }
}
