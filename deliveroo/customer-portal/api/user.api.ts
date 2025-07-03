import { mockUser, mockCompany } from '~/model/user/user.mocks'

export const userApi = {
  async login(credentials: { email: string; password: string }) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock authentication logic
    if (credentials.email && credentials.password) {
      return {
        user: mockUser,
        company: mockCompany
      }
    }
    
    throw new Error('Invalid credentials')
  },

  async register(data: any) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock registration logic
    return {
      user: {
        ...mockUser,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone
      },
      company: {
        ...mockCompany,
        name: data.companyName,
        registrationNumber: data.registrationNumber,
        vatNumber: data.vatNumber,
        address: data.address,
        industryType: data.industryType
      }
    }
  },

  async getCurrentUser() {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockUser
  }
}