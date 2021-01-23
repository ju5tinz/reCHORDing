export const generate_post_options_auth = (body) => {
  return {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      //'Authorization': JSON.parse(localStorage.getItem('user')).token
    },
    body: JSON.stringify(body)
  }
}

export const generate_post_options = (body) => {
  return {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  }
}

export const generate_get_options_auth = () => {
  return {
    method: "GET",
    headers: {
      //'Authorization': JSON.parse(localStorage.getItem('user')).token
    }
  }
}

export const generate_get_options = () => {
  return {
    method: "GET",
  }
}