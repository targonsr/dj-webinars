import { Component, inject } from '@angular/core';
import { FleetStateService } from './fleet-state.service';

@Component({
  selector: 'app-fleet-table',
  standalone: true,
  template: `
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-neutral-200">
          <thead class="bg-neutral-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Vehicle ID</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Type</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">License Plate</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Current Driver</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Last Maintenance</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-neutral-200">
            @for (vehicle of fleetStateService.visibleVehicles(); track vehicle.id) {
              <tr class="hover:bg-neutral-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{{ vehicle.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">{{ vehicle.type }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">{{ vehicle.licensePlate }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getStatusClass(vehicle.status)">
                    {{ vehicle.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">{{ vehicle.currentDriver }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">{{ vehicle.lastMaintenance }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button class="text-primary-500 hover:text-primary-700 transition-colors mr-2">
                    <span class="material-icons text-base">edit</span>
                  </button>
                  <button class="text-neutral-400 hover:text-neutral-600 transition-colors">
                    <span class="material-icons text-base">more_vert</span>
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: []
})
export class FleetTableComponent {
  fleetStateService = inject(FleetStateService);

  getStatusClass(status: string): string {
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
