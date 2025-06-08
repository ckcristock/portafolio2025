import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, ProjectService } from '../../services/project.service';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { Lightbox, LightboxModule } from 'ngx-lightbox';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent, LightboxModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];

  // La propiedad 'albums' y el método 'prepareLightboxAlbums' han sido eliminados.

  constructor(
    private projectService: ProjectService,
    private lightbox: Lightbox
  ) {}

  ngOnInit(): void {
    this.projects = this.projectService.getProjects();
  }

  /**
   * Este método ahora crea el álbum y abre el carrusel sobre la marcha.
   * @param projectIndex El índice del proyecto al que se le hizo clic.
   */
  open(projectIndex: number): void {
    // console.log('PASO 2: El componente PADRE ha recibido el evento. Abriendo carrusel para el proyecto índice:', projectIndex);

    // 1. Crear el álbum para el lightbox a partir de las imágenes del proyecto específico
    const project = this.projects[projectIndex];
    const album = project.screenshots.map((screenshot) => {
      return {
        src: screenshot.src,
        caption: screenshot.caption,
        thumb: screenshot.thumb,
      };
    });

    // 2. Abrir el lightbox con el álbum recién creado
    this.lightbox.open(album, 0, {
      centerVertically: true,
      fitImageInViewPort: true,
      wrapAround: true,
    });
  }

  close(): void {
    this.lightbox.close();
  }
}
