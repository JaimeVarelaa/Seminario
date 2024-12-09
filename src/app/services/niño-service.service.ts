import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  capSQLiteChanges,
  capSQLiteValues,
} from '@capacitor-community/sqlite';
import { SqliteService } from './sqlite.service';
import { Niño } from 'src/models/adulto.model';

@Injectable({
  providedIn: 'root',
})
export class NiñoService {
  constructor(private sqlService: SqliteService) { }

  async addNiño(niño: Niño): Promise<boolean> {
    const dbName = await this.sqlService.getDbName();

    try {
      const maxIdQuery = await CapacitorSQLite.query({
        database: dbName,
        statement: 'SELECT MAX(id) AS maxId FROM niño',
        values: [],
      });

      let newId = 1;
      if (maxIdQuery.values.length > 0 && maxIdQuery.values[0].maxId != null) {
        newId = maxIdQuery.values[0].maxId + 1;
      }

      const sqlNiño = `
          INSERT INTO niño (id, nombres, apepat, apemat, edad, fecha_nac, foto, padre)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `;
      const valuesNiño = [
        newId,
        niño.nombres,
        niño.apellido_paterno,
        niño.apellido_materno || '',
        niño.edad,
        niño.fecha_nac,
        niño.foto,
        niño.idPadre,
      ];

      await CapacitorSQLite.executeSet({
        database: dbName,
        set: [{ statement: sqlNiño, values: valuesNiño }],
      });

      if (niño.deseo) {
        const sqlDeseo = `
          INSERT INTO deseo (deseo, id_niño)
          VALUES (?, ?);
        `;
        const valuesDeseo = [niño.deseo, newId];

        await CapacitorSQLite.executeSet({
          database: dbName,
          set: [{ statement: sqlDeseo, values: valuesDeseo }],
        });
      }

      if (this.sqlService.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }

      return true;
    } catch (error) {
      console.error('Error al agregar el niño: ', error);
      return false;
    }
  }

  async updateNiño(niño: Niño): Promise<boolean> {
    const dbName = await this.sqlService.getDbName();

    try {
      const sqlNiño = `
        UPDATE niño
        SET nombres = ?, apepat = ?, apemat = ?, edad = ?, fecha_nac = ?, foto = ?, padre = ?
        WHERE id = ?;
      `;
      const valuesNiño = [
        niño.nombres,
        niño.apellido_paterno,
        niño.apellido_materno || '',
        niño.edad,
        niño.fecha_nac,
        niño.foto,
        niño.idPadre,
        niño.id,
      ];

      await CapacitorSQLite.executeSet({
        database: dbName,
        set: [{ statement: sqlNiño, values: valuesNiño }],
      });

      if (niño.deseo) {
        const sqlDeseo = `
          UPDATE deseo
          SET deseo = ?
          WHERE id_niño = ?;
        `;
        const valuesDeseo = [niño.deseo, niño.id];

        await CapacitorSQLite.executeSet({
          database: dbName,
          set: [{ statement: sqlDeseo, values: valuesDeseo }],
        });
      }

      if (this.sqlService.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }

      return true;
    } catch (error) {
      console.error('Error al actualizar el niño: ', error);
      return false;
    }
  }

  async getNiños(): Promise<Niño[]> {
    const dbName = await this.sqlService.getDbName();
    await CapacitorSQLite.open({ database: dbName });

    try {
      const query = `
        SELECT 
          n.id, n.nombres, n.apepat, n.apemat, n.edad, n.fecha_nac, n.foto, n.padre,
          d.deseo AS deseo
        FROM niño n
        LEFT JOIN deseo d ON n.id = d.id_niño;
      `;

      const result = await CapacitorSQLite.query({
        database: dbName,
        statement: query,
        values: [],
      });

      const niños: Niño[] = result.values.map((row: any) => ({
        id: row.id,
        nombres: row.nombres,
        apellido_paterno: row.apepat,
        apellido_materno: row.apemat,
        edad: row.edad,
        fecha_nac: row.fecha_nac,
        foto: row.foto,
        deseo: row.deseo,
        idPadre: row.padre,
      }));

      return niños;
    } catch (error) {
      console.error('Error al obtener los niños: ', error);
      return [];
    }
  }

  async getNiñoById(id: number): Promise<Niño | null> {
    const dbName = await this.sqlService.getDbName();
    await CapacitorSQLite.open({ database: dbName });

    try {
      const query = `
        SELECT 
          n.id, n.nombres, n.apepat, n.apemat, n.edad, n.fecha_nac, n.foto, n.padre,
          d.descripcion AS deseo
        FROM niño n
        LEFT JOIN deseo d ON n.id = d.niño
        WHERE n.id = ?;
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
      const niño: Niño = {
        id: row.id,
        nombres: row.nombres,
        apellido_paterno: row.apepat,
        apellido_materno: row.apemat,
        edad: row.edad,
        fecha_nac: row.fecha_nac,
        foto: row.foto,
        deseo: row.deseo,
        idPadre: row.padre,
      };

      return niño;
    } catch (error) {
      console.error('Error al obtener el niño por id: ', error);
      return null;
    }
  }

  async getPadreById(niñoId: number): Promise<any | null> {
    const dbName = await this.sqlService.getDbName();
    await CapacitorSQLite.open({ database: dbName });

    try {
      const query = `
        SELECT a.*
        FROM adulto a
        INNER JOIN niño n ON a.id = n.padre
        WHERE n.id = ?;
      `;

      const result = await CapacitorSQLite.query({
        database: dbName,
        statement: query,
        values: [niñoId],
      });

      if (result.values.length === 0) {
        return null;
      }

      return result.values[0];
    } catch (error) {
      console.error('Error al obtener el padre del niño: ', error);
      return null;
    }
  }

  async deleteNiño(id: number): Promise<boolean> {
    const dbName = await this.sqlService.getDbName();

    try {
      const sqlDeseo = `
        DELETE FROM deseo
        WHERE id_niño = ?;
      `;
      await CapacitorSQLite.executeSet({
        database: dbName,
        set: [{ statement: sqlDeseo, values: [id] }],
      });

      const sqlNiño = `
        DELETE FROM niño
        WHERE id = ?;
      `;
      await CapacitorSQLite.executeSet({
        database: dbName,
        set: [{ statement: sqlNiño, values: [id] }],
      });

      if (this.sqlService.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }

      return true;
    } catch (error) {
      console.error('Error al eliminar el niño: ', error);
      return false;
    }
  }

  async generateJson(): Promise<any> {
    const dbName = await this.sqlService.getDbName();
    await CapacitorSQLite.open({ database: dbName });

    try {
      const query = `
        SELECT 
          a.id AS adulto_id,
          a.nombres AS adulto_nombres,
          a.apepat AS adulto_apellido_paterno,
          a.apemat AS adulto_apellido_materno,
          a.fecha_nac AS adulto_fecha_nacimiento,
          a.edad AS adulto_edad,
          a.foto AS adulto_foto,
  
          n.id AS niño_id,
          n.nombres AS niño_nombres,
          n.apepat AS niño_apellido_paterno,
          n.apemat AS niño_apellido_materno,
          n.fecha_nac AS niño_fecha_nacimiento,
          n.edad AS niño_edad,
          n.foto AS niño_foto,
          d.deseo AS niño_deseo,
  
          c.numero AS contacto_numero,
  
          ne.necesidad AS necesidad_descripcion,
          ne.fecha_necesitada AS necesidad_fecha_necesitada,
  
          dir.calle AS direccion_calle,
          dir.numero AS direccion_numero,
          dir.colonia AS direccion_colonia,
          dir.municipio AS direccion_municipio,
          dir.estado AS direccion_estado,
          dir.cp AS direccion_cp,
          dir.coordenada AS direccion_coordenada,
          dir.referecncia AS direccion_referencia,
  
          es.vivienda AS estudio_vivienda,
          es.techo AS estudio_techo,
          es.piso AS estudio_piso,
          es.num_habitaciones AS estudio_num_habitaciones,
          es.combustible AS estudio_combustible,
          es.num_habitantes AS estudio_num_habitantes,
          es.enfermos_cronicos AS estudio_enfermedad_cronica,
          es.num_trabajadores AS estudio_trabajadores,
  
          re.cantidad AS recurso_cantidad,
          re.unidad AS recurso_unidad,
          re.nombre AS recurso_nombre,
          re.descripcion AS recurso_descripcion,
          re.caducidad AS recurso_caducidad
        FROM adulto a
        LEFT JOIN niño n ON n.padre = a.id
        LEFT JOIN deseo d ON d.id_niño = n.id
        LEFT JOIN contacto c ON c.adulto = a.id
        LEFT JOIN necesidad ne ON ne.solicitante = a.id
        LEFT JOIN direccion dir ON dir.adulto = a.id
        LEFT JOIN estudio es ON es.adulto = a.id
        LEFT JOIN recurso re ON re.adulto = a.id;
      `;

      const result = await CapacitorSQLite.query({
        database: dbName,
        statement: query,
        values: [],
      });

      const data = result.values;

      // Estructurar el JSON de forma simplificada
      const jsonResult: any = {};

      data.forEach(row => {
        const adultoKey = `adulto_${row.adulto_id}`;

        // Si no existe el adulto, crear su objeto
        if (!jsonResult[adultoKey]) {
          jsonResult[adultoKey] = {
            nombres: row.adulto_nombres,
            apellido_paterno: row.adulto_apellido_paterno,
            apellido_materno: row.adulto_apellido_materno,
            fecha_nacimiento: row.adulto_fecha_nacimiento,
            edad: row.adulto_edad,
            foto: row.adulto_foto,
            hijos: {},
            contacto: row.contacto_numero ? { numero: row.contacto_numero } : null,
            necesidad: row.necesidad_descripcion
              ? {
                necesidad: row.necesidad_descripcion,
                fecha_requerida: row.necesidad_fecha_necesitada,
              }
              : null,
            direccion: {
              calle: row.direccion_calle,
              numero: row.direccion_numero,
              colonia: row.direccion_colonia,
              municipio: row.direccion_municipio,
              estado: row.direccion_estado,
              cp: row.direccion_cp,
              coordenadas: row.direccion_coordenada
                ? { latitud: row.direccion_coordenada.split(',')[0], longitud: row.direccion_coordenada.split(',')[1] }
                : null,
              referencia: row.direccion_referencia,
            },
            estudio: {
              vivienda: row.estudio_vivienda,
              techo: row.estudio_techo,
              piso: row.estudio_piso,
              num_habitaciones: row.estudio_num_habitaciones,
              combustible_cocina: row.estudio_combustible,
              num_habitantes: row.estudio_num_habitantes,
              enfermedad_cronica: row.estudio_enfermedad_cronica,
              trabajadores: row.estudio_trabajadores,
            },
            recurso: row.recurso_cantidad
              ? {
                cantidad: row.recurso_cantidad,
                unidad: row.recurso_unidad,
                nombre: row.recurso_nombre,
                descripcion: row.recurso_descripcion,
                caducidad: row.recurso_caducidad,
              }
              : null,
          };
        }

        // Si el niño existe, añadirlo al adulto correspondiente
        if (row.niño_id) {
          const hijoKey = `hijo_${row.niño_id}`;
          jsonResult[adultoKey].hijos[hijoKey] = {
            nombres: row.niño_nombres,
            apellido_paterno: row.niño_apellido_paterno,
            apellido_materno: row.niño_apellido_materno,
            fecha_nacimiento: row.niño_fecha_nacimiento,
            edad: row.niño_edad,
            foto: row.niño_foto,
            deseo: row.niño_deseo,
          };
        }
      });

      return jsonResult;
    } catch (error) {
      console.error('Error al generar el JSON: ', error);
      return null;
    }
  }
}  