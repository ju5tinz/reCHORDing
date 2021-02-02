export default async function handleResponse(response) {
  const text = await response.text()
  const data = JSON.parse(text)
  
  if(!response.ok) {
    // log user out if 401 response
    /*
    if(response.status === 401) {
      localStorage.removeItem("user")
    }
    */

    const message = (data && data.message) || response.statusText;

    await Promise.reject(message)
  }

  return data
}

