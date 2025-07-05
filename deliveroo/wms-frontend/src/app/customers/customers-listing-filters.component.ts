import { Component, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CustomersListingFiltersService } from './customers-listing-filters.service';
import { LucideAngularModule, Search } from 'lucide-angular';
import { SectionComponent } from '../ui-library/Section.component';
import { DropdownComponent } from '../ui-library/Dropdown.component';
import { TextInputComponent } from '../ui-library/TextInput.component';

@Component({
  selector: 'app-customers-listing-filters',
  standalone: true,
  imports: [FormsModule, LucideAngularModule, DropdownComponent, TextInputComponent],
  template: `
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <ui-text-input label="Search Customers" [value]="filtersService.searchTerm()" (valueChange)="filtersService.setSearchTerm($event)" placeholder="Search by company name, contact person, or phone...">
          <lucide-icon [img]="SearchIcon" size="18" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></lucide-icon>
        </ui-text-input>
      </div>
      <div class="w-48">
        <ui-dropdown label="Status" [options]="statusOptions" [value]="filtersService.status()" (valueChange)="filtersService.setStatus($event)" />
      </div>
    </div>
    @if (filtersService.hasActiveFilters()) {
      <div class="mt-4 flex items-center justify-between">
        <span class="text-sm text-gray-600 dark:text-gray-400">
          Filters applied
        </span>
        <button (click)="filtersService.resetFilters()" class="text-sm text-primary-600 hover:text-primary-500">
          Clear all filters
        </button>
      </div>
    }
  `
})
export class CustomersListingFiltersComponent {
  // Lucide icons
  SearchIcon = Search;

  public filtersService = inject(CustomersListingFiltersService);

  statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];
}