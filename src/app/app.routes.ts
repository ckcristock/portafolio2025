import { Routes } from '@angular/router';
import { ClientListComponent } from './components/client-list/client-list.component';
import { PrescriptionListComponent } from './components/prescription-list/prescription-list.component';
import { LayoutComponent } from './components/layout/layout.component'; // <-- Importamos el Layout

export const routes: Routes = [
  // Ruta principal que usa el LayoutComponent
  {
    path: '',
    component: LayoutComponent, // <-- El Layout ahora es el componente padre
    children: [
      { path: '', redirectTo: 'clients', pathMatch: 'full' }, // Redirige a /clients por defecto
      { path: 'clients', component: ClientListComponent },
      { path: 'prescriptions/:clientId', component: PrescriptionListComponent },
      // ... futuras rutas que usarán el layout irían aquí
    ],
  },
  // Redirigir cualquier otra ruta no encontrada a la página principal
  { path: '**', redirectTo: '' },
];
