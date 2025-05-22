import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FleetStore } from './fleet-store.service';
import { FleetStateService } from './fleet-state.service';
import { VehicleActionsComponent } from './vehicle-actions.component';
import { FleetFiltersComponent } from './fleet-filters.component';
import { FleetTableComponent } from './fleet-table.component';
import { FleetPaginationComponent } from './fleet-pagination.component';

@Component({
  selector: 'app-fleet',
  standalone: true,
  imports: [CommonModule, VehicleActionsComponent, FleetFiltersComponent, FleetTableComponent, FleetPaginationComponent],
  providers: [FleetStore, FleetStateService],
  template: `
    <div class="container mx-auto px-4 py-8">
      <app-vehicle-actions></app-vehicle-actions>
      <app-fleet-filters></app-fleet-filters>
      <app-fleet-table></app-fleet-table>
      <app-fleet-pagination></app-fleet-pagination>
    </div>
  `
})
export class FleetComponent { // UI
  store = inject(FleetStore);
  fleetStateService = inject(FleetStateService);

  // state
 
  // effect (signal, computed, effect)
  ngOnInit() { // ngOnDestroy
    // Access state: this.store.vehicles(), this.store.filters(), etc.
    // Update state: this.store.setVehicles([...]), this.store.setFilters({...}), etc.
  }

  getStatusClass(status: string): string { // CSS classes for tailwind
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch(status) {
      case 'Available':
        return `${baseClasses} bg-success-50 text-success-500`;
      case 'On Delivery':
        return `${baseClasses} bg-primary-50 text-primary-500`;
      case 'Maintenance':
        return `${baseClasses} bg-warning-50 text-warning-500`;
      case 'Offline':
        return `${baseClasses} bg-neutral-100 text-neutral-500`;
      default:
        return baseClasses;
    }
  }
}