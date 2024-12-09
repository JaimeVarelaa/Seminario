export interface Adulto {
  id?: number;
  nombres: string;
  apeliido_paterno: string;
  apellido_materno: string;
  edad: number;
  fecha_nac: string;
  foto: string;
  niños?: Niño[];
  contacto?: Contacto;
  direccion?: Direccion;
  estudio?: Estudio;
}

export interface Niño {
  id?: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  edad: number;
  fecha_nac: string;
  foto: string;
  deseo: string;
  idPadre?: number;
}

export interface Contacto {
  numero: string;
}

export interface Direccion {
  calle: string;
  numero: number;
  colonia: string;
  cp: number;
  municipio: string;
  estado: string;
  referencia: string;
}

export interface Estudio {
  vivienda: string;
  techo: string;
  piso: string;
  num_habitaciones: string;
  combustible: string;
  num_habitantes: string;
  enfermos_cronicos?: string;
  num_trabajadores: string;
}
