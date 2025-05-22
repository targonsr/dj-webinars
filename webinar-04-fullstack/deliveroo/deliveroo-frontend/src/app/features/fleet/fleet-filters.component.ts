import { Component, inject } from '@angular/core';
import { FleetStateService } from './fleet-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fleet-filters',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div class="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <div class="flex-grow">
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 pointer-events-none">
              <span class="material-icons text-base">search</span>
            </span>
            <input 
              type="text" 
              placeholder="Search vehicles..." 
              class="form-control pl-10" 
              [value]="fleetStateService.search().text"
              (input)="onTextChange($event)"
              style="padding-left: 2.5rem;" />
          </div>
        </div>
        <div class="flex flex-wrap gap-2 items-center">
          <select class="form-control" [value]="fleetStateService.search().type ?? ''" (change)="onTypeChange($event)">
            <option value="">All Types</option>
            @for (type of vehicleTypes; track type) {
              <option [value]="type">{{ fleetStateService.vehicleTypeDict[type] }}</option>
            }
          </select>
          <select class="form-control" [value]="fleetStateService.search().status ?? ''" (change)="onStatusChange($event)">
            <option value="">All Statuses</option>
            @for (status of vehicleStatuses; track status) {
              <option [value]="status">{{ fleetStateService.vehicleStatusDict[status] }}</option>
            }
          </select>
          <button type="button" class="clear-filters-btn" (click)="clearFilters()">
            <span class="material-icons clear-icon">close</span>
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-control.pl-10, input[style*='padding-left: 2.5rem'] {
      padding-left: 2.5rem !important;
    }
    .material-icons.text-base {
      font-size: 1.25rem;
    }
    .clear-filters-btn {
      display: flex;
      align-items: center;
      background: #f6f6f6;
      color: #666;
      border: none;
      border-radius: 6px;
      padding: 0.25rem 0.75rem;
      font-size: 0.95rem;
      transition: background 0.2s, color 0.2s;
      box-shadow: none;
      outline: none;
      cursor: pointer;
    }
    .clear-filters-btn:hover, .clear-filters-btn:focus {
      background: #ececec;
      color: #222;
    }
    .clear-icon {
      font-size: 1.1rem;
      margin-right: 0.3em;
      opacity: 0.7;
    }
  `]
})
export class FleetFiltersComponent {
  fleetStateService = inject(FleetStateService);
  vehicleTypes = Object.keys(this.fleetStateService.vehicleTypeDict) as (keyof typeof this.fleetStateService.vehicleTypeDict)[];
  vehicleStatuses = Object.keys(this.fleetStateService.vehicleStatusDict) as (keyof typeof this.fleetStateService.vehicleStatusDict)[];

  onTextChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.fleetStateService.setSearchText(value);
  }
  onTypeChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.fleetStateService.setSearchType(value === '' ? null : value as import('./vehicle.model').VehicleType);
  }
  onStatusChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.fleetStateService.setSearchStatus(value === '' ? null : value as import('./vehicle.model').VehicleStatus);
  }
  clearFilters() {
    this.fleetStateService.setSearchText('');
    this.fleetStateService.setSearchType(null);
    this.fleetStateService.setSearchStatus(null);
  }
}
