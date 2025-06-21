import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/data.models';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss'],
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  showForm = false;
  isEditing = false;
  currentClient: Omit<Client, 'id_cliente'> | Client =
    this.getInitialClientForm();

  constructor(private clientService: ClientService, private router: Router) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getClients().subscribe((clients) => {
      this.clients = clients;
    });
  }

  getInitialClientForm(): Omit<Client, 'id_cliente'> {
    return {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      direccion: '',
      documento_identidad: '',
    };
  }

  openAddForm(): void {
    this.isEditing = false;
    this.currentClient = this.getInitialClientForm();
    this.showForm = true;
  }

  openEditForm(client: Client): void {
    this.isEditing = true;
    this.currentClient = { ...client };
    this.showForm = true;
  }

  saveClient(): void {
    if (this.isEditing) {
      this.clientService
        .updateClient(this.currentClient as Client)
        .subscribe(() => {
          this.loadClients();
          this.closeForm();
        });
    } else {
      this.clientService.addClient(this.currentClient).subscribe(() => {
        this.loadClients();
        this.closeForm();
      });
    }
  }

  deleteClient(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      this.clientService.deleteClient(id).subscribe(() => {
        this.loadClients();
      });
    }
  }

  closeForm(): void {
    this.showForm = false;
  }

  /**
   * Esta es la función clave para la navegación.
   * Utiliza el Router de Angular para cambiar a la vista de prescripciones,
   * pasando el ID del cliente en la URL.
   */
  viewPrescriptions(clientId: number): void {
    this.router.navigate(['/prescriptions', clientId]);
  }
}
