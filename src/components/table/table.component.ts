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
import { CommonModule } from '@angular/common'; // Importa CommonModule para directivas como ngFor, ngIf
import { MatTableModule } from '@angular/material/table'; // Importa MatTableModule
import { MatButtonModule } from '@angular/material/button'; // Importa MatButtonModule
import { RouterModule } from '@angular/router'; // Importa RouterModule si usas routerLink

@Component({
  selector: 'app-table',
  standalone: true, // ¡Aquí está el cambio clave!
  imports: [
    CommonModule, // Necesario para ngFor, ngIf, ngSwitch, etc.
    MatTableModule,
    MatButtonModule,
    RouterModule, // Si usas routerLink en tu tabla
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  // ... (el resto de tu código del componente es el mismo)
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
  @Output() fileUpload = new EventEmitter<File>();
  @ViewChild('fileInput') fileInput!: ElementRef;

  ngOnInit(): void {}

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
