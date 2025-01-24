export async function authFetcher<T>(
  input: string | URL | globalThis.Request,
  init?: RequestInit
): Promise<T> {
  let data, authInfo;
  try {
    const value = localStorage.getItem("loginInfo");
    authInfo = value ? JSON.parse(value) : {};
    const bdy = { token: authInfo.token };
    const response = await fetch(input, {
      ...init,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        token: authInfo.token,
      },
    });
    if (!response.ok) {
      if (response.status == 401) {
      }
      throw response;
    }
    if (response.status !== 204) {
      data = await response.json();
    }
  } catch (error) {
    throw error;
  }
  return { ...data };
}
