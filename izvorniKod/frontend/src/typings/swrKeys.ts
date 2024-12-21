const backend = "http://localhost:5157";

export const swrKeys = {
  login: `${backend}/login/normal`,
  loginGoogle: `${backend}/login/google`,
  createUser: `${backend}/admin/create`,
  me: `${backend}/me`,
  building: (id: string) => {return `${backend}/buildings/${id}`;}
}
