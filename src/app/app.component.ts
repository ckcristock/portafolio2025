import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular';
  observable = new Subject<string>();
  form;
  options = [
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
  ];

  buscando = false;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: [''],
    });
  }

  subscribeToObservable() {
    this.observable.subscribe((value) => {
      return new Promise<void>((resolve, reject) => {
        this.options.find((option) => option === value) ? resolve() : reject();
      });
    });
  }

  onSubmit() {
    throw new Error('Method not implemented.');
  }
}
