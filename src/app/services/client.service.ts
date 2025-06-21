// src/app/services/client.service.ts

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Client } from '../models/data.models';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  // Datos de ejemplo (mock) simulando la tabla 'cliente'
  private clients: Client[] = [
    {
      id_cliente: 1,
      nombre: 'Sofia',
      apellido: 'Garcia',
      email: 'sofia.garcia@example.com',
      telefono: '3001112233',
      direccion: 'Avenida Siempre Viva 100',
      documento_identidad: '100010001',
    },
    {
      id_cliente: 2,
      nombre: 'Carlos',
      apellido: 'Martinez',
      email: 'carlos.martinez@example.com',
      telefono: '3112223344',
      direccion: 'Calle Falsa 123',
      documento_identidad: '100010002',
    },
  ];

  constructor() {}

  // Obtener todos los clientes
  getClients(): Observable<Client[]> {
    return of(this.clients);
  }

  // Obtener un cliente por su ID
  getClient(id: number): Observable<Client | undefined> {
    return of(this.clients.find((c) => c.id_cliente === id));
  }

  // Agregar un nuevo cliente
  addClient(client: Omit<Client, 'id_cliente'>): Observable<Client> {
    const newId =
      this.clients.length > 0
        ? Math.max(...this.clients.map((c) => c.id_cliente)) + 1
        : 1;
    const newClient = { ...client, id_cliente: newId };
    this.clients.push(newClient);
    return of(newClient);
  }

  // Actualizar un cliente existente
  updateClient(clientToUpdate: Client): Observable<Client> {
    const index = this.clients.findIndex(
      (c) => c.id_cliente === clientToUpdate.id_cliente
    );
    if (index > -1) {
      this.clients[index] = clientToUpdate;
    }
    return of(clientToUpdate);
  }

  // Eliminar un cliente por su ID
  deleteClient(id: number): Observable<{}> {
    const index = this.clients.findIndex((c) => c.id_cliente === id);
    if (index > -1) {
      this.clients.splice(index, 1);
    }
    return of({});
  }
}
