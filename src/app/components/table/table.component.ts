// src/app/table/table.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef,
  TemplateRef,
} from '@angular/core'; // Import TemplateRef
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule for mat-icon-button (if using)

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    RouterModule,
    MatIconModule, // Add MatIconModule here if using <mat-icon> or mat-icon-button
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() tableTitle: string = '';
  @Input() data: any[] = [];
  // UPDATED: Added 'actions' type possibility for columns
  @Input() columns: {
    key: string;
    header: string;
    type?: 'text' | 'number' | 'date' | 'link' | 'actions';
    linkRoute?: string;
    actions?: {
      icon: string;
      tooltip: string;
      color?: string;
      event: string;
    }[];
  }[] = [];
  @Input() showUploadButton: boolean = false;
  @Input() uploadButtonText: string = 'Subir Archivo';
  @Input() showFilterSection: boolean = false;
  @Input() filterSectionTitle: string = 'Filtros y Estadísticas';

  @Output() fileUpload = new EventEmitter<File>();
  // NEW: Output for action button clicks
  @Output() actionClick = new EventEmitter<{ action: string; element: any }>();

  @ViewChild('fileInput') fileInput!: ElementRef;

  isFilterSectionCollapsed: boolean = true;

  ngOnInit(): void {}

  get columnKeys(): string[] {
    return this.columns.map((col) => col.key);
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

  toggleFilterSection(): void {
    this.isFilterSectionCollapsed = !this.isFilterSectionCollapsed;
  }

  // NEW: Method to handle action button clicks and emit them
  onActionClick(action: string, element: any): void {
    this.actionClick.emit({ action, element });
  }
}
