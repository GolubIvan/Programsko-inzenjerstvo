CREATE TABLE ZGRADA
(
  zgradaID INT GENERATED ALWAYS AS IDENTITY NOT NULL,
  adresaZgrade VARCHAR NOT NULL,
  PRIMARY KEY (zgradaID)
);

CREATE TABLE KORISNIK
(
  eMail VARCHAR NOT NULL,
  imeKorisnika VARCHAR NOT NULL,
  lozinka VARCHAR NOT NULL,
  userID INT GENERATED ALWAYS AS IDENTITY NOT NULL,
  PRIMARY KEY (userID),
  UNIQUE (eMail)
);

CREATE TABLE ACCOUNT
(
  role VARCHAR NOT NULL,
  zgradaID INT NOT NULL,
  userID INT NOT NULL,
  PRIMARY KEY (zgradaID, userID),
  FOREIGN KEY (zgradaID) REFERENCES ZGRADA(zgradaID),
  FOREIGN KEY (userID) REFERENCES KORISNIK(userID)
);

CREATE TABLE SASTANAK
(
  sazetakNamjereSastanka VARCHAR NOT NULL,
  vrijemeSastanka TIMESTAMP NOT NULL,
  mjestoSastanka VARCHAR NOT NULL,
  statusSastanka VARCHAR NOT NULL,
  sastanakID INT GENERATED ALWAYS AS IDENTITY NOT NULL,
  naslovSastanaka VARCHAR NOT NULL,
  zgradaID INT NOT NULL,
  kreatorID INT NOT NULL,
  PRIMARY KEY (sastanakID),
  FOREIGN KEY (zgradaID, kreatorID) REFERENCES ACCOUNT(zgradaID, userID)
);

CREATE TABLE TOCKA_DNEVNOG_REDA
(
  imeTocke VARCHAR NOT NULL,
  imaPravniUcinak BOOLEAN NOT NULL,
  sazetakRasprave VARCHAR,
  stanjeZakljucka VARCHAR,
  TDR_ID INT GENERATED ALWAYS AS IDENTITY NOT NULL,
  linkNaDiskusiju VARCHAR,
  sastanakID INT NOT NULL,
  PRIMARY KEY (TDR_ID, sastanakID),
  FOREIGN KEY (sastanakID) REFERENCES SASTANAK(sastanakID)
);

CREATE TABLE sudjelovanje
(
  zgradaID INT NOT NULL,
  userID INT NOT NULL,
  sastanakID INT NOT NULL,
  PRIMARY KEY (zgradaID, userID, sastanakID),
  FOREIGN KEY (zgradaID, userID) REFERENCES ACCOUNT(zgradaID, userID),
  FOREIGN KEY (sastanakID) REFERENCES SASTANAK(sastanakID)
);

INSERT INTO ZGRADA (adresaZgrade) VALUES
('Ulica Kralja Tomislava 10'),
('Ulica Ivana Meštrovića 15'),
('Ulica Nikole Tesle 3');

INSERT INTO KORISNIK (eMail, imeKorisnika, lozinka) VALUES
('ana@gmail.com', 'Ana', '$2a$11$57ZYA3lArj2T.eM1EKDoBuJ6SMA0atY/LwuKAKbAl1frf0k/I9Azm'),
('marko@gmail.com', 'Marko', '$2a$11$XH85m0QpM49uCPWTh3E9U.DGmvweocNZWlWsygXkoyTi33zeqXS9y'),
('ivan@gmail.com', 'Ivica', '$2a$11$WLQtC6OeJFuttuw0Iy6tX.tNU5.TNdsBZmUYiNya2c5bvY/SFkuZm'),
('pero@gmail.com', 'Pero', '$2a$11$iGBVPP811vcv.KQB5TgOEeRHvNMpCv6HnMtUkTQ8AaGItrBi4g0D2'),
('mirko@gmail.com', 'Mirko', '$2a$11$jnaKbFzKfITxE6iXbR4EuuZ.TYoOT3w1cXsTi4KvIzeLTjDbQ0HC2'),
('branko@gmail.com', 'Branko', '$2a$11$nI9drQRYQ.O4p.6SnCfUju1GRfwI.iP7HzuEM/O95o3UgoNHmzaP.'),
('ivana@gmail.com', 'Ivana', '$2a$11$9fECU0qdSLUk2t7Ee8H5reIPR5Bu/hpnlYDgtnEAirzpRXHvdE/mu'),
('lovro.nidogon@gmail.com', 'Lovro', '$2a$11$1/QIIAjqpGFi7KdA9.3CLeY875CWSw.8Ak.F620BJgiyUq0W0M4XS'); 
INSERT INTO ACCOUNT (role, zgradaID, userID) VALUES
('Administrator', 1, 1),
('Suvlasnik', 2, 1),
('Administrator', 2, 2),
('Suvlasnik', 1, 3),
('Predstavnik', 2, 3),
('Administrator', 3, 3),
('Suvlasnik', 3, 4),
('Predstavnik', 1, 5),
('Suvlasnik', 1, 6),
('Suvlasnik', 2, 6),
('Predstavnik', 3, 6),
('Suvlasnik', 1, 7),
('Suvlasnik', 2, 7),
('Suvlasnik', 1, 8);

INSERT INTO SASTANAK (sazetakNamjereSastanka, vrijemeSastanka, mjestoSastanka, statusSastanka, naslovSastanaka, zgradaID, kreatorID) VALUES
('Razmatranje godišnjeg budžeta', '2023-12-01 12:45:00', 'Sala 1', 'Obavljen', 'Godišnji budžet', 1, 5),
('Popravak krova', '2023-12-10 15:30:00', 'Prizemlje', 'Obavljen', 'Popravci u zgradi', 2, 2),
('Rješavanje problema bučnih susjeda', '2024-06-08 17:00:00', 'Prvi kat', 'Planiran', 'Bučni susjedi', 1, 5),
('Predlaganje ideja za poboljšanje unutrašnjosti zgrade', '2024-03-03 14:20:00', 'Stan Ivić', 'Objavljen', 'Unaprjeđenje zajedničkih prostora', 3, 6);

INSERT INTO TOCKA_DNEVNOG_REDA (imeTocke, imaPravniUcinak, sazetakRasprave, stanjeZakljucka, sastanakID) VALUES
('Odluka o zamjeni postojećeg sustava grijanja sa novim', TRUE, NULL, 'Izglasan', 1),
('Rasprava o mogućim opcijama za popravak krova', FALSE, 'Izbor smanjen na tri opcije, dogovor na sljedećem sastanku', NULL, 2);

INSERT INTO sudjelovanje (zgradaID, userID, sastanakID) VALUES
(1, 3, 1),
(1, 6, 1),
(1, 7, 1),
(2, 1, 2),
(2, 6, 2),
(2, 7, 2),
(3, 3, 4);
