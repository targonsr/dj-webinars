import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DeliveryFormStepOneComponent } from './components/delivery-form-step-one.component';
import { DeliveryFormStepTwoComponent } from './components/delivery-form-step-two.component';
import { DeliveryFormStepThreeComponent } from './components/delivery-form-step-three.component';
import { DeliveryFormStepFourComponent } from './components/delivery-form-step-four.component';

@Component({
  selector: 'app-delivery-process',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    DeliveryFormStepOneComponent,
    DeliveryFormStepTwoComponent,
    DeliveryFormStepThreeComponent,
    DeliveryFormStepFourComponent
  ],
  template: `
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-8 text-center">Schedule Your Delivery</h1>

        <!-- Progress Tracker -->
        <div class="mb-10">
          <div class="flex items-center justify-between">
            @for (step of steps; track step.id; let i = $index) {
              <div class="flex flex-col items-center">
                <div 
                  class="w-10 h-10 rounded-full flex items-center justify-center text-sm" 
                  [class]="getStepIndicatorClass(i)">
                  @if (currentStep > i) {
                    <span class="material-icons text-lg">check</span>
                  } @else {
                    {{ i + 1 }}
                  }
                </div>
                <div class="text-xs mt-2 text-center">{{ step.label }}</div>
              </div>

              @if (i < steps.length - 1) {
                <div 
                  class="flex-1 h-1 mx-2"
                  [class]="currentStep > i ? 'bg-primary-500' : 'bg-neutral-200'">
                </div>
              }
            }
          </div>
        </div>

        <!-- Form Container -->
        <div class="bg-white shadow-lg rounded-lg p-6 md:p-8 mb-8 animate-fade-in">
          <!-- Dynamic Step Content -->
          @switch (currentStep) {
            @case (0) {
              <app-delivery-form-step-one
                [formGroup]="deliveryForm"
                (goToNext)="nextStep()">
              </app-delivery-form-step-one>
            }
            @case (1) {
              <app-delivery-form-step-two
                [formGroup]="deliveryForm"
                (goToNext)="nextStep()"
                (goBack)="prevStep()">
              </app-delivery-form-step-two>
            }
            @case (2) {
              <app-delivery-form-step-three
                [formGroup]="deliveryForm"
                (goToNext)="nextStep()"
                (goBack)="prevStep()">
              </app-delivery-form-step-three>
            }
            @case (3) {
              <app-delivery-form-step-four
                [formGroup]="deliveryForm"
                (submitForm)="submitDelivery()"
                (goBack)="prevStep()">
              </app-delivery-form-step-four>
            }
          }
        </div>

        @if (formSubmitted) {
          <div class="bg-success-50 border border-success-200 text-success-700 px-4 py-5 rounded-lg text-center animate-fade-in">
            <span class="material-icons text-success-500 text-4xl">check_circle</span>
            <h3 class="text-xl font-semibold mt-2 mb-1">Delivery Scheduled Successfully!</h3>
            <p class="mb-4">Your delivery has been scheduled. We'll contact you with further details.</p>
            <p class="text-sm mb-2">Order reference: <span class="font-medium">DEL-39284</span></p>
            <div class="mt-6">
              <a routerLink="/" class="btn btn-primary">Return to Home</a>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class DeliveryProcessComponent {
  private fb = inject(FormBuilder);

  steps = [
    { id: 'pickup', label: 'Pickup Details' },
    { id: 'delivery', label: 'Delivery Details' },
    { id: 'package', label: 'Package Info' },
    { id: 'confirm', label: 'Review & Confirm' }
  ];

  currentStep = 0;
  formSubmitted = false;

  // Create a form group with all the fields needed across all steps
  deliveryForm: FormGroup = this.fb.group({
    // Step 1: Pickup Details
    pickupName: ['', Validators.required],
    pickupEmail: ['', [Validators.required, Validators.email]],
    pickupPhone: ['', Validators.required],
    pickupAddress: ['', Validators.required],
    pickupCity: ['', Validators.required],
    pickupState: ['', Validators.required],
    pickupZip: ['', Validators.required],
    pickupDate: [null, Validators.required],
    pickupTimeWindow: ['9-12', Validators.required],
    
    // Step 2: Delivery Details
    recipientName: ['', Validators.required],
    recipientEmail: ['', [Validators.required, Validators.email]],
    recipientPhone: ['', Validators.required],
    deliveryAddress: ['', Validators.required],
    deliveryCity: ['', Validators.required],
    deliveryState: ['', Validators.required],
    deliveryZip: ['', Validators.required],
    deliveryInstructions: [''],
    
    // Step 3: Package Info
    packageType: ['standard', Validators.required],
    packageWeight: [null, [Validators.required, Validators.min(0.1)]],
    packageDimensions: this.fb.group({
      length: [null, [Validators.required, Validators.min(1)]],
      width: [null, [Validators.required, Validators.min(1)]],
      height: [null, [Validators.required, Validators.min(1)]]
    }),
    packageContents: ['', Validators.required],
    isFragile: [false],
    requiresRefrigeration: [false],
    
    // Step 4: Additional
    serviceLevel: ['standard', Validators.required],
    insurance: [false],
    agreeToTerms: [false, Validators.requiredTrue]
  });

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.scrollToTop();
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.scrollToTop();
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getStepIndicatorClass(index: number): string {
    if (this.currentStep > index) {
      return 'bg-primary-500 text-white';
    } else if (this.currentStep === index) {
      return 'bg-primary-500 text-white';
    } else {
      return 'bg-neutral-200 text-neutral-700';
    }
  }

  submitDelivery() {
    if (this.deliveryForm.valid) {
      // Simulate API call
      setTimeout(() => {
        this.formSubmitted = true;
        this.scrollToTop();
      }, 1500);
    } else {
      this.deliveryForm.markAllAsTouched();
    }
  }
}