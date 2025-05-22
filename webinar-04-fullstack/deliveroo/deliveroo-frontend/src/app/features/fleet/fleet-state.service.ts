import { Injectable, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { VehicleDTO, VehicleType, VehicleStatus } from './vehicle.model';
import { VehicleHTTPService } from './vehicle-http.service';

@Injectable({
  // providedIn: 'root'
  providedIn: null
})
export class FleetStateService {
  private vehicleHTTP = inject(VehicleHTTPService);

  // getAllVehicles - async + rxjs + lazy == reactive stream
  // vehicles - signal + always has value
  // toSignal - EAGERLY subscribes to the observable and returns a signal
  vehicles = toSignal(this.vehicleHTTP.getAllVehicles(), { initialValue: [] });

  // Pagination state
  pageSize = signal<10 | 20 | 50>(10);
  currentPage = signal(1);

  // Computed: total number of pages
  pageCount = computed(() => {
    const total = this.vehicles().length;
    const size = this.pageSize();
    return size > 0 ? Math.ceil(total / size) : 1;
  });

  // Search/filter state
  search = signal<{ text: string; type: VehicleType | null; status: VehicleStatus | null }>({
    text: '',
    type: null,
    status: null
  });

  // Dictionaries for UI
  vehicleTypeDict: Record<VehicleType, string> = {
    truck: 'Truck',
    van: 'Van',
    car: 'Car',
  };
  vehicleStatusDict: Record<VehicleStatus, string> = {
    Available: 'Available',
    'On Delivery': 'On Delivery',
    Maintenance: 'Maintenance',
    Offline: 'Offline',
  };

  // Computed: vehicles filtered by search
  filteredVehicles = computed(() => {
    const all = this.vehicles();
    const { text, type, status } = this.search();
    let filtered = all;
    if (text && text.trim()) {
      const lower = text.trim().toLowerCase();
      filtered = filtered.filter(v =>
        v.licensePlate?.toLowerCase().includes(lower) ||
        v.currentDriver?.toLowerCase().includes(lower)
      );
    }
    if (type) {
      filtered = filtered.filter(v => v.type === type);
    }
    if (status) {
      filtered = filtered.filter(v => v.status === status);
    }
    return filtered;
  });

  // Computed: vehicles visible on the current page (pagination only)
  visibleVehicles = computed(() => {
    const filtered = this.filteredVehicles();
    const size = this.pageSize();
    const page = this.currentPage();
    const start = (page - 1) * size;
    return filtered.slice(start, start + size);
  });

  // Methods to change page
  nextPage = () => {
    const next = this.currentPage() + 1;
    if (next <= this.pageCount()) {
      this.currentPage.set(next);
    }
  };

  prevPage = () => {
    const prev = this.currentPage() - 1;
    if (prev >= 1) {
      this.currentPage.set(prev);
    }
  };

  // Computed: last page number
  lastPage = computed(() => this.pageCount());

  // Computed: has next/previous page
  hasNextPage = computed(() => this.currentPage() < this.lastPage());
  hasPreviousPage = computed(() => this.currentPage() > 1);

  // Methods to update search state
  setSearchText = (text: string) => {
    this.search.update(s => ({ ...s, text }));
    this.currentPage.set(1);
  };
  setSearchType = (type: VehicleType | null) => {
    this.search.update(s => ({ ...s, type }));
    this.currentPage.set(1);
  };
  setSearchStatus = (status: VehicleStatus | null) => {
    this.search.update(s => ({ ...s, status }));
    this.currentPage.set(1);
  };
} 
