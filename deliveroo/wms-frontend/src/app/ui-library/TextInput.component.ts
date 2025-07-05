import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-text-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label *ngIf="label()" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ label() }}</label>
    <input [type]="type()" [value]="value()" (input)="onInput($event)" [placeholder]="placeholder()" class="input w-full" />
    @if (error()) {
      <div class="mt-1 text-sm text-error-600">{{ error() }}</div>
    }
  `
})
export class TextInputComponent {
  value = input<string>('');
  label = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('');
  error = input<string>('');
  valueChange = output<string>();

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }
}
