// src/app/shared/navbar/navbar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para directivas comunes de Angular
import { RouterModule } from '@angular/router'; // Necesario para el routerLink

@Component({
  selector: 'app-navbar', // Selector para usar este componente en el HTML
  standalone: true, // Es un componente standalone
  imports: [
    CommonModule, // Para ngIf, ngFor, etc.
    RouterModule, // Para usar routerLink en la plantilla
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'], // O .scss si usas Sass
})
export class NavbarComponent {
  // Aquí podrías añadir lógica si tuvieras más elementos dinámicos en el navbar
  // Por ahora, las rutas son fijas en la plantilla.
}
