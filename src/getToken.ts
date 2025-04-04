const auth = btoa(`${import.meta.env.VITE_CLIENT_ID}:${import.meta.env.VITE_CLIENT_SECRET}`);

export interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
}

let token: Token | null = null;

export const getAccessToken = async () => {
  if (token !== null) return token;
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  
  const text = await response.text();
  const parsedToken: Token = JSON.parse(text);
  token = parsedToken
  return token
}
