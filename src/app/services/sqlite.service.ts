import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  capSQLiteChanges,
  capSQLiteValues,
} from '@capacitor-community/sqlite';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { JsonSQLite } from 'jeep-sqlite/dist/types/interfaces/interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  public dbReady: BehaviorSubject<boolean>;
  public isWeb: boolean;
  public isIOS: boolean;

  public dbName: string;

  constructor(private http: HttpClient) {
    this.dbReady = new BehaviorSubject(false);
    this.isWeb = false;
    this.isIOS = false;
    this.dbName = '';
  }

  async init() {
    const info = await Device.getInfo();
    const sqlite = CapacitorSQLite as any;

    if (info.platform == 'android') {
      try {
        await sqlite.requestPermissions();
      } catch (error) {
        console.error('Esta app necesita permisos para funcionar');
      }
    } else if (info.platform == 'web') {
      this.isWeb = true;
      await sqlite.initWebStore();
    } else if (info.platform == 'ios') {
      this.isIOS = true;
    }

    this.setupDatabase();
  }

  async setupDatabase() {
    const dbSetup = await Preferences.get({ key: 'first_setup_key' });

    if (!dbSetup.value) {
      this.downloadDatabase();
    } else {
      this.dbName = await this.getDbName();
      await CapacitorSQLite.createConnection({ database: this.dbName });
      await CapacitorSQLite.open({ database: this.dbName });
      this.dbReady.next(true);
    }
  }

  downloadDatabase() {
    this.http
      .get('assets/db/db.json')
      .subscribe(async (jsonExport: JsonSQLite) => {
        const jsonstring = JSON.stringify(jsonExport);
        const isValid = await CapacitorSQLite.isJsonValid({ jsonstring });

        if (isValid.result) {
          this.dbName = jsonExport.database;
          await CapacitorSQLite.importFromJson({ jsonstring });
          await CapacitorSQLite.createConnection({ database: this.dbName });
          await CapacitorSQLite.open({ database: this.dbName });

          await Preferences.set({ key: 'first_setup_key', value: '1' });
          await Preferences.set({ key: 'dbname', value: this.dbName });

          this.dbReady.next(true);
        }
      });
  }

  async getDbName() {
    if (!this.dbName) {
      const dbname = await Preferences.get({ key: 'dbname' });
      if (dbname.value) {
        this.dbName = dbname.value;
      }
    }
    return this.dbName;
  }

  async addChild(childData: any) {
    console.log(childData);
    const dbName = await this.getDbName();

    const maxIdQuery = await CapacitorSQLite.query({
      database: dbName,
      statement: 'SELECT MAX(id) AS maxId FROM children',
      values: [],
    });

    let newId = 1;
    if (maxIdQuery.values.length > 0 && maxIdQuery.values[0].maxId != null) {
      newId = maxIdQuery.values[0].maxId + 1;
    }

    const sqlChild =
      'INSERT INTO children (id, nombres, apepat, apemat, edad, fecha_nac, deseo, foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
    const valuesChild = [
      newId,
      childData.nombres,
      childData.apepat,
      childData.apemat,
      childData.edad,
      childData.fecha_nac,
      childData.deseo,
      childData.foto,
    ];

    const childInsertResult = await CapacitorSQLite.executeSet({
      database: dbName,
      set: [{ statement: sqlChild, values: valuesChild }],
    });

    const sqlVivienda =
      'INSERT INTO vivienda (child_id, direccion, techo, piso, habitaciones, combustible, personas) VALUES (?, ?, ?, ?, ?, ?, ?);';
    const valuesVivienda = [
      newId,
      childData.direccion,
      childData.techo,
      childData.piso,
      childData.habitaciones,
      childData.combustible,
      childData.personas,
    ];

    await CapacitorSQLite.executeSet({
      database: dbName,
      set: [{ statement: sqlVivienda, values: valuesVivienda }],
    });

    const sqlSalud =
      'INSERT INTO salud (child_id, enfermedad_cronica) VALUES (?, ?);';
    const valuesSalud = [newId, childData.enfermedad_cronica];

    await CapacitorSQLite.executeSet({
      database: dbName,
      set: [{ statement: sqlSalud, values: valuesSalud }],
    });

    const sqlFamilia =
      'INSERT INTO familia (child_id, personas_trabajan) VALUES (?, ?);';
    const valuesFamilia = [newId, childData.personas_trabajan];

    await CapacitorSQLite.executeSet({
      database: dbName,
      set: [{ statement: sqlFamilia, values: valuesFamilia }],
    });

    if (this.isWeb) {
      CapacitorSQLite.saveToStore({ database: dbName });
    }

    return childInsertResult;
  }

  async getChildren(): Promise<any[]> {
    const dbName = await this.getDbName();
    await CapacitorSQLite.open({ database: dbName });

    try {
      const childrenQuery = await CapacitorSQLite.query({
        database: dbName,
        statement: 'SELECT * FROM children',
        values: [],
      });

      if (childrenQuery.values.length === 0) {
        return [];
      }

      const childrenData = await Promise.all(
        childrenQuery.values.map(async (child) => {
          const viviendaQuery = await CapacitorSQLite.query({
            database: dbName,
            statement: 'SELECT * FROM vivienda WHERE child_id = ?',
            values: [child.id],
          });
          const viviendaData = viviendaQuery.values[0] || {};

          const saludQuery = await CapacitorSQLite.query({
            database: dbName,
            statement: 'SELECT * FROM salud WHERE child_id = ?',
            values: [child.id],
          });
          const saludData = saludQuery.values[0] || {};

          const familiaQuery = await CapacitorSQLite.query({
            database: dbName,
            statement: 'SELECT * FROM familia WHERE child_id = ?',
            values: [child.id],
          });
          const familiaData = familiaQuery.values[0] || {};

          return {
            id: child.id,
            nombres: child.nombres,
            apepat: child.apepat,
            apemat: child.apemat,
            edad: child.edad,
            fecha_nac: child.fecha_nac,
            deseo: child.deseo,
            foto: child.foto,
            direccion: viviendaData.direccion,
            techo: viviendaData.techo,
            piso: viviendaData.piso,
            habitaciones: viviendaData.habitaciones,
            combustible: viviendaData.combustible,
            personas: viviendaData.personas,
            enfermedad_cronica: saludData.enfermedad_cronica,
            personas_trabajan: familiaData.personas_trabajan,
          };
        })
      );

      return childrenData;
    } catch (err) {
      console.error('Error querying database:', err);
      return [];
    }
  }

  async deleteChild(id: number): Promise<boolean> {
    const dbName = await this.getDbName();

    const sqlStatements = [
      {
        statement: 'DELETE FROM children WHERE id = ?',
        values: [id],
      },
      {
        statement: 'DELETE FROM vivienda WHERE child_id = ?',
        values: [id],
      },
      {
        statement: 'DELETE FROM salud WHERE child_id = ?',
        values: [id],
      },
      {
        statement: 'DELETE FROM familia WHERE child_id = ?',
        values: [id],
      },
    ];

    try {
      const result = await CapacitorSQLite.executeSet({
        database: dbName,
        set: sqlStatements,
      });

      if (this.isWeb) {
        await CapacitorSQLite.saveToStore({ database: dbName });
      }

      if (result.changes && result.changes.changes > 0) {
        console.log(`Niño con ID ${id} eliminado correctamente.`);
        return true;
      } else {
        console.warn(`No se encontró ningún niño con ID ${id} para eliminar.`);
        return false;
      }
    } catch (error) {
      console.error('Error al eliminar el niño:', error);
      return false;
    }
  }


  async create(language: string) {
    let sql = 'INSERT INTO languages VALUES(?)';
    const dbName = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [language],
        },
      ],
    })
      .then((changes: capSQLiteChanges) => {
        if (this.isWeb) {
          CapacitorSQLite.saveToStore({ database: dbName });
        }
        return changes;
      })
      .catch((err) => Promise.reject(err));
  }

  async read() {
    let sql = 'SELECT * FROM languages';
    const dbName = await this.getDbName();
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [],
    })
      .then((response: capSQLiteValues) => {
        let languages: string[] = [];
        if (this.isIOS && response.values.length > 0) {
          response.values.shift();
        }

        for (let index = 0; index < response.values.length; index++) {
          const language = response.values[index];
          languages.push(language.name);
        }
        return languages;
      })
      .catch((err) => Promise.reject(err));
  }

  async update(newLanguage: string, originalLanguage: string) {
    let sql = 'UPDATE languages SET name=? WHERE name=?';
    const dbName = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [newLanguage, originalLanguage],
        },
      ],
    })
      .then((changes: capSQLiteChanges) => {
        if (this.isWeb) {
          CapacitorSQLite.saveToStore({ database: dbName });
        }
        return changes;
      })
      .catch((err) => Promise.reject(err));
  }

  async delete(language: string) {
    let sql = 'DELETE FROM languages WHERE name=?';
    const dbName = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [language],
        },
      ],
    })
      .then((changes: capSQLiteChanges) => {
        if (this.isWeb) {
          CapacitorSQLite.saveToStore({ database: dbName });
        }
        return changes;
      })
      .catch((err) => Promise.reject(err));
  }
}
