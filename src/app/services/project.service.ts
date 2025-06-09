import { Injectable } from '@angular/core';

// Definimos la estructura que tendrá cada objeto de proyecto
export interface Project {
  id: number;
  title: string;
  description: string;
  coverImage: string; // La imagen que se verá en la tarjeta
  screenshots: {
    src: string;
    caption: string;
    thumb: string;
  }[]; // Galería de imágenes para el carrusel
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  // AQUÍ AÑADES TUS PROYECTOS - AHORA CON 4 EJEMPLOS
  private readonly projects: Project[] = [
    {
      id: 1,
      title: 'Proyecto "Fenix ERP"',
      description:
        'Un sistema de gestión integral para ópticas desarrollado con Laravel y React, enfocado en la administración de ventas, inventario y fórmulas de optometría.',
      coverImage: 'assets/images/fenix-cover.png',
      screenshots: [
        {
          src: 'assets/images/fenix-cover.png',
          caption: 'Dashboard principal.',
          thumb: 'assets/images/fenix-cover.png',
        },
        {
          src: 'assets/images/project1-ss2.png',
          caption: 'Gestión de contactos.',
          thumb: 'assets/images/project1-ss2.png',
        },
        {
          src: 'assets/images/project1-ss3.png',
          caption: 'Reportes de ventas.',
          thumb: 'assets/images/project1-ss3.png',
        },
      ],
    },
    {
      id: 2,
      title: 'Proyecto "Ateneo"',
      description:
        'Un sistema ERP desarrollado con PHP y Angular, enfocado en la gestión de procesos y recursos para Entidades Prestadoras de Salud (IPS) en Colombia.',
      coverImage: 'assets/images/ateneo-cover.png',
      screenshots: [
        {
          src: 'assets/images/ateneo-cover.png',
          caption: 'Pantalla de inicio.',
          thumb: 'assets/images/project2-ss1.png',
        },
        {
          src: 'assets/images/project2-ss2.png',
          caption: 'Gameplay del nivel 1.',
          thumb: 'assets/images/project2-ss2.png',
        },
      ],
    },
    {
      id: 3,
      title: 'Proyecto "Intelliveer"',
      description:
        'Un software en la nube desarrollado con Laravel y React, enfocado en la gestión de pacientes de ortodoncia.',
      coverImage: 'assets/images/intelliveer-cover.png',
      screenshots: [
        {
          src: 'assets/images/intelliveer-cover.png',
          caption: 'Vista principal del clima.',
          thumb: 'assets/images/project3-ss1.png',
        },
      ],
    },
    {
      id: 4,
      title: 'Intranet Pharmasan',
      description:
        'Una intranet corporativa desarrollada con Express y Vue 3, enfocada en la modernización y migración de la plataforma interna de la empresa.',
      coverImage: 'assets/images/pharmasan-cover.png',
      screenshots: [
        {
          src: 'assets/images/pharmasan-cover.png',
          caption: 'Vista en modo oscuro.',
          thumb: 'assets/images/project4-ss1.png',
        },
        {
          src: 'assets/images/project4-ss2.png',
          caption: 'Vista en modo claro.',
          thumb: 'assets/images/project4-ss2.png',
        },
      ],
    },
  ];

  constructor() {}

  getProjects(): Project[] {
    return this.projects;
  }
}
