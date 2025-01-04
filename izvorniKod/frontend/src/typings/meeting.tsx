export interface IMeetingSummary {
  title: string;
  id: string;
  time: string;
  place: string;
  summary: string;
  status: "obavljen" | "objavljen" | "planiran" | "arhiviran";
}

export interface IMeeting {
  meetingId: Number;
  naslov: string;
  mjesto: string;
  vrijeme: Date;
  status: "Obavljen" | "Objavljen" | "Planiran" | "Arhiviran";
  zgradaId: Number;
  kreatorId: Number;
  sazetak: string;
  tockeDnevnogReda: ITocka[];
  sudjelovanje: Boolean;
  brojSudionika: number;
}

export interface ITocka {
  id: number;
  imeTocke: string;
  imaPravniUcinak: Boolean;
  sazetak?: string;
  stanjeZakljucka?: "Izglasan" | "Odbijen";
  url?: string;
  sastanakId: Number;
}
