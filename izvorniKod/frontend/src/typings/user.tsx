export interface Zgrada {
  address: string;
  zgradaId: number;
}

export interface Podaci {
  key: Zgrada;
  value: string;
}

export interface User {
  admin: boolean;
  email: string;
  podaci: Podaci[];
}
