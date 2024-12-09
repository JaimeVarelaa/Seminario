export interface Adulto {
    id?: number,
    nombres: string,
    apeliido_paterno: string,
    apellido_materno: string,
    edad: number,
    fecha_nac: string,
    foto: string,
    niños?: Niño[],
    contacto?: Contacto,
    direccion?: Direccion,
}

export interface Niño {
    id?: number,
    nombres: string,
    apellido_paterno: string,
    apellido_materno: string,
    edad: number,
    fecha_nac: string,
    foto: string,
    deseo: string,
}

export interface Contacto {
    numero: string
}

export interface Direccion {
    calle: string,
    numero: number,
    colonia: string,
    cp: number,
    municipio: string,
    estado: string,
    referencia: string,
}