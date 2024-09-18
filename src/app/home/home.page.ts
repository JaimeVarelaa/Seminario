import { Component, OnInit } from '@angular/core';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public initPage: boolean = true;

  public language: string;
  public languages: string[];

  constructor(
    private sqlite: SqliteService
  ) {
    this.language = '';
    this.languages = [];
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.initPage = false;
    }, 3000);
  }
}