const handleResponse = async (res) => {
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || 'Request failed')
  }

  return res.json()
}

const postRequest = async (url, headers = {}, body = {}) => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(body)
    })

    return await handleResponse(res)
  } catch (err) {
    console.error(err)
    throw err
  }
}

const getRequest = async (url, headers = {}) => {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    })

    return await handleResponse(res)
  } catch (err) {
    console.error(err)
    throw err
  }
}

export default {
  postRequest,
  getRequest
}