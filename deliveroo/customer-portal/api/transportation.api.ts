export const transportationApi = {
  async createTransportationRequest(data: any) {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const requestNumber = `TR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    
    return {
      id: requestNumber,
      requestNumber,
      ...data,
      status: 'SUBMITTED',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
}