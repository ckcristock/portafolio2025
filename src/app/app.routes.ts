import { Routes } from '@angular/router';
import { ProjectsComponent } from './components/projects/projects.component';

export const routes: Routes = [
  // Cuando la ruta esté vacía, carga el componente de Proyectos
  { path: '', component: ProjectsComponent, pathMatch: 'full' },

  // Puedes añadir otras rutas aquí si lo necesitas
  // { path: 'contacto', component: ContactoComponent },

  // Una ruta "catch-all" por si el usuario navega a una URL que no existe
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
