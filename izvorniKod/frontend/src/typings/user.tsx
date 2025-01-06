export interface Zgrada {
  address: string;
  zgradaId: number;
}

export interface Podaci {
  zgrada: Zgrada;
  uloga: string;
}

export interface User {
  podaci: Podaci[];
}
