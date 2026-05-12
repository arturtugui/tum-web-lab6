const TOKEN_STORAGE_KEY = 'pit-token'

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

export function setToken(token) {
  clearToken()
  sessionStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_STORAGE_KEY)
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_STORAGE_KEY)
}

export function getTokenPayload(token = getToken()) {
  return decodeJwtPayload(token)
}

export function isTokenExpired(token = getToken(), skewSeconds = 10) {
  const payload = getTokenPayload(token)

  //short for 
  // if (payload === null || payload === undefined || !payload.exp) {
  if (!payload?.exp) {
    return true
  }

  const nowSeconds = Math.floor(Date.now() / 1000)
  
  const expiryTime = payload.exp              // when token expires (seconds)
  const currentTime = nowSeconds + skewSeconds  // now plus a buffer
  return expiryTime <= currentTime             // true = expired or about to expire
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

  setToken(freshToken)
  return freshToken
}

export { TOKEN_STORAGE_KEY }
