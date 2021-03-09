import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  constructor(private translateService: TranslateService,) { }

  ngOnInit() {}

  changeLang() {
    this.translateService.use(this.translateService.currentLang === 'en' ? 'ru' : 'en');
  }

}
