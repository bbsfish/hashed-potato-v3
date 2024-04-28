const endpoints = {
  link_requests: 'https://script.google.com/macros/s/AKfycbyUVtwxdl5rHLM1TTeLsSVidti3OdsHZQVEH1D_Z7hpFNwQ_CPK_Gi0WlUC7Dki7IJQ/exec',
  services: 'https://script.google.com/macros/s/AKfycbyUVtwxdl5rHLM1TTeLsSVidti3OdsHZQVEH1D_Z7hpFNwQ_CPK_Gi0WlUC7Dki7IJQ/exec',
};

function post(target, payload) {
  const endpoint = endpoints[target];

  const body = new FormData();
  const keys = Object.keys(payload);
  keys.forEach((key) => body.append(key, payload[key]));

  const fetchEp = fetch(endpoint, {
    method: 'POST',
    body,
  });

  async function toText() {
    try {
      const response = await fetchEp();
      return await response.text();
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  async function toJSON() {
    try {
      const response = await fetchEp();
      return await response.json();
    } catch (error) {
      console.error(error);
      return {};
    }
  }

  return {
    toText, toJSON,
  };
}

function get(target, parameters = null) {
  const endpoint = endpoints[target];
  const paramString = (() => {
    if (parameters) {
      const params = new URLSearchParams();
      const keys = Object.keys(parameters);
      keys.forEach((key) => params.append(key, parameters[key]));
      return `?${params.toString()}`;
    }
    return '';
  })();

  const fetchEp = fetch(endpoint + paramString);

  async function toText() {
    try {
      const response = await fetchEp();
      return await response.text();
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  async function toJSON() {
    try {
      const response = await fetchEp();
      return await response.json();
    } catch (error) {
      console.error(error);
      return {};
    }
  }

  return {
    toText, toJSON,
  };
}

const api = {
  post, get,
};

export default api;
