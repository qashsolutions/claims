export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).format(d)
}

export const formatDateLong = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export const formatNPI = (npi: string): string => {
  if (npi.length !== 10) return npi
  return `${npi.slice(0, 4)}-${npi.slice(4, 7)}-${npi.slice(7)}`
}

export const formatMemberId = (id: string): string => {
  // Format as XXXX-XXX-XXXX if 11+ chars
  if (id.length >= 11) {
    return `${id.slice(0, 4)}-${id.slice(4, 7)}-${id.slice(7)}`
  }
  return id
}

export const formatPatientName = (firstName: string, lastName: string): string => {
  return `${lastName}, ${firstName}`
}

export const formatCptCode = (code: string): string => {
  return code.replace(/^0+/, '')
}

export const formatIcdCode = (code: string): string => {
  // Ensure proper formatting: A00.0 format
  if (code.length > 3 && !code.includes('.')) {
    return `${code.slice(0, 3)}.${code.slice(3)}`
  }
  return code.toUpperCase()
}
