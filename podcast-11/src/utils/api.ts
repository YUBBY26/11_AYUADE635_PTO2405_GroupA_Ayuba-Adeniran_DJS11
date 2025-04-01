const BASE_URL = 'https://podcast-api.netlify.app';

export const fetchPreviews = async () => {
  const res = await fetch(BASE_URL);
  return res.json();
};

export const fetchShowById = async (id: number) => {
    const res = await fetch(`${BASE_URL}/id/${id}`);
    return res.json();
  };

  export const fetchGenreById = async (id: number) => {
    const res = await fetch(`${BASE_URL}/genre/${id}`);
    return res.json();
  };