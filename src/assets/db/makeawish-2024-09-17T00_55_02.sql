CREATE TABLE children
(
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  nombres     TEXT    NOT NULL,
  apepat      TEXT    NOT NULL,
  apemat      TEXT    NULL,
  edad        INTEGER NOT NULL,
  fecha_nac   DATE    NOT NULL,
  deseo       TEXT    NULL,
  foto        BLOB    NOT NULL
);

CREATE TABLE people
(
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  nombres     TEXT    NOT NULL,
  apepat      TEXT    NOT NULL,
  apemat      TEXT    NULL,
  fecha_nac   DATE    NOT NULL,
  ocupacion   TEXT    NULL,
  foto        BLOB    NULL
);

CREATE TABLE address
(
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  calle       TEXT    NOT NULL,
  no_ext      NUMERIC NOT NULL,
  colonia     TEXT    NOT NULL,
  municipio   TEXT    NOT NULL,
  cp          NUMERIC NOT NULL,
  coordenadas TEXT    NULL
);

CREATE TABLE child_address
(
  child_id    INTEGER NOT NULL,
  address_id  INTEGER NOT NULL,
  PRIMARY KEY (child_id, address_id),
  FOREIGN KEY (child_id) REFERENCES children(id),
  FOREIGN KEY (address_id) REFERENCES address(id)
);

CREATE TABLE person_address
(
  person_id   INTEGER NOT NULL,
  address_id  INTEGER NOT NULL,
  PRIMARY KEY (person_id, address_id),
  FOREIGN KEY (person_id) REFERENCES people(id),
  FOREIGN KEY (address_id) REFERENCES address(id)
);

CREATE TABLE child_contact
(
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id    INTEGER NOT NULL,
  telefono    NUMERIC NULL,
  FOREIGN KEY (child_id) REFERENCES children(id)
);

CREATE TABLE person_contact
(
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  person_id   INTEGER NOT NULL,
  telefono    NUMERIC NULL,
  FOREIGN KEY (person_id) REFERENCES people(id)
);

CREATE TABLE resources
(
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  person_id   INTEGER NOT NULL,
  descripcion TEXT    NOT NULL,
  cantidad    INTEGER NOT NULL,
  fecha_entrega DATE  NOT NULL,
  FOREIGN KEY (person_id) REFERENCES people(id)
);
