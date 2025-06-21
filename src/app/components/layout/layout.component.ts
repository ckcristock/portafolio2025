import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  isSidebarOpen = true; // La sidebar estará abierta por defecto

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
