import { Profile, MaskedProfile, User, UserRole } from '@/types/app.types'
import { maskName, maskClientName } from './utils'

export class MaskingService {
  static shouldMaskProfile(
    profile: Profile,
    viewerUser: User | null,
    viewerRole: UserRole | null
  ): boolean {
    // Giriş yapmamış kullanıcı (public)
    if (!viewerUser || !viewerRole) {
      return true
    }

    // Owner her şeyi tam görür
    if (viewerRole === 'owner') {
      return false
    }

    // Partner kendi organizasyonunun profillerini tam görür
    if (viewerRole === 'partner_admin' || viewerRole === 'partner_user') {
      return profile.organization_id !== viewerUser.organization_id
    }

    return true
  }

  static maskProfile(profile: Profile): MaskedProfile {
    const displayName = maskName(profile.first_name, profile.last_name)
    
    // Tag'leri string array'e çevir
    const tags = profile.tags?.map(tag => tag.key) || []

    return {
      id: profile.id,
      display_name: displayName,
      title: profile.title,
      seniority_years: profile.seniority_years,
      work_scope: profile.work_scope,
      summary: profile.summary,
      tags,
      score: profile.score,
      created_at: profile.created_at,
      updated_at: profile.updated_at
    }
  }

  static maskExperience(experience: any, shouldMask: boolean) {
    if (!shouldMask) {
      return experience
    }

    return {
      ...experience,
      client_name: experience.client_name 
        ? maskClientName(experience.client_name)
        : null
    }
  }

  static applyVisibilityRules(
    profiles: Profile[],
    viewerUser: User | null,
    viewerRole: UserRole | null
  ): (Profile | MaskedProfile)[] {
    return profiles.map(profile => {
      const shouldMask = this.shouldMaskProfile(profile, viewerUser, viewerRole)
      
      if (shouldMask) {
        return this.maskProfile(profile)
      }

      return profile
    })
  }

  static canViewFullProfile(
    profile: Profile,
    viewerUser: User | null,
    viewerRole: UserRole | null
  ): boolean {
    return !this.shouldMaskProfile(profile, viewerUser, viewerRole)
  }

  static canEditProfile(
    profile: Profile,
    viewerUser: User | null,
    viewerRole: UserRole | null
  ): boolean {
    if (!viewerUser || !viewerRole) {
      return false
    }

    // Owner her şeyi düzenleyebilir
    if (viewerRole === 'owner') {
      return true
    }

    // Partner sadece kendi organizasyonunun profillerini düzenleyebilir
    if (viewerRole === 'partner_admin') {
      return profile.organization_id === viewerUser.organization_id
    }

    // Partner user sadece kendi profilini düzenleyebilir (eğer varsa)
    if (viewerRole === 'partner_user') {
      // Bu durumda profile'ın hangi user'a ait olduğunu bilmemiz gerekir
      // Şimdilik false döndürüyoruz, sonra user_id field'ı eklenebilir
      return false
    }

    return false
  }

  static canDeleteProfile(
    profile: Profile,
    viewerUser: User | null,
    viewerRole: UserRole | null
  ): boolean {
    // Silme yetkileri düzenleme yetkileri ile aynı
    return this.canEditProfile(profile, viewerUser, viewerRole)
  }

  static canManagePartners(viewerRole: UserRole | null): boolean {
    return viewerRole === 'owner'
  }

  static canManageTags(viewerRole: UserRole | null): boolean {
    return viewerRole === 'owner'
  }

  static canViewContactRequests(viewerRole: UserRole | null): boolean {
    return viewerRole === 'owner'
  }

  static canHandleContactRequests(viewerRole: UserRole | null): boolean {
    return viewerRole === 'owner'
  }
}
