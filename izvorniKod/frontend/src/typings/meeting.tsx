export interface IMeetingSummary {
  title: string;
  id: string;
  time: string;
  place: string;
  summary: string;
  status: "obavljen" | "objavljen" | "planiran" | "arhiviran";
}

export interface IMeeting {
  meetingId: number;
  naslov: string;
  mjesto: string;
  vrijeme: Date;
  status: "Obavljen" | "Objavljen" | "Planiran" | "Arhiviran";
  zgradaId: number;
  kreatorId: number;
  sazetak: string;
  tockeDnevnogReda: ITocka[];
  sudjelovanje: boolean;
  brojSudionika: number;
}

export interface ITocka {
  id: number;
  imeTocke: string;
  imaPravniUcinak: boolean;
  sazetak?: string;
  stanjeZakljucka?: "Izglasan" | "Odbijen";
  url?: string;
  sastanakId: number;
}
