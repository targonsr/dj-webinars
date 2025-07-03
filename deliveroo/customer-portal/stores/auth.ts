import { defineStore } from 'pinia'
import { userApi } from '~/api/user.api'
import type { User, Company } from '~/model'

interface AuthState {
  user: User | null
  company: Company | null
  isAuthenticated: boolean
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    company: null,
    isAuthenticated: false,
    loading: false
  }),

  getters: {
    userRole: (state) => state.user?.role,
    hasPermission: (state) => (permission: string) => {
      return state.user?.permissions.includes(permission as any) || false
    },
    isCompanyAdmin: (state) => state.user?.role === 'COMPANY_ADMIN',
    isEmployee: (state) => state.user?.role === 'EMPLOYEE'
  },

  actions: {
    async login(credentials: { email: string; password: string }) {
      this.loading = true
      try {
        const { user, company } = await userApi.login(credentials)
        
        this.user = user
        this.company = company
        this.isAuthenticated = true
        
        // Save to localStorage only on client side
        if (process.client) {
          localStorage.setItem('auth_user', JSON.stringify(this.user))
          localStorage.setItem('auth_company', JSON.stringify(this.company))
          localStorage.setItem('auth_isAuthenticated', 'true')
        }
        
        // Redirect to dashboard
        await navigateTo('/dashboard')
      } catch (error) {
        throw new Error('Invalid credentials')
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.user = null
      this.company = null
      this.isAuthenticated = false
      
      // Clear localStorage only on client side
      if (process.client) {
        localStorage.removeItem('auth_user')
        localStorage.removeItem('auth_company')
        localStorage.removeItem('auth_isAuthenticated')
      }
      
      await navigateTo('/')
    },

    async register(data: any) {
      this.loading = true
      try {
        const { user, company } = await userApi.register(data)
        
        this.user = user
        this.company = company
        this.isAuthenticated = true
        
        // Save to localStorage only on client side
        if (process.client) {
          localStorage.setItem('auth_user', JSON.stringify(this.user))
          localStorage.setItem('auth_company', JSON.stringify(this.company))
          localStorage.setItem('auth_isAuthenticated', 'true')
        }
      } catch (error) {
        throw new Error('Registration failed')
      } finally {
        this.loading = false
      }
    },

    // Initialize auth state from localStorage (client-side only)
    initializeAuth() {
      if (process.client) {
        try {
          const storedUser = localStorage.getItem('auth_user')
          const storedCompany = localStorage.getItem('auth_company')
          const storedAuth = localStorage.getItem('auth_isAuthenticated')
          
          if (storedUser && storedCompany && storedAuth === 'true') {
            this.user = JSON.parse(storedUser)
            this.company = JSON.parse(storedCompany)
            this.isAuthenticated = true
          }
        } catch (error) {
          console.error('Error loading auth from localStorage:', error)
          // Clear corrupted data
          localStorage.removeItem('auth_user')
          localStorage.removeItem('auth_company')
          localStorage.removeItem('auth_isAuthenticated')
        }
      }
    }
  }
})