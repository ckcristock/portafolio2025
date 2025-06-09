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
      title: 'Proyecto "CRM Pro"',
      description:
        'Un sistema de gestión de clientes desarrollado con Angular y Node.js, enfocado en la optimización de ventas.',
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
      title: 'Proyecto "Zenva Runner"',
      description:
        'Videojuego de plataformas 2D para móviles, creado con el motor Godot y exportado a Android.',
      coverImage: 'assets/images/project2-cover.png',
      screenshots: [
        {
          src: 'assets/images/project2-ss1.png',
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
      title: 'Proyecto "Weather Now"',
      description:
        'Aplicación del clima en tiempo real utilizando React y una API externa para obtener los datos meteorológicos.',
      coverImage: 'assets/images/project3-cover.png',
      screenshots: [
        {
          src: 'assets/images/project3-ss1.png',
          caption: 'Vista principal del clima.',
          thumb: 'assets/images/project3-ss1.png',
        },
      ],
    },
    {
      id: 4,
      title: 'Mi Portafolio Personal',
      description:
        'Este mismo portafolio, diseñado para ser rápido, responsivo y mostrar mis habilidades con Angular.',
      coverImage: 'assets/images/project4-cover.png',
      screenshots: [
        {
          src: 'assets/images/project4-ss1.png',
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
