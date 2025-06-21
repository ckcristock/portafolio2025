// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { ClientListComponent } from './components/client-list/client-list.component';
import { PrescriptionListComponent } from './components/prescription-list/prescription-list.component';

export const routes: Routes = [
  // Redirige la ruta raíz a la lista de clientes por defecto
  { path: '', redirectTo: '/clients', pathMatch: 'full' },

  // Ruta para mostrar la lista de clientes y el CRUD
  { path: 'clients', component: ClientListComponent },

  // Ruta para mostrar las fórmulas de un cliente específico, usando su ID
  { path: 'prescriptions/:clientId', component: PrescriptionListComponent },
];
