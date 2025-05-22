import { Component, inject } from '@angular/core';
import { FleetStateService } from './fleet-state.service';

@Component({
  selector: 'app-fleet-pagination',
  standalone: true,
  template: `
    <div class="px-6 py-3 flex items-center justify-between border-t border-neutral-200">
      <div class="flex-1 flex justify-between sm:hidden">
        <button class="btn btn-secondary" (click)="fleetStateService.prevPage()" [disabled]="!fleetStateService.hasPreviousPage()">Previous</button>
        <button class="btn btn-secondary ml-3" (click)="fleetStateService.nextPage()" [disabled]="!fleetStateService.hasNextPage()">Next</button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-neutral-700">
            Showing <span class="font-medium">{{ (fleetStateService.filteredVehicles().length === 0) ? 0 : ((fleetStateService.currentPage() - 1) * fleetStateService.pageSize() + 1) }}</span>
            to <span class="font-medium">{{ min(fleetStateService.currentPage() * fleetStateService.pageSize(), fleetStateService.filteredVehicles().length) }}</span>
            of <span class="font-medium">{{ fleetStateService.filteredVehicles().length }}</span> filtered
            (out of <span class="font-medium">{{ fleetStateService.vehicles().length }}</span> total)
            results
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <!-- First page button -->
            <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
              (click)="fleetStateService.currentPage.set(1)"
              [disabled]="fleetStateService.currentPage() === 1">
              <span class="material-icons text-sm">first_page</span>
            </button>

            <!-- If 5 or fewer pages, show all -->
            @if (fleetStateService.pageCount() <= 5) {
              @for (page of [].constructor(fleetStateService.pageCount()); track $index) {
                <button class="relative inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium hover:bg-neutral-50"
                  [class.bg-primary-50]="fleetStateService.currentPage() === ($index + 1)"
                  [class.text-primary-600]="fleetStateService.currentPage() === ($index + 1)"
                  [class.bg-white]="fleetStateService.currentPage() !== ($index + 1)"
                  [class.text-neutral-700]="fleetStateService.currentPage() !== ($index + 1)"
                  (click)="fleetStateService.currentPage.set($index + 1)">
                  {{ $index + 1 }}
                </button>
              }
            }
            @else {
              <!-- More than 5 pages: show first, prev, current, next, last, with ellipsis -->
              <!-- First page button (already rendered above) -->

              <!-- Ellipsis if currentPage > 3 -->
              @if (fleetStateService.currentPage() > 3) {
                <span class="inline-flex items-center px-2 text-neutral-400 select-none">&hellip;</span>
              }

              <!-- Previous page button if not first or second -->
              @if (fleetStateService.currentPage() > 2) {
                <button class="relative inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium hover:bg-neutral-50"
                  (click)="fleetStateService.currentPage.set(fleetStateService.currentPage() - 1)"
                  [disabled]="!fleetStateService.hasPreviousPage()"
                  [class.bg-white]="true"
                  [class.text-neutral-700]="true">
                  {{ fleetStateService.currentPage() - 1 }}
                </button>
              }

              <!-- Current page button -->
              <button class="relative inline-flex items-center px-4 py-2 border border-primary-300 bg-primary-50 text-sm font-medium text-primary-600 font-bold cursor-default" disabled>
                {{ fleetStateService.currentPage() }}
              </button>

              <!-- Next page button if not last or second to last -->
              @if (fleetStateService.currentPage() < fleetStateService.lastPage() - 1) {
                <button class="relative inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium hover:bg-neutral-50"
                  (click)="fleetStateService.currentPage.set(fleetStateService.currentPage() + 1)"
                  [disabled]="!fleetStateService.hasNextPage()"
                  [class.bg-white]="true"
                  [class.text-neutral-700]="true">
                  {{ fleetStateService.currentPage() + 1 }}
                </button>
              }

              <!-- Ellipsis if currentPage < lastPage - 2 -->
              @if (fleetStateService.currentPage() < fleetStateService.lastPage() - 2) {
                <span class="inline-flex items-center px-2 text-neutral-400 select-none">&hellip;</span>
              }
            }

            <!-- Last page button -->
            <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
              (click)="fleetStateService.currentPage.set(fleetStateService.lastPage())"
              [disabled]="fleetStateService.currentPage() === fleetStateService.lastPage()">
              <span class="material-icons text-sm">last_page</span>
            </button>

            <!-- Next page button -->
            <button class="relative inline-flex items-center px-2 py-2 border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
              (click)="fleetStateService.nextPage()" [disabled]="!fleetStateService.hasNextPage()">
              <span class="sr-only">Next</span>
              <span class="material-icons text-sm">chevron_right</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  `,
  styles: [`
    button[disabled], .cursor-default[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }
    .inline-flex.ellipsis {
      font-size: 1.2em;
      letter-spacing: 0.2em;
      color: #a3a3a3;
      user-select: none;
      padding: 0 0.5em;
    }
  `]
})
export class FleetPaginationComponent {
  fleetStateService = inject(FleetStateService);

  min(a: number, b: number): number {
    return Math.min(a, b);
  }
}
