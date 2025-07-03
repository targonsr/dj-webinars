import { mockCreditInfo, mockInvoices, mockPaymentMethods } from '~/model/billing/billing.mocks'
import type { Invoice, PaymentMethod, CreditInfo } from '~/model/billing'

export const billingApi = {
  async getCreditInfo(): Promise<CreditInfo> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockCreditInfo
  },

  async getInvoices(): Promise<Invoice[]> {
    await new Promise(resolve => setTimeout(resolve, 600))
    return mockInvoices
  },

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    await new Promise(resolve => setTimeout(resolve, 400))
    return mockPaymentMethods
  },

  async downloadInvoice(invoiceId: string) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log(`Downloading invoice: ${invoiceId}`)
  },

  async payInvoice(invoiceId: string) {
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log(`Processing payment for invoice: ${invoiceId}`)
  }
}