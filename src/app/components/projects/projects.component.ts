import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, ProjectService } from '../../services/project.service';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { Lightbox, LightboxModule } from 'ngx-lightbox';

@Component({
  selector: 'app-projects',
  standalone: true,
  // IMPORTANTE: Ya no necesitamos el ImageDetailsComponent
  imports: [CommonModule, ProjectCardComponent, LightboxModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  personalProjects: Project[] = [];

  constructor(
    private projectService: ProjectService,
    private lightbox: Lightbox
  ) {}

  ngOnInit(): void {
    this.projects = this.projectService.getProjects();
    this.personalProjects = this.projectService.getPersonalProjects();
  }

  // Volvemos a una función 'open' simple y directa
  open(projectIndex: number): void {
    const project = this.projects[projectIndex];
    const album = project.screenshots.map((screenshot) => ({
      src: screenshot.src,
      caption: screenshot.caption,
      thumb: screenshot.thumb,
    }));

    this.lightbox.open(album, 0); // ¡Y ya! Esto abre el carrusel.
  }

  openPersonalProjects(projectIndex: number): void {
    const project = this.personalProjects[projectIndex];
    const album = project.screenshots.map((screenshot) => ({
      src: screenshot.src,
      caption: screenshot.caption,
      thumb: screenshot.thumb,
    }));

    this.lightbox.open(album, 0); // Abre el carrusel de proyectos personales.
  }
}
