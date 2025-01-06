const backend = "http://localhost:5157";

export const swrKeys = {
  login: `${backend}/login/normal`,
  loginGoogle: `${backend}/login/google`,
  createUser: `${backend}/admin/create`,
  me: `${backend}/me`,
  building: (id: string) => {
    return `${backend}/buildings/${id}`;
  },
  meeting: (id: string) => {
    return `${backend}/meetings/${id}`;
  },
  createMeeting: `${backend}/meetings/create`,
  deleteMeeting: (id: string) => {
    return `${backend}/meetings/delete/${id}`;
  },
  objaviMeeting: (id: string) => {
    return `${backend}/meetings/objavljen/${id}`;
  },
  obaviMeeting: (id: string) => {
    return `${backend}/meetings/obavljen/${id}`;
  },
  joinMeeting: (id: string) => {
    return `${backend}/meetings/join/${id}`;
  },
  leaveMeeting: (id: string) => {
    return `${backend}/meetings/leave/${id}`;
  },
  updateMeeting: (id: string) => {
    return `${backend}/meetings/${id}`;
  },
  arhivirajMeeting: (id: string) => {
    return `${backend}/meetings/arhiviraj/${id}`;
  },
};
