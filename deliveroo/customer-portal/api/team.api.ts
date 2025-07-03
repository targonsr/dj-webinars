import { mockTeamMembers, mockAvailablePermissions } from '~/model/team/team.mocks'
import type { User } from '~/model/user'
import type { InviteForm, AvailablePermission } from '~/model/team'

export const teamApi = {
  async getTeamMembers(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 600))
    return mockTeamMembers
  },

  async getAvailablePermissions(): Promise<AvailablePermission[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockAvailablePermissions
  },

  async inviteTeamMember(inviteData: InviteForm) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Sending invitation to:', inviteData.email)
    return {
      success: true,
      message: 'Invitation sent successfully'
    }
  },

  async removeTeamMember(memberId: string) {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    console.log('Removing team member:', memberId)
    return {
      success: true,
      message: 'Team member removed successfully'
    }
  }
}