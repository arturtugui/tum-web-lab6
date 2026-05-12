//this will replace localStorage with API calls to the backend
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function request(path, { method = 'GET', token, body } = {}) {
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
    const error = new Error(data?.error || `Request failed with status ${response.status}`)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export async function fetchItems(token, limit = 20, offset = 0) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  })
  return request(`/items?${params.toString()}`, { token })
}

export async function fetchItemById(token, id) {
  return request(`/items/${id}`, { token })
}

export async function createItem(token, item) {
  return request('/items', {
    method: 'POST',
    token,
    body: item,
  })
}

export async function updateItem(token, id, item) {
  return request(`/items/${id}`, {
    method: 'PUT',
    token,
    body: item,
  })
}

export async function patchItem(token, id, patch) {
  return request(`/items/${id}`, {
    method: 'PATCH',
    token,
    body: patch,
  })
}

export async function deleteItem(token, id) {
  return request(`/items/${id}`, {
    method: 'DELETE',
    token,
  })
}

export async function hideItem(token, id) {
  return request(`/items/${id}/hide`, {
    method: 'PATCH',
    token,
  })
}

export async function unhideItem(token, id) {
  return request(`/items/${id}/unhide`, {
    method: 'PATCH',
    token,
  })
}

export async function getTokenForRole(role) {
  return request('/auth/token', {
    method: 'POST',
    body: { role },
  })
}