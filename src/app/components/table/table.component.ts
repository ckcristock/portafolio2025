// src/app/table/table.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, RouterModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  // --- Entradas (Inputs) ---
  @Input() tableTitle: string = '';
  @Input() data: any[] = [];
  @Input() columns: {
    key: string;
    header: string;
    type?: 'text' | 'number' | 'date' | 'link';
    linkRoute?: string;
  }[] = [];
  @Input() showUploadButton: boolean = false;
  @Input() uploadButtonText: string = 'Subir Archivo';

  // NUEVAS ENTRADAS para filtros/estadísticas
  @Input() showFilterSection: boolean = false; // Controla la visibilidad de la sección de filtros
  @Input() filterSectionTitle: string = 'Filtros y Estadísticas'; // Título para la sección de filtros

  // --- Salidas (Outputs) ---
  @Output() fileUpload = new EventEmitter<File>();
  // Puedes añadir un Output para emitir los cambios de filtro si la lógica de filtro está dentro de esta tabla
  // @Output() filterChanged = new EventEmitter<any>();

  // Referencia al input de tipo 'file' en el template
  @ViewChild('fileInput') fileInput!: ElementRef;

  // NUEVA PROPIEDAD para controlar el estado de colapso
  isFilterSectionCollapsed: boolean = true; // Empieza colapsada por defecto

  ngOnInit(): void {}

  /**
   * Alterna el estado de colapso de la sección de filtros.
   */
  toggleFilterSection(): void {
    this.isFilterSectionCollapsed = !this.isFilterSectionCollapsed;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileUpload.emit(file);
      input.value = '';
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  get columnKeys(): string[] {
    return this.columns.map((col) => col.key);
  }

  getCellValue(item: any, col: any): any {
    const value = item[col.key];
    if (col.type === 'date' && value) {
      return new Date(value).toLocaleDateString();
    }
    return value;
  }

  getLinkRoute(item: any, col: any): string[] {
    return [col.linkRoute, item.id.toString()];
  }
}
