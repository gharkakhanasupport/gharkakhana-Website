export const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzdMfym5f153Rjbd3ltvt7t4sRyICvHmN3uNFruUXoHRHGZdEeIhawLxyJBmgvnaEYW/exec';

export const submitWishlistEmail = async (formData) => {
  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      timestamp: new Date().toISOString(),
      honeypot: formData.honeypot
    }),
  });
  return response;
};
