export async function fetcher<T>(
  input: string | URL | globalThis.Request,
  init?: RequestInit
): Promise<T> {
  const headerJSON = localStorage.getItem("ezgrada-header");
  if (headerJSON == null) throw new Error("Problem while accessing user data");
  const header = JSON.parse(headerJSON);
  const response = await fetch(input, {
    headers: {
      "Content-Type": "application/json",
      Accept: "aplication/json",
      "access-token": header.accessToken,
      client: header.client,
      "token-type": header.tokenType,
      uid: header.uid,
      expiry: header.expiry,
    },
    ...init,
  });
  if (!response.ok) {
    throw new Error(`Dogodila se greška kod fetchanja`);
  }
  const data = await response.json();
  return data;
}

export async function authFetcher<T>(
  input: string | URL | globalThis.Request,
  init?: RequestInit
): Promise<T> {
  let data, authInfo;
  try {
    const value = localStorage.getItem("loginInfo");
    authInfo = value ? JSON.parse(value) : {};
    console.log("auth info", authInfo);
    const bdy = { token: authInfo.token };
    console.log(bdy);
    console.log(input);
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
      if (data.podaci) {
        data.podaci = data.podaci.map((item: any) => ({
          zgrada: {
            address: item.key.address,
            zgradaId: item.key.zgradaId,
          },
          uloga: item.value,
        }));
      }
    }
  } catch (error) {
    throw error;
  }
  console.log("returned", data);
  return { ...data, role: authInfo.role };
}
