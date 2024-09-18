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

  async addChild(child: {
    nombres: string;
    apepat: string;
    apemat: string;
    edad: number;
    fecha_nac: string;
    deseo: string;
    foto: string;
  }) {
    let sql =
      'INSERT INTO children (nombres, apepat, apemat, edad, fecha_nac, deseo, foto) VALUES (?, ?, ?, ?, ?, ?, ?);';
    const dbName = await this.getDbName();
    const values = [
      child.nombres,
      child.apepat,
      child.apemat,
      child.edad,
      child.fecha_nac,
      child.deseo,
      child.foto,
    ];
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: values,
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

  async getChild(): Promise<any[]> {
    let sql = 'SELECT * FROM children';
    const dbName = await this.getDbName();
    await CapacitorSQLite.open({ database: dbName });
  
    try {
      const response = await CapacitorSQLite.query({
        database: dbName,
        statement: sql,
        values: [],
      });
  
      if (this.isIOS && response.values.length > 0) {
        response.values.shift();
      }
  
      return response.values as any[];
    } catch (err) {
      console.error('Error querying database:', err);
      return [];
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
