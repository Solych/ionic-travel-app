import {ChosenLang} from '../../shared/enum/ChosenLang';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class I18nService {
    private lang: ChosenLang;

    constructor() {
        this.lang = ChosenLang.EN;
    }

    getLanguage() {
        return this.lang;
    }

    setLanguage(language: ChosenLang) {
        this.lang = language;
    }
}
