//this will replace localStorage with API calls to the backend
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function request(path, { method = 'GET', token, body, onRetry } = {}, isRetry = false) {
  const headers = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    // If 401 (Unauthorized) and we haven't retried yet, try refreshing token
    if (response.status === 401 && !isRetry && onRetry) {
      try {
        const newToken = await onRetry()
        // Retry the request with the new token
        return request(path, { method, token: newToken, body }, true)
      } catch (retryErr) {
        // If retry fails, fall through to throw original error
      }
    }

    const error = new Error(data?.error || `Request failed with status ${response.status}`)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export async function fetchItems(token, limit = 20, offset = 0, onRetry) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  })
  return request(`/items?${params.toString()}`, { token, onRetry })
}

export async function fetchItemById(token, id, onRetry) {
  return request(`/items/${id}`, { token, onRetry })
}

export async function createItem(token, item, onRetry) {
  return request('/items', {
    method: 'POST',
    token,
    body: item,
    onRetry,
  })
}

export async function updateItem(token, id, item, onRetry) {
  return request(`/items/${id}`, {
    method: 'PUT',
    token,
    body: item,
    onRetry,
  })
}

export async function patchItem(token, id, patch, onRetry) {
  return request(`/items/${id}`, {
    method: 'PATCH',
    token,
    body: patch,
    onRetry,
  })
}

export async function deleteItem(token, id, onRetry) {
  return request(`/items/${id}`, {
    method: 'DELETE',
    token,
    onRetry,
  })
}

export async function hideItem(token, id, onRetry) {
  return request(`/items/${id}/hide`, {
    method: 'PATCH',
    token,
    onRetry,
  })
}

export async function unhideItem(token, id, onRetry) {
  return request(`/items/${id}/unhide`, {
    method: 'PATCH',
    token,
    onRetry,
  })
}

export async function getTokenForRole(role) {
  return request('/auth/token', {
    method: 'POST',
    body: { role },
  })
}