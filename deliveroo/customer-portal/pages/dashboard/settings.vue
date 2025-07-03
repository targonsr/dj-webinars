<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Manage your account and company settings
      </p>
    </div>

    <!-- Tab Navigation -->
    <div class="border-b border-gray-200 dark:border-gray-700 mb-8">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            activeTab === tab.id
              ? 'border-success-500 text-success-600 dark:text-success-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors'
          ]"
        >
          <component :is="tab.icon" class="w-5 h-5 mr-2 inline" />
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="space-y-8">
      <!-- Company Information Tab -->
      <div v-show="activeTab === 'company'" class="card p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Company Information
        </h2>
        
        <form @submit.prevent="updateCompanyInfo" class="space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Company Name *
              </label>
              <input
                v-model="companyForm.name"
                type="text"
                required
                class="input"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Registration Number *
              </label>
              <input
                v-model="companyForm.registrationNumber"
                type="text"
                required
                class="input"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                VAT Number
              </label>
              <input
                v-model="companyForm.vatNumber"
                type="text"
                class="input"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Industry Type
              </label>
              <select
                v-model="companyForm.industryType"
                class="input"
              >
                <option value="Manufacturing">Manufacturing</option>
                <option value="Retail">Retail</option>
                <option value="Automotive">Automotive</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div>
            <h3 class="text-md font-medium text-gray-900 dark:text-white mb-4">
              Company Address
            </h3>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Street Address *
                </label>
                <input
                  v-model="companyForm.address.street"
                  type="text"
                  required
                  class="input"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  City *
                </label>
                <input
                  v-model="companyForm.address.city"
                  type="text"
                  required
                  class="input"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Postal Code *
                </label>
                <input
                  v-model="companyForm.address.postalCode"
                  type="text"
                  required
                  class="input"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Country *
                </label>
                <select
                  v-model="companyForm.address.country"
                  required
                  class="input"
                >
                  <option value="Poland">Poland</option>
                  <option value="Germany">Germany</option>
                  <option value="Czech Republic">Czech Republic</option>
                  <option value="Slovakia">Slovakia</option>
                  <option value="Hungary">Hungary</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end">
            <button
              type="submit"
              class="btn-primary"
            >
              Save Company Information
            </button>
          </div>
        </form>
      </div>

      <!-- Contact Information Tab -->
      <div v-show="activeTab === 'contact'" class="card p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Contact Information
        </h2>
        
        <form @submit.prevent="updateContactInfo" class="space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Primary Email *
              </label>
              <input
                v-model="contactForm.primaryEmail"
                type="email"
                required
                class="input"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Primary Phone *
              </label>
              <input
                v-model="contactForm.primaryPhone"
                type="tel"
                required
                class="input"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Website
              </label>
              <input
                v-model="contactForm.website"
                type="url"
                class="input"
                placeholder="https://example.com"
              />
            </div>
          </div>
          
          <div>
            <h3 class="text-md font-medium text-gray-900 dark:text-white mb-4">
              Emergency Contact
            </h3>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact Name *
                </label>
                <input
                  v-model="contactForm.emergencyContact.name"
                  type="text"
                  required
                  class="input"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact Phone *
                </label>
                <input
                  v-model="contactForm.emergencyContact.phone"
                  type="tel"
                  required
                  class="input"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact Email
                </label>
                <input
                  v-model="contactForm.emergencyContact.email"
                  type="email"
                  class="input"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Relationship
                </label>
                <input
                  v-model="contactForm.emergencyContact.relationship"
                  type="text"
                  class="input"
                  placeholder="e.g., Manager, Director"
                />
              </div>
            </div>
          </div>
          
          <div class="flex justify-end">
            <button
              type="submit"
              class="btn-primary"
            >
              Save Contact Information
            </button>
          </div>
        </form>
      </div>

      <!-- Notification Preferences Tab -->
      <div v-show="activeTab === 'notifications'" class="card p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Notification Preferences
        </h2>
        
        <form @submit.prevent="updateNotificationPreferences" class="space-y-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                  Email Notifications
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Receive updates about your shipments and requests
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="notificationForm.emailNotifications"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-success-300 dark:peer-focus:ring-success-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-success-600"></div>
              </label>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                  SMS Notifications
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Receive critical updates via SMS
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="notificationForm.smsNotifications"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-success-300 dark:peer-focus:ring-success-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-success-600"></div>
              </label>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                  Marketing Communications
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Receive newsletters and promotional offers
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="notificationForm.marketingCommunications"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-success-300 dark:peer-focus:ring-success-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-success-600"></div>
              </label>
            </div>
          </div>
          
          <div class="flex justify-end">
            <button
              type="submit"
              class="btn-primary"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>

      <!-- Security Settings Tab -->
      <div v-show="activeTab === 'security'" class="card p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Security Settings
        </h2>
        
        <div class="space-y-6">
          <div>
            <h3 class="text-md font-medium text-gray-900 dark:text-white mb-4">
              Change Password
            </h3>
            <form @submit.prevent="changePassword" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Password
                </label>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  required
                  class="input"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  required
                  class="input"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm New Password
                </label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  required
                  class="input"
                />
              </div>
              
              <div class="flex justify-end">
                <button
                  type="submit"
                  class="btn-primary"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
          
          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 class="text-md font-medium text-gray-900 dark:text-white mb-4">
              Two-Factor Authentication
            </h3>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button class="btn-outline">
                Enable 2FA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BuildingOfficeIcon,
  PhoneIcon,
  BellIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'

const activeTab = ref('company')

const tabs = [
  { id: 'company', name: 'Company Information', icon: BuildingOfficeIcon },
  { id: 'contact', name: 'Contact Information', icon: PhoneIcon },
  { id: 'notifications', name: 'Notifications', icon: BellIcon },
  { id: 'security', name: 'Security', icon: ShieldCheckIcon }
]

const companyForm = reactive({
  name: 'Example Logistics Ltd.',
  registrationNumber: 'PL1234567890',
  vatNumber: 'PL1234567890',
  industryType: 'Manufacturing',
  address: {
    street: 'ul. Logistyczna 123',
    city: 'Warsaw',
    postalCode: '00-001',
    country: 'Poland'
  }
})

const contactForm = reactive({
  primaryEmail: 'contact@example.com',
  primaryPhone: '+48123456789',
  website: 'https://example.com',
  emergencyContact: {
    name: 'Emergency Contact',
    phone: '+48987654321',
    email: 'emergency@example.com',
    relationship: 'Manager'
  }
})

const notificationForm = reactive({
  emailNotifications: true,
  smsNotifications: false,
  marketingCommunications: true
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const updateCompanyInfo = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Company information updated')
  } catch (error) {
    console.error('Failed to update company information:', error)
  }
}

const updateContactInfo = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Contact information updated')
  } catch (error) {
    console.error('Failed to update contact information:', error)
  }
}

const updateNotificationPreferences = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Notification preferences updated')
  } catch (error) {
    console.error('Failed to update notification preferences:', error)
  }
}

const changePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    alert('New passwords do not match')
    return
  }
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Reset form
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    
    console.log('Password changed successfully')
  } catch (error) {
    console.error('Failed to change password:', error)
  }
}

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>