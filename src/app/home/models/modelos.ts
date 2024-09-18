export interface Child {
    id: number;
    nombres: string;
    apepat: string;
    apemat?: string;
    edad: number;
    fecha_nac: string;
    deseo?: string;
    foto: Blob;
  }
  
  export interface Person {
    id: number;
    nombres: string;
    apepat: string;
    apemat?: string;
    fecha_nac: string;
    ocupacion?: string;
    foto?: Blob;
  }
  
  export interface Address {
    id: number;
    calle: string;
    no_ext: number;
    colonia: string;
    municipio: string;
    cp: number;
    coordenadas?: string;
  }
  
  export interface ChildAddress {
    child_id: number;
    address_id: number;
  }
  
  export interface PersonAddress {
    person_id: number;
    address_id: number;
  }
  
  export interface ChildContact {
    id: number;
    child_id: number;
    telefono?: number;
  }
  
  export interface PersonContact {
    id: number;
    person_id: number;
    telefono?: number;
  }
  
  export interface Resource {
    id: number;
    person_id: number;
    descripcion: string;
    cantidad: number;
    fecha_entrega: string;
  }
  