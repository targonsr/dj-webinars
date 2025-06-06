<template>
  <div class="container">
    <div class="card main-card">
      <div class="card-body slide-up">
        <h1>Customer Storage Request</h1>
        
        <!-- Progress Stepper -->
        <div class="stepper">
          <div 
            v-for="step in 3" 
            :key="step"
            :class="['stepper-step', { 
              'active': currentStep === step,
              'completed': currentStep > step 
            }]"
            @click="goToStep(step)"
          >
            <div class="step-circle">{{ step }}</div>
            <div class="step-name">{{ stepNames[step - 1] }}</div>
          </div>
          <div class="stepper-line"></div>
        </div>

        <!-- Form Steps Container -->
        <div class="form-container fade-in">
          <CargoDetails v-if="currentStep === 1" />
          <CustomerInfo v-if="currentStep === 2" />
          <ReviewConfirm v-if="currentStep === 3" />
          <SubmissionComplete v-if="requestSubmitted" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from './store';
import CargoDetails from './components/CargoDetails.vue';
import CustomerInfo from './components/CustomerInfo.vue';
import ReviewConfirm from './components/ReviewConfirm.vue';
import SubmissionComplete from './components/SubmissionComplete.vue';

const store = useStore();

const stepNames = ['Cargo Details', 'Customer Info', 'Review & Submit'];
const currentStep = computed(() => store.state.currentStep);
const requestSubmitted = computed(() => store.state.requestSubmitted);

function goToStep(step: number) {
  // Only allow going to completed steps or the next step
  if (step < currentStep.value || 
     (step === currentStep.value + 1 && store.getters.isStepComplete(currentStep.value))) {
    store.dispatch('goToStep', step);
  }
}
</script>

<style scoped>
.main-card {
  width: 100%;
  max-width: 800px;
  margin: 2rem auto;
}

.stepper {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: 3rem;
}

.stepper-line {
  position: absolute;
  top: 1rem;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--color-border);
  z-index: 1;
}

.stepper-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  width: 33.333%;
  cursor: pointer;
}

.step-circle {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: white;
  border: 2px solid var(--color-border);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--color-text-light);
  transition: all 0.3s ease;
}

.step-name {
  font-size: 0.875rem;
  color: var(--color-text-light);
  transition: all 0.3s ease;
}

.stepper-step.active .step-circle {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.stepper-step.active .step-name {
  color: var(--color-primary);
  font-weight: 500;
}

.stepper-step.completed .step-circle {
  background-color: var(--color-secondary);
  border-color: var(--color-secondary);
  color: white;
}

.form-container {
  min-height: 400px;
}

@media (max-width: 640px) {
  .stepper-step .step-name {
    font-size: 0.75rem;
  }
}
</style>