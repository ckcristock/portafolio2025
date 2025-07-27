import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular';

  products: string[] = [
    'Camiseta de Equipo A',
    'Balón de Fútbol Nike',
    'Botas de Fútbol Adidas',
    'Guantes de Portero Puma',
    'Shorts de Entrenamiento',
    'Medias de Fútbol',
    'Espilleras Nike',
    'Chaqueta de Chándal',
    'Mochila Deportiva',
    'Gorra de Equipo B',
    'Balón de Baloncesto', // Añadido para mostrar que no todos los productos son de fútbol
    'Camiseta de Equipo C',
    'Balón de Voleibol',
  ];

  filteredProducts: string[] = [];

  constructor() {}
}
