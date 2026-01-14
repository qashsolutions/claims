import { env } from '../../config/env.js'
import type { EpicTokens } from '@claimscrub/shared/types'

export interface FhirPatient {
  id: string
  mrn: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  phone?: string
  email?: string
  address?: {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
  }
}

export interface FhirCondition {
  code: string
  display: string
  status: 'active' | 'resolved' | 'inactive'
  onsetDate?: string
}

export interface FhirCoverage {
  payerId: string
  payerName: string
  memberId: string
  groupNumber?: string
  planType: string
  status: 'active' | 'cancelled'
}

export interface FhirAuthorization {
  number: string
  status: 'approved' | 'pending' | 'denied'
  validFrom: string
  validTo: string
  services: string[]
}

class EpicClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = env.EPIC_FHIR_BASE_URL || ''
  }

  private async fetch<T>(
    endpoint: string,
    tokens: EpicTokens,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        Accept: 'application/fhir+json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Epic FHIR error: ${response.status}`)
    }

    return response.json()
  }

  async getPatient(patientId: string, tokens: EpicTokens): Promise<FhirPatient> {
    const fhirPatient = await this.fetch<{
      id: string
      identifier?: Array<{ system?: string; value: string }>
      name?: Array<{ given?: string[]; family?: string }>
      birthDate?: string
      gender?: string
      telecom?: Array<{ system: string; value: string }>
      address?: Array<{
        line?: string[]
        city?: string
        state?: string
        postalCode?: string
      }>
    }>(`/Patient/${patientId}`, tokens)

    // Transform FHIR to our format
    const mrn = fhirPatient.identifier?.find(
      (id) => id.system?.includes('mrn')
    )?.value || ''

    const name = fhirPatient.name?.[0]
    const phone = fhirPatient.telecom?.find((t) => t.system === 'phone')?.value
    const email = fhirPatient.telecom?.find((t) => t.system === 'email')?.value
    const addr = fhirPatient.address?.[0]

    return {
      id: fhirPatient.id,
      mrn,
      firstName: name?.given?.join(' ') || '',
      lastName: name?.family || '',
      dateOfBirth: fhirPatient.birthDate || '',
      gender: fhirPatient.gender || '',
      phone,
      email,
      address: addr
        ? {
            line1: addr.line?.[0] || '',
            line2: addr.line?.[1],
            city: addr.city || '',
            state: addr.state || '',
            postalCode: addr.postalCode || '',
          }
        : undefined,
    }
  }

  async searchPatients(
    query: string,
    tokens: EpicTokens,
    limit = 10
  ): Promise<FhirPatient[]> {
    const bundle = await this.fetch<{
      entry?: Array<{ resource: unknown }>
    }>(`/Patient?name=${encodeURIComponent(query)}&_count=${limit}`, tokens)

    const patients: FhirPatient[] = []
    for (const entry of bundle.entry || []) {
      // Transform each patient
      const resource = entry.resource as { id: string }
      const patient = await this.getPatient(resource.id, tokens)
      patients.push(patient)
    }

    return patients
  }

  async getConditions(
    patientId: string,
    tokens: EpicTokens
  ): Promise<FhirCondition[]> {
    const bundle = await this.fetch<{
      entry?: Array<{
        resource: {
          code?: { coding?: Array<{ code: string; display: string }> }
          clinicalStatus?: { coding?: Array<{ code: string }> }
          onsetDateTime?: string
        }
      }>
    }>(`/Condition?patient=${patientId}&clinical-status=active`, tokens)

    return (bundle.entry || []).map((entry) => {
      const coding = entry.resource.code?.coding?.[0]
      const status = entry.resource.clinicalStatus?.coding?.[0]?.code

      return {
        code: coding?.code || '',
        display: coding?.display || '',
        status: (status as 'active' | 'resolved' | 'inactive') || 'active',
        onsetDate: entry.resource.onsetDateTime,
      }
    })
  }

  async getCoverage(
    patientId: string,
    tokens: EpicTokens
  ): Promise<FhirCoverage[]> {
    const bundle = await this.fetch<{
      entry?: Array<{
        resource: {
          payor?: Array<{ display: string; identifier?: { value: string } }>
          subscriberId?: string
          class?: Array<{ type: { coding: Array<{ code: string }> }; value: string }>
          type?: { coding?: Array<{ display: string }> }
          status?: string
        }
      }>
    }>(`/Coverage?patient=${patientId}&status=active`, tokens)

    return (bundle.entry || []).map((entry) => {
      const payor = entry.resource.payor?.[0]
      const groupClass = entry.resource.class?.find(
        (c) => c.type.coding[0]?.code === 'group'
      )

      return {
        payerId: payor?.identifier?.value || '',
        payerName: payor?.display || '',
        memberId: entry.resource.subscriberId || '',
        groupNumber: groupClass?.value,
        planType: entry.resource.type?.coding?.[0]?.display || '',
        status: (entry.resource.status as 'active' | 'cancelled') || 'active',
      }
    })
  }

  async getAuthorizations(
    patientId: string,
    tokens: EpicTokens,
    cptCode?: string
  ): Promise<FhirAuthorization[]> {
    let url = `/ClaimResponse?patient=${patientId}&status=active`
    if (cptCode) {
      url += `&service=${cptCode}`
    }

    const bundle = await this.fetch<{
      entry?: Array<{
        resource: {
          identifier?: Array<{ value: string }>
          outcome?: string
          created?: string
          preAuthPeriod?: { start: string; end: string }
          item?: Array<{ productOrService?: { coding: Array<{ code: string }> } }>
        }
      }>
    }>(url, tokens)

    return (bundle.entry || []).map((entry) => ({
      number: entry.resource.identifier?.[0]?.value || '',
      status: entry.resource.outcome === 'complete' ? 'approved' : 'pending',
      validFrom: entry.resource.preAuthPeriod?.start || '',
      validTo: entry.resource.preAuthPeriod?.end || '',
      services:
        entry.resource.item?.map(
          (i) => i.productOrService?.coding[0]?.code || ''
        ) || [],
    }))
  }

  async exchangeCode(code: string): Promise<EpicTokens> {
    const response = await fetch(`${env.EPIC_SANDBOX_URL}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: env.EPIC_REDIRECT_URI || '',
        client_id: env.EPIC_CLIENT_ID || '',
        client_secret: env.EPIC_CLIENT_SECRET || '',
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to exchange code for tokens')
    }

    const data = await response.json()

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      scope: data.scope || '',
      patientId: data.patient,
    }
  }
}

export const epicClient = new EpicClient()
