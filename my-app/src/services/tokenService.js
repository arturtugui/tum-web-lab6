const TOKEN_STORAGE_KEY = 'pit-token'
const TOKEN_STORAGE_KIND_KEY = 'pit-token-storage'

const STORAGE_KIND = {
  LOCAL: 'local',
  SESSION: 'session',
}

function safeBase64UrlDecode(value) {
  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
    return atob(padded)
  } catch {
    return null
  }
}

function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') {
    return null
  }

  const parts = token.split('.')
  if (parts.length !== 3) {
    return null
  }

  const payload = safeBase64UrlDecode(parts[1])
  if (!payload) {
    return null
  }

  try {
    return JSON.parse(payload)
  } catch {
    return null
  }
}

function getStorage(kind = STORAGE_KIND.LOCAL) {
  return kind === STORAGE_KIND.SESSION ? sessionStorage : localStorage
}

function getStoredKind() {
  const rawKind = localStorage.getItem(TOKEN_STORAGE_KIND_KEY)
  return rawKind === STORAGE_KIND.SESSION ? STORAGE_KIND.SESSION : STORAGE_KIND.LOCAL
}

export function setToken(token, options = {}) {
  const kind = options.kind === STORAGE_KIND.SESSION ? STORAGE_KIND.SESSION : STORAGE_KIND.LOCAL

  clearToken()

  getStorage(kind).setItem(TOKEN_STORAGE_KEY, token)
  localStorage.setItem(TOKEN_STORAGE_KIND_KEY, kind)
}

export function getToken() {
  const preferredKind = getStoredKind()
  const preferred = getStorage(preferredKind).getItem(TOKEN_STORAGE_KEY)

  if (preferred) {
    return preferred
  }

  return localStorage.getItem(TOKEN_STORAGE_KEY) || sessionStorage.getItem(TOKEN_STORAGE_KEY)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  sessionStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(TOKEN_STORAGE_KIND_KEY)
}

export function getTokenPayload(token = getToken()) {
  return decodeJwtPayload(token)
}

export function isTokenExpired(token = getToken(), skewSeconds = 10) {
  const payload = getTokenPayload(token)

  if (!payload?.exp) {
    return true
  }

  const nowSeconds = Math.floor(Date.now() / 1000)
  return payload.exp <= nowSeconds + skewSeconds
}

export async function getValidToken(fetchToken, role, options = {}) {
  const existing = getToken()
  const reuseToken = existing && !isTokenExpired(existing, options.skewSeconds)

  if (reuseToken) {
    return existing
  }

  const response = await fetchToken(role)
  const freshToken = response?.token

  if (!freshToken) {
    throw new Error('Token response is missing token')
  }

  setToken(freshToken, options)
  return freshToken
}

export { TOKEN_STORAGE_KEY, STORAGE_KIND }
