import { Component, OnInit, effect, inject } from '@angular/core';

import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from './customers.service';
import { CustomersListingFiltersService } from './customers-listing-filters.service';
import { NotificationService } from '../notifications/notification.service';
import { Customer } from './customers.model';
import { CustomersStatsComponent } from './customers-stats.component';
import { CustomersListingFiltersComponent } from './customers-listing-filters.component';
import { CustomersListingComponent } from './customers-listing.component';
import { LucideAngularModule, Plus, X, UserMinus } from 'lucide-angular';
import { SectionComponent } from '../ui-library/Section.component';
import { DropdownComponent } from '../ui-library/Dropdown.component';
import { TextInputComponent } from '../ui-library/TextInput.component';
import { Heading1Component, Heading3Component, SubtitleComponent } from '../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    CustomersStatsComponent,
    CustomersListingFiltersComponent,
    CustomersListingComponent,
    SectionComponent,
    DropdownComponent,
    TextInputComponent,
    Heading1Component,
    SubtitleComponent, 
    Heading3Component
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <ui-heading1>Customers</ui-heading1>
          <ui-subtitle>Manage your customers and their details</ui-subtitle>
        </div>
        <button (click)="showAddCustomerModal = true" class="btn btn-primary">
          <lucide-icon [img]="PlusIcon" size="18" class="mr-2"></lucide-icon>
          Add Customer
        </button>
      </div>

      <!-- Stats Section -->
      <ui-section>
        <app-customers-stats [customers]="customers" />
      </ui-section>

      <!-- Filters Section -->
      <ui-section>
        <app-customers-listing-filters />
      </ui-section>

      <!-- Listing Section -->
      <ui-section>
        <app-customers-listing 
          [customers]="filteredCustomers" 
          (deactivateCustomer)="deactivateCustomer($event)" />
      </ui-section>
    </div>

    <!-- Add Customer Modal -->
    @if (showAddCustomerModal) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
          <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
            <ui-heading3>Add New Customer</ui-heading3>
            <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <lucide-icon [img]="XIcon" size="24"></lucide-icon>
            </button>
          </div>

          <form [formGroup]="customerForm" (ngSubmit)="onSubmit()" class="p-6">
            <div class="space-y-6">
              <!-- Company Information -->
              <ui-section>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ui-text-input label="Company Name *" [value]="customerForm.get('companyName')?.value" (valueChange)="customerForm.get('companyName')?.setValue($event)" [error]="customerForm.get('companyName')?.invalid && customerForm.get('companyName')?.touched ? 'Company name is required' : ''" placeholder="Enter company name" />
                  <ui-dropdown label="Country of Origin *" [options]="countryOptions" [value]="customerForm.get('countryOfOrigin')?.value" (valueChange)="customerForm.get('countryOfOrigin')?.setValue($event)" />
                </div>
              </ui-section>

              <!-- Contact Information -->
              <ui-section>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ui-text-input label="Contact Person *" [value]="customerForm.get('contactPerson')?.value" (valueChange)="customerForm.get('contactPerson')?.setValue($event)" [error]="customerForm.get('contactPerson')?.invalid && customerForm.get('contactPerson')?.touched ? 'Contact person is required' : ''" placeholder="Enter contact person name" />
                  <ui-text-input label="Contact Title" [value]="customerForm.get('contactTitle')?.value" (valueChange)="customerForm.get('contactTitle')?.setValue($event)" placeholder="e.g., Operations Manager" />
                  <ui-text-input label="Phone Number *" [value]="customerForm.get('phone')?.value" (valueChange)="customerForm.get('phone')?.setValue($event)" [error]="customerForm.get('phone')?.invalid && customerForm.get('phone')?.touched ? 'Phone number is required' : ''" placeholder="+1-555-0123" />
                  <ui-text-input label="Email Address *" [value]="customerForm.get('email')?.value" (valueChange)="customerForm.get('email')?.setValue($event)" [error]="customerForm.get('email')?.invalid && customerForm.get('email')?.touched ? 'Valid email is required' : ''" placeholder="contact@company.com" type="email" />
                </div>
              </ui-section>

              <!-- Address Information -->
              <ui-section>
                <div class="space-y-4">
                  <ui-text-input label="Street Address *" [value]="customerForm.get('street')?.value" (valueChange)="customerForm.get('street')?.setValue($event)" [error]="customerForm.get('street')?.invalid && customerForm.get('street')?.touched ? 'Street address is required' : ''" placeholder="123 Business Street" />
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ui-text-input label="City *" [value]="customerForm.get('city')?.value" (valueChange)="customerForm.get('city')?.setValue($event)" [error]="customerForm.get('city')?.invalid && customerForm.get('city')?.touched ? 'City is required' : ''" placeholder="City" />
                    <ui-text-input label="State/Province *" [value]="customerForm.get('state')?.value" (valueChange)="customerForm.get('state')?.setValue($event)" [error]="customerForm.get('state')?.invalid && customerForm.get('state')?.touched ? 'State is required' : ''" placeholder="State" />
                    <ui-text-input label="Postal Code *" [value]="customerForm.get('postalCode')?.value" (valueChange)="customerForm.get('postalCode')?.setValue($event)" [error]="customerForm.get('postalCode')?.invalid && customerForm.get('postalCode')?.touched ? 'Postal code is required' : ''" placeholder="12345" />
                  </div>
                </div>
              </ui-section>

              <!-- Tax Information -->
              <ui-section>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ui-text-input label="Tax ID" [value]="customerForm.get('taxId')?.value" (valueChange)="customerForm.get('taxId')?.setValue($event)" placeholder="TAX-123-456" />
                  <ui-text-input label="Tax Number" [value]="customerForm.get('taxNumber')?.value" (valueChange)="customerForm.get('taxNumber')?.setValue($event)" placeholder="12-3456789" />
                </div>
              </ui-section>

              <!-- Billing Information -->
              <ui-section>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ui-dropdown label="Payment Terms" [options]="paymentTermOptions" [value]="customerForm.get('paymentTerms')?.value" (valueChange)="customerForm.get('paymentTerms')?.setValue($event)" />
                  <ui-text-input label="Credit Limit ($)" [value]="customerForm.get('creditLimit')?.value" (valueChange)="customerForm.get('creditLimit')?.setValue($event)" type="number" placeholder="5000" />
                </div>
              </ui-section>
              
              <!-- Notes -->
              <ui-section>
                <textarea id="notes" formControlName="notes" rows="4" class="input w-full" placeholder="Any additional notes about the customer..."></textarea>
              </ui-section>
            </div>
            
            <div class="flex items-center justify-end p-6 border-t border-gray-200 dark:border-dark-700 mt-6">
              <button type="button" (click)="closeModal()" class="btn btn-secondary mr-4">Cancel</button>
              <button type="submit" [disabled]="customerForm.invalid || submitting" class="btn btn-primary">
                @if (submitting) {
                  <span>Saving...</span>
                } @else {
                  <span>Save Customer</span>
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class CustomersComponent implements OnInit {
  private customersService = inject(CustomersService);
  private filtersService = inject(CustomersListingFiltersService);
  private notificationService = inject(NotificationService);
  private formBuilder = inject(FormBuilder);

  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  showAddCustomerModal = false;
  submitting = false;
  customerForm: FormGroup;

  // Lucide icons
  PlusIcon = Plus;
  XIcon = X;
  UserMinusIcon = UserMinus;

  countryOptions = [
    { value: '', label: 'Select country' },
    { value: 'USA', label: 'United States' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Mexico', label: 'Mexico' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'Germany', label: 'Germany' },
    { value: 'France', label: 'France' }
  ];
  paymentTermOptions = [
    { value: 'Net 30', label: 'Net 30' },
    { value: 'Net 60', label: 'Net 60' },
    { value: 'Net 90', label: 'Net 90' }
  ];

  constructor() {
    this.customerForm = this.formBuilder.group({
      companyName: ['', Validators.required],
      countryOfOrigin: ['', Validators.required],
      contactPerson: ['', Validators.required],
      contactTitle: [''],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      taxId: [''],
      taxNumber: [''],
      paymentTerms: ['Net 30'],
      creditLimit: [5000],
      notes: ['']
    });

    effect(() => {
      this.applyFilters();
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customersService.getCustomers().subscribe(data => {
      this.customers = data;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    const searchTerm = this.filtersService.searchTerm().toLowerCase();
    const status = this.filtersService.status();

    this.filteredCustomers = this.customers.filter(customer => {
      const matchesSearchTerm = (
        customer.companyName.toLowerCase().includes(searchTerm) ||
        customer.contactPerson.toLowerCase().includes(searchTerm) ||
        customer.phone.includes(searchTerm)
      );
      const matchesStatus = status ? customer.status === status : true;

      return matchesSearchTerm && matchesStatus;
    });
  }

  deactivateCustomer(customer: Customer): void {
    // In a real app, you'd call a service to update the customer status
    customer.status = 'inactive';
    this.notificationService.showWarning(
      'Customer Deactivated',
      `Customer ${customer.companyName} has been deactivated.`
    );
    this.applyFilters(); // Re-apply filters to update the view
  }

  closeModal(): void {
    this.showAddCustomerModal = false;
    this.customerForm.reset();
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      return;
    }

    this.submitting = true;

    // In a real app, you'd send this data to a server
    setTimeout(() => {
      const newCustomer: Customer = {
        id: `CUS-${Math.floor(Math.random() * 10000)}`,
        ...this.customerForm.value,
        status: 'active',
        memberSince: new Date().toISOString().split('T')[0],
        lastActivity: new Date().toISOString()
      };
      
      this.customers = [...this.customers, newCustomer];
      this.applyFilters();
      
      this.submitting = false;
      this.closeModal();
      
      this.notificationService.showSuccess(
        'Customer added successfully!',
        `${this.customerForm.value.companyName} has been created.`
      );
    }, 1500);
  }
}