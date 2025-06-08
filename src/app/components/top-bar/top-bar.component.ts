import {
  Component,
  OnInit,
  HostBinding,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'], // corregí typo styleUrl -> styleUrls
})
export class TopBarComponent implements OnInit {
  isDarkMode = true;

  @HostBinding('class.light-mode') get isLight() {
    return !this.isDarkMode;
  }

  // Nuevo Output para emitir evento toggle sidebar
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  ngOnInit(): void {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') {
      this.isDarkMode = false;
    } else {
      localStorage.setItem('theme', 'dark');
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

  // Nuevo método para emitir evento toggle sidebar
  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }
}
