import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'

// Define your store state
export interface State {
  currentStep: number
  formData: {
    cargo: {
      description: string
      duration: string
      warehouse: string
    }
    customer: {
      companyName: string
      contactPerson: string
      email: string
      phone: string
    }
    termsAccepted: boolean
  }
  requestSubmitted: boolean
  referenceNumber: string
}

// Define injection key
export const key: InjectionKey<Store<State>> = Symbol()

// Create a store configuration
export const storeConfig = {
  state: (): State => ({
    currentStep: 1,
    formData: {
      cargo: {
        description: '',
        duration: '6 months',
        warehouse: 'Warehouse A'
      },
      customer: {
        companyName: '',
        contactPerson: '',
        email: '',
        phone: ''
      },
      termsAccepted: false
    },
    requestSubmitted: false,
    referenceNumber: ''
  }),
  mutations: {
    setCurrentStep(state: State, step: number) {
      state.currentStep = step
    },
    updateCargoData(state: State, payload: { field: string, value: string }) {
      state.formData.cargo[payload.field as keyof typeof state.formData.cargo] = payload.value
    },
    updateCustomerData(state: State, payload: { field: string, value: string }) {
      state.formData.customer[payload.field as keyof typeof state.formData.customer] = payload.value
    },
    setTermsAccepted(state: State, value: boolean) {
      state.formData.termsAccepted = value
    },
    submitRequest(state: State) {
      state.requestSubmitted = true
      state.referenceNumber = 'SR-' + Math.floor(100000 + Math.random() * 900000).toString()
    },
    resetForm(state: State) {
      state.currentStep = 1
      state.formData = {
        cargo: {
          description: '',
          duration: '6 months',
          warehouse: 'Warehouse A'
        },
        customer: {
          companyName: '',
          contactPerson: '',
          email: '',
          phone: ''
        },
        termsAccepted: false
      }
      state.requestSubmitted = false
      state.referenceNumber = ''
    }
  },
  actions: {
    nextStep({ commit, state }: { commit: any, state: State }) {
      if (state.currentStep < 3) {
        commit('setCurrentStep', state.currentStep + 1)
      }
    },
    prevStep({ commit, state }: { commit: any, state: State }) {
      if (state.currentStep > 1) {
        commit('setCurrentStep', state.currentStep - 1)
      }
    },
    goToStep({ commit }: { commit: any }, step: number) {
      commit('setCurrentStep', step)
    },
    submitForm({ commit }: { commit: any }) {
      // Here you would normally send data to a server
      // For this example, we'll just simulate a successful submission
      commit('submitRequest')
    }
  },
  getters: {
    isStepComplete: (state: State) => (step: number) => {
      if (step === 1) {
        return !!state.formData.cargo.description && 
               !!state.formData.cargo.duration && 
               !!state.formData.cargo.warehouse
      } else if (step === 2) {
        return !!state.formData.customer.companyName && 
               !!state.formData.customer.contactPerson && 
               !!state.formData.customer.email && 
               !!state.formData.customer.phone
      } else if (step === 3) {
        return state.formData.termsAccepted
      }
      return false
    },
    canProceedToNextStep: (state: State, getters: any) => {
      return getters.isStepComplete(state.currentStep)
    }
  }
}

// Define your own `useStore` composition function
export function useStore() {
  return baseUseStore(key)
}