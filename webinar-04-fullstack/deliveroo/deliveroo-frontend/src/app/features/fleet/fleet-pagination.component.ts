import { Component, inject } from '@angular/core';
import { FleetStore } from './fleet-store.service';

@Component({
  selector: 'app-fleet-pagination',
  standalone: true,
  template: `
    <div class="px-6 py-3 flex items-center justify-between border-t border-neutral-200">
      <div class="flex-1 flex justify-between sm:hidden">
        <button class="btn btn-secondary" (click)="fleetStore.prevPage()" [disabled]="!fleetStore.hasPreviousPage()">Previous</button>
        <button class="btn btn-secondary ml-3" (click)="fleetStore.nextPage()" [disabled]="!fleetStore.hasNextPage()">Next</button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-neutral-700">
            Showing <span class="font-medium">{{ (fleetStore.filteredVehicles().length === 0) ? 0 : ((fleetStore.currentPage() - 1) * fleetStore.pageSize() + 1) }}</span>
            to <span class="font-medium">{{ min(fleetStore.currentPage() * fleetStore.pageSize(), fleetStore.filteredVehicles().length) }}</span>
            of <span class="font-medium">{{ fleetStore.filteredVehicles().length }}</span> filtered
            (out of <span class="font-medium">{{ fleetStore.vehicles().length }}</span> total)
            results
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <!-- First page button -->
            <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
              (click)="fleetStore.setCurrentPage(1)"
              [disabled]="fleetStore.currentPage() === 1">
              <span class="material-icons text-sm">first_page</span>
            </button>

            <!-- If 5 or fewer pages, show all -->
            @if (fleetStore.pageCount() <= 5) {
              @for (page of [].constructor(fleetStore.pageCount()); track $index) {
                <button class="relative inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium hover:bg-neutral-50"
                  [class.bg-primary-50]="fleetStore.currentPage() === ($index + 1)"
                  [class.text-primary-600]="fleetStore.currentPage() === ($index + 1)"
                  [class.bg-white]="fleetStore.currentPage() !== ($index + 1)"
                  [class.text-neutral-700]="fleetStore.currentPage() !== ($index + 1)"
                  (click)="fleetStore.setCurrentPage($index + 1)">
                  {{ $index + 1 }}
                </button>
              }
            }
            @else {
              <!-- More than 5 pages: show first, prev, current, next, last, with ellipsis -->
              <!-- First page button (already rendered above) -->

              <!-- Ellipsis if currentPage > 3 -->
              @if (fleetStore.currentPage() > 3) {
                <span class="inline-flex items-center px-2 text-neutral-400 select-none">&hellip;</span>
              }

              <!-- Previous page button if not first or second -->
              @if (fleetStore.currentPage() > 2) {
                <button class="relative inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium hover:bg-neutral-50"
                  (click)="fleetStore.setCurrentPage(fleetStore.currentPage() - 1)"
                  [disabled]="!fleetStore.hasPreviousPage()"
                  [class.bg-white]="true"
                  [class.text-neutral-700]="true">
                  {{ fleetStore.currentPage() - 1 }}
                </button>
              }

              <!-- Current page button -->
              <button class="relative inline-flex items-center px-4 py-2 border border-primary-300 bg-primary-50 text-sm font-medium text-primary-600 font-bold cursor-default" disabled>
                {{ fleetStore.currentPage() }}
              </button>

              <!-- Next page button if not last or second to last -->
              @if (fleetStore.currentPage() < fleetStore.lastPage() - 1) {
                <button class="relative inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium hover:bg-neutral-50"
                  (click)="fleetStore.setCurrentPage(fleetStore.currentPage() + 1)"
                  [disabled]="!fleetStore.hasNextPage()"
                  [class.bg-white]="true"
                  [class.text-neutral-700]="true">
                  {{ fleetStore.currentPage() + 1 }}
                </button>
              }

              <!-- Ellipsis if currentPage < lastPage - 2 -->
              @if (fleetStore.currentPage() < fleetStore.lastPage() - 2) {
                <span class="inline-flex items-center px-2 text-neutral-400 select-none">&hellip;</span>
              }
            }

            <!-- Last page button -->
            <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
              (click)="fleetStore.setCurrentPage(fleetStore.lastPage())"
              [disabled]="fleetStore.currentPage() === fleetStore.lastPage()">
              <span class="material-icons text-sm">last_page</span>
            </button>

            <!-- Next page button -->
            <button class="relative inline-flex items-center px-2 py-2 border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
              (click)="fleetStore.nextPage()" [disabled]="!fleetStore.hasNextPage()">
              <span class="sr-only">Next</span>
              <span class="material-icons text-sm">chevron_right</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  `,
  styles: [
    `button[disabled], .cursor-default[disabled] { opacity: 0.5; cursor: not-allowed; pointer-events: none; }`,
    `.inline-flex.ellipsis { font-size: 1.2em; letter-spacing: 0.2em; color: #a3a3a3; user-select: none; padding: 0 0.5em; }`
  ]
})
export class FleetPaginationComponent {
  fleetStore = inject(FleetStore);
  // constructor() {
  //   this.fleetStore = inject(FleetStore);
  // }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }
}
