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
      id: 3,
      title: 'Proyecto "Intelliveer"',
      description:
        'Un software en la nube desarrollado con Laravel y React, enfocado en la gestión de pacientes de ortodoncia en estados unidos.',
      coverImage: 'assets/images/intelliveer-cover.png',
      screenshots: [
        {
          src: 'assets/images/intelliveer-cover.png',
          caption: 'Login.',
          thumb: 'assets/images/intelliveer-cover.png',
        },
        {
          src: 'assets/images/intelliveer-dashboard.png',
          caption: 'Dashboard.',
          thumb: 'assets/images/intelliveer-dashboard.png',
        },
        {
          src: 'assets/images/intelliveer-patients.png',
          caption: 'Patients and Treatments.',
          thumb: 'assets/images/intelliveer-patients.png',
        },
        {
          src: 'assets/images/intelliveer-scheduler.png',
          caption: 'Scheduler.',
          thumb: 'assets/images/intelliveer-scheduler.png',
        },
        {
          src: 'assets/images/intelliveer-billing.png',
          caption: 'Billing.',
          thumb: 'assets/images/intelliveer-billing.png',
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
          caption: 'Login de acceso al sistema.',
          thumb: 'assets/images/ateneo-cover.png',
        },
        {
          src: 'assets/images/ateneo-dashboard.png',
          caption: 'Dashboard.',
          thumb: 'assets/images/ateneo-dashboard.png',
        },
        {
          src: 'assets/images/ateneo-citas.png',
          caption: 'Programación de citas.',
          thumb: 'assets/images/ateneo-citas.png',
        },
        {
          src: 'assets/images/ateneo-facturacion.png',
          caption: 'Facturación.',
          thumb: 'assets/images/ateneo-facturacion.png',
        },
        {
          src: 'assets/images/ateneo-historia.png',
          caption: 'Historia clínica.',
          thumb: 'assets/images/ateneo-historia.png',
        },
      ],
    },
  ];

  private readonly personalProjects: Project[] = [
    {
      id: 1,
      title: 'Proyecto "Fenix ERP"',
      description:
        'Un sistema de gestión integral para ópticas desarrollado con Laravel y React, enfocado en la administración de ventas, inventario y fórmulas de optometría.',
      coverImage: 'assets/images/fenix-cover.png',
      screenshots: [
        {
          src: 'assets/images/fenix-cover.png',
          caption: 'Login de acceso al sistema.',
          thumb: 'assets/images/fenix-cover.png',
        },
        {
          src: 'assets/images/fenix-clientes.png',
          caption: 'Administración de clientes.',
          thumb: 'assets/images/fenix-clientes.png',
        },
        {
          src: 'assets/images/fenix-inventario.png',
          caption: 'Gestión de inventario.',
          thumb: 'assets/images/fenix-inventario.png',
        },
        {
          src: 'assets/images/fenix-ventas.png',
          caption: 'Gestión de ventas.',
          thumb: 'assets/images/fenix-ventas.png',
        },
        {
          src: 'assets/images/fenix-reportes.png',
          caption: 'Reportes.',
          thumb: 'assets/images/fenix-reportes.png',
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
          caption: 'Login de acceso al sistema.',
          thumb: 'assets/images/pharmasan-cover.png',
        },
        {
          src: 'assets/images/pharmasan-dashboard.png',
          caption: 'Dashboard.',
          thumb: 'assets/images/pharmasan-dashboard.png',
        },
        {
          src: 'assets/images/pharmasan-inventario.png',
          caption: 'Gestión de inventario.',
          thumb: 'assets/images/pharmasan-inventario.png',
        },
        {
          src: 'assets/images/pharmasan-dispensacion.png',
          caption: 'Dispensación.',
          thumb: 'assets/images/pharmasan-dispensacion.png',
        },
        {
          src: 'assets/images/pharmasan-calidad.png',
          caption: 'Gestión de calidad.',
          thumb: 'assets/images/pharmasan-calidad.png',
        },
      ],
    },
  ];

  constructor() {}

  getProjects(): Project[] {
    return this.projects;
  }
  getPersonalProjects(): Project[] {
    return this.personalProjects;
  }
}
