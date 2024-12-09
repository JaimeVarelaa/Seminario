import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  capSQLiteChanges,
  capSQLiteValues,
} from '@capacitor-community/sqlite';
import { Adulto } from 'src/models/adulto.model';

import { SqliteService } from './sqlite.service';

@Injectable({
  providedIn: 'root',
})
export class AdultoService {
  constructor(private sqlService: SqliteService) {}

  async addAdulto(adulto: Adulto): Promise<boolean> {
    const dbName = await this.sqlService.getDbName();

    try {
      const maxIdQuery = await CapacitorSQLite.query({
        database: dbName,
        statement: 'SELECT MAX(id) AS maxId FROM adulto',
        values: [],
      });

      let newId = 1;
      if (maxIdQuery.values.length > 0 && maxIdQuery.values[0].maxId != null) {
        newId = maxIdQuery.values[0].maxId + 1;
      }

      const sqlAdulto = `
          INSERT INTO adulto (id, nombres, apepat, apemat, edad, fecha_nac, foto)
          VALUES (?, ?, ?, ?, ?, ?, ?);
        `;
      const valuesAdulto = [
        newId,
        adulto.nombres,
        adulto.apeliido_paterno,
        adulto.apellido_materno,
        adulto.edad,
        adulto.fecha_nac,
        adulto.foto,
      ];

      const adultoInsertResult = await CapacitorSQLite.executeSet({
        database: dbName,
        set: [{ statement: sqlAdulto, values: valuesAdulto }],
      });

      const sqlContacto = `
          INSERT INTO contacto (numero, adulto)
          VALUES (?, ?);
        `;
      const valuesContacto = [adulto.contacto.numero, newId];

      await CapacitorSQLite.executeSet({
        database: dbName,
        set: [{ statement: sqlContacto, values: valuesContacto }],
      });

      const sqlDireccion = `
          INSERT INTO direccion (calle, numero, colonia, cp, municipio, estado, referecncia, adulto)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `;
      const valuesDireccion = [
        adulto.direccion.calle,
        adulto.direccion.numero,
        adulto.direccion.colonia,
        adulto.direccion.cp,
        adulto.direccion.municipio,
        adulto.direccion.estado,
        adulto.direccion.referencia,
        newId,
      ];

      await CapacitorSQLite.executeSet({
        database: dbName,
        set: [{ statement: sqlDireccion, values: valuesDireccion }],
      });

      const sqlEstudio = `
          INSERT INTO estudio (vivienda, techo, piso, num_habitaciones, combustible, num_habitantes, enfermos_cronicos, num_trabajadores, adulto)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
      const valuesEstudio = [
        adulto.estudio.vivienda,
        adulto.estudio.techo,
        adulto.estudio.piso,
        adulto.estudio.num_habitaciones,
        adulto.estudio.combustible,
        adulto.estudio.num_habitantes,
        adulto.estudio.enfermos_cronicos || '',
        adulto.estudio.num_trabajadores,
        newId,
      ];

      await CapacitorSQLite.executeSet({
        database: dbName,
        set: [{ statement: sqlEstudio, values: valuesEstudio }],
      });

      if (this.sqlService.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }

      return true;
    } catch (error) {
      console.error('Error en la transacción: ', error);
      return false;
    }
  }

  async updateAdulto(adulto: Adulto): Promise<boolean> {
    const dbName = await this.sqlService.getDbName();
  
    try {
      const sqlAdulto = `
        UPDATE adulto
        SET nombres = ?, apepat = ?, apemat = ?, edad = ?, fecha_nac = ?, foto = ?
        WHERE id = ?;
      `;
      const valuesAdulto = [
        adulto.nombres,
        adulto.apeliido_paterno,
        adulto.apellido_materno,
        adulto.edad,
        adulto.fecha_nac,
        adulto.foto,
        adulto.id,
      ];
  
      await CapacitorSQLite.executeSet({
        database: dbName,
        set: [{ statement: sqlAdulto, values: valuesAdulto }],
      });
  
      const sqlContacto = `
        UPDATE contacto
        SET numero = ?
        WHERE adulto = ?;
      `;
      const valuesContacto = [adulto.contacto.numero, adulto.id];
  
      await CapacitorSQLite.executeSet({
        database: dbName,
        set: [{ statement: sqlContacto, values: valuesContacto }],
      });
  
      const sqlDireccion = `
        UPDATE direccion
        SET calle = ?, numero = ?, colonia = ?, cp = ?, municipio = ?, estado = ?, referecncia = ?
        WHERE adulto = ?;
      `;
      const valuesDireccion = [
        adulto.direccion.calle,
        adulto.direccion.numero,
        adulto.direccion.colonia,
        adulto.direccion.cp,
        adulto.direccion.municipio,
        adulto.direccion.estado,
        adulto.direccion.referencia,
        adulto.id,
      ];
  
      await CapacitorSQLite.executeSet({
        database: dbName,
        set: [{ statement: sqlDireccion, values: valuesDireccion }],
      });
  
      const sqlEstudio = `
        UPDATE estudio
        SET vivienda = ?, techo = ?, piso = ?, num_habitaciones = ?, combustible = ?, num_habitantes = ?, enfermos_cronicos = ?, num_trabajadores = ?
        WHERE adulto = ?;
      `;
      const valuesEstudio = [
        adulto.estudio.vivienda,
        adulto.estudio.techo,
        adulto.estudio.piso,
        adulto.estudio.num_habitaciones,
        adulto.estudio.combustible,
        adulto.estudio.num_habitantes,
        adulto.estudio.enfermos_cronicos || '',
        adulto.estudio.num_trabajadores,
        adulto.id,
      ];
  
      await CapacitorSQLite.executeSet({
        database: dbName,
        set: [{ statement: sqlEstudio, values: valuesEstudio }],
      });
  
      if (this.sqlService.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
  
      return true;
    } catch (error) {
      console.error('Error en la transacción de actualización: ', error);
      return false;
    }
  }
  

  async getAdultos(): Promise<Adulto[]> {
    const dbName = await this.sqlService.getDbName();
    await CapacitorSQLite.open({ database: dbName });

    try {
      const query = `
        SELECT 
          a.id, a.nombres, a.apepat, a.apemat, a.edad, a.fecha_nac, a.foto,
          c.numero AS contacto_numero,
          d.calle, d.numero AS direccion_numero, d.colonia, d.cp, d.municipio, d.estado, d.referecncia,
          e.vivienda, e.techo, e.piso, e.num_habitaciones, e.combustible, e.num_habitantes, e.enfermos_cronicos, e.num_trabajadores
        FROM adulto a
        LEFT JOIN contacto c ON a.id = c.adulto
        LEFT JOIN direccion d ON a.id = d.adulto
        LEFT JOIN estudio e ON a.id = e.adulto
      `;

      const result = await CapacitorSQLite.query({
        database: dbName,
        statement: query,
        values: [],
      });

      const adultos: Adulto[] = result.values.map((row: any) => ({
        id: row.id,
        nombres: row.nombres,
        apeliido_paterno: row.apepat,
        apellido_materno: row.apemat,
        edad: row.edad,
        fecha_nac: row.fecha_nac,
        foto: row.foto,
        contacto: {
          numero: row.contacto_numero,
        },
        direccion: {
          calle: row.calle,
          numero: row.direccion_numero,
          colonia: row.colonia,
          cp: row.cp,
          municipio: row.municipio,
          estado: row.estado,
          referencia: row.referecncia,
        },
        estudio: {
          vivienda: row.vivienda,
          techo: row.techo,
          piso: row.piso,
          num_habitaciones: row.num_habitaciones,
          combustible: row.combustible,
          num_habitantes: row.num_habitantes,
          enfermos_cronicos: row.enfermos_cronicos,
          num_trabajadores: row.num_trabajadores,
        },
      }));

      return adultos;
    } catch (error) {
      console.error('Error al obtener los adultos: ', error);
      return [];
    }
  }

  async getAdultoById(id: number): Promise<Adulto | null> {
    const dbName = await this.sqlService.getDbName();
    await CapacitorSQLite.open({ database: dbName });

    try {
      const query = `
        SELECT 
          a.id, a.nombres, a.apepat, a.apemat, a.edad, a.fecha_nac, a.foto,
          c.numero AS contacto_numero,
          d.calle, d.numero AS direccion_numero, d.colonia, d.cp, d.municipio, d.estado, d.referecncia,
          e.vivienda, e.techo, e.piso, e.num_habitaciones, e.combustible, e.num_habitantes, e.enfermos_cronicos, e.num_trabajadores
        FROM adulto a
        LEFT JOIN contacto c ON a.id = c.adulto
        LEFT JOIN direccion d ON a.id = d.adulto
        LEFT JOIN estudio e ON a.id = e.adulto
        WHERE a.id = ?
      `;

      const result = await CapacitorSQLite.query({
        database: dbName,
        statement: query,
        values: [id],
      });

      if (result.values.length === 0) {
        return null;
      }

      const row = result.values[0];
      const adulto: Adulto = {
        id: row.id,
        nombres: row.nombres,
        apeliido_paterno: row.apepat,
        apellido_materno: row.apemat,
        edad: row.edad,
        fecha_nac: row.fecha_nac,
        foto: row.foto,
        contacto: {
          numero: row.contacto_numero,
        },
        direccion: {
          calle: row.calle,
          numero: row.direccion_numero,
          colonia: row.colonia,
          cp: row.cp,
          municipio: row.municipio,
          estado: row.estado,
          referencia: row.referecncia,
        },
        estudio: {
          vivienda: row.vivienda,
          techo: row.techo,
          piso: row.piso,
          num_habitaciones: row.num_habitaciones,
          combustible: row.combustible,
          num_habitantes: row.num_habitantes,
          enfermos_cronicos: row.enfermos_cronicos,
          num_trabajadores: row.num_trabajadores,
        },
      };

      return adulto;
    } catch (error) {
      console.error('Error al obtener el adulto por id: ', error);
      return null;
    }
  }

  async deleteAdulto(id: number): Promise<boolean> {
    const dbName = await this.sqlService.getDbName();
  
    try {  
      const sqlContacto = `
        DELETE FROM contacto
        WHERE adulto = ?;
      `;
      await CapacitorSQLite.executeSet({
        database: dbName,
        set: [{ statement: sqlContacto, values: [id] }],
      });
  
      const sqlDireccion = `
        DELETE FROM direccion
        WHERE adulto = ?;
      `;
      await CapacitorSQLite.executeSet({
        database: dbName,
        set: [{ statement: sqlDireccion, values: [id] }],
      });
  
      const sqlEstudio = `
        DELETE FROM estudio
        WHERE adulto = ?;
      `;
      await CapacitorSQLite.executeSet({
        database: dbName,
        set: [{ statement: sqlEstudio, values: [id] }],
      });
  
      const sqlAdulto = `
        DELETE FROM adulto
        WHERE id = ?;
      `;
      await CapacitorSQLite.executeSet({
        database: dbName,
        set: [{ statement: sqlAdulto, values: [id] }],
      });
  
      if (this.sqlService.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
  
      return true;
    } catch (error) {
      console.error('Error al eliminar el adulto: ', error);
      return false;
    }
  }
  
}
