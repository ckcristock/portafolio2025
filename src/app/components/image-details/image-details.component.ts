import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interfaz para los detalles que vamos a recibir
export interface ImageDetails {
  title: string;
  description: string;
}

@Component({
  selector: 'app-image-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-details.component.html',
  styleUrls: ['./image-details.component.scss'],
})
export class ImageDetailsComponent {
  // Usamos @Input para recibir los datos desde el componente padre
  @Input() details: ImageDetails | null = null;
}
