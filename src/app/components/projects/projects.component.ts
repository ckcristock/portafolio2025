import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, ProjectService } from '../../services/project.service';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { Lightbox, LightboxModule } from 'ngx-lightbox'; // <-- Importamos Lightbox

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    ProjectCardComponent,
    LightboxModule, // <-- Lo importamos aquí
  ],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  private albums: any[] = [];

  constructor(
    private projectService: ProjectService,
    private lightbox: Lightbox
  ) {}

  ngOnInit(): void {
    this.projects = this.projectService.getProjects();
    this.prepareLightboxAlbums();
  }

  prepareLightboxAlbums(): void {
    this.albums = this.projects.map((project) => {
      return {
        id: project.id,
        images: project.screenshots.map((ss) => ({
          src: ss.src,
          caption: ss.caption,
          thumb: ss.thumb,
        })),
      };
    });
  }

  open(projectIndex: number): void {
    // Abrimos el álbum de imágenes correspondiente al proyecto clickeado
    this.lightbox.open(this.albums[projectIndex].images, 0, {
      centerVertically: true,
      fitImageInViewPort: true,
      wrapAround: true,
    });
  }

  close(): void {
    this.lightbox.close();
  }
}
