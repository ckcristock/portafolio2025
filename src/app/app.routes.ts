// src/app/routes.ts
import { Routes } from '@angular/router';
import { MainBoardComponent } from './views/main-board/main-board.component'; // Importa tu componente MainBoard
import { AdminPanelComponent } from './views/admin-panel/admin-panel.component';

export const routes: Routes = [
  {
    path: '', // Esto significa la ruta raíz de tu aplicación (por ejemplo, 'http://localhost:4200/')
    component: MainBoardComponent, // Cuando se accede a la raíz, se carga el MainBoardComponent
  },
  {
    path: 'admin', // Nueva ruta para el panel de administración
    component: AdminPanelComponent,
  },
  // Si tienes otras rutas en el futuro, las agregarías aquí, por ejemplo:
  // { path: 'equipos', component: EquiposComponent },
  // { path: 'jugadores', component: JugadoresComponent },
  // { path: '**', redirectTo: '' } // Ruta wildcard para redirigir a la raíz si no se encuentra ninguna otra ruta
];
