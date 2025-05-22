import { Component } from '@angular/core';

@Component({
  selector: 'app-vehicle-actions',
  standalone: true,
  template: `
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <h1 class="text-2xl font-bold">Fleet Management</h1>
      <div class="mt-4 md:mt-0">
        <button class="btn btn-primary">
          <span class="material-icons mr-1">add</span>
          Add NEW Vehicle
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class VehicleActionsComponent {}
