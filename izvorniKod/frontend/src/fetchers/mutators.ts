import { authFetcher } from "./fetcher";
export async function loginMutator<T>(url: string, { arg }: { arg: T }) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  const responseData = await response.json();
  return {
    ...responseData,
  };
}

export async function createMutator<T>(url: string, { arg }: { arg: T }) {
  const value = localStorage.getItem("loginInfo");
  const authInfo = value ? JSON.parse(value) : {};
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      token: authInfo.token,
    },
    body: JSON.stringify(arg),
  });
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
}

export async function postMutator<T>(url: string, { arg }: { arg: T }) {
  return await authFetcher(url, {
    method: "POST",
    body: JSON.stringify(arg),
  });
}

export async function deleteMutator<T>(url: string, { arg }: { arg: T }) {
  return await authFetcher(url, {
    method: "DELETE",
    body: JSON.stringify(arg),
  });
}

export async function putMutator<T>(url: string, { arg }: { arg: T }) {
  return await authFetcher(url, {
    method: "PUT",
    body: JSON.stringify(arg),
  });
}
