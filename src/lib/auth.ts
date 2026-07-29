import { getSession } from 'next-auth/react';

export async function getAuthToken() {
  const session = await getSession();
  return (session?.user as any)?.token || null;
}

export async function getAuthHeaders() {
  const token = await getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
