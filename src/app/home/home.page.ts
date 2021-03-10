import {Component, OnDestroy, OnInit} from '@angular/core';
import TravelItem from '../shared/model/TravelItem';
import {ActivatedRoute, Router} from '@angular/router';
import {Loader} from '@googlemaps/js-api-loader';
import {TranslateService} from '@ngx-translate/core';
import {select, Store} from '@ngrx/store';
import {selectTravelItemsList} from '../store/travel-item.selector';
import {SelectItem} from '../store/travel-item.action';
import {AppState} from '../store/state/app.state';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  travels: TravelItem[];
  key = 'AIzaSyBQalm_qQouXdg8b4RF4CRCIjGKORpf_eE';
  isClosedMap = true;
  public items$ = this.store$.pipe(select(selectTravelItemsList));
  constructor(private router: Router,
              private translateService: TranslateService,
              private activatedRoute: ActivatedRoute,
              private store$: Store<AppState>) {}

  ngOnInit() {
    this.translateService.use('en');
  }

  ngOnDestroy(): void {
    this.closeMap();
  }

  showDetails(travelItem: TravelItem) {
    this.store$.dispatch(new SelectItem(travelItem));
    this.router.navigate(['show', travelItem.id], {relativeTo: this.activatedRoute});
  }

  createNewTravelItem() {
    this.router.navigate(['add'], {relativeTo: this.activatedRoute});
  }

  closeMap() {
    this.isClosedMap = true;
  }

  showGoogleMaps(travelItem: TravelItem, event: Event) {
    this.isClosedMap = false;
    event.stopPropagation();
    setTimeout(() => {
      const loader = new Loader({
        apiKey: this.key,
        version: 'weekly',
        language: this.translateService.currentLang.toUpperCase(),
        libraries: ['places'],
      });
      loader.load().then(() => {
        const win = window as any;
        const googleModule = win.google;
        const map = new googleModule.maps.Map(document.getElementById('map') as HTMLElement, {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 6,
        });
        if (!map) {
          setTimeout(() => {

          }, 300);
        }
        const request = {
          query: travelItem.name,
          fields: ['name', 'geometry'],
        };

        const service = new googleModule.maps.places.PlacesService(map);
        service.findPlaceFromQuery(request, (results, status) => {
          if (status === googleModule.maps.places.PlacesServiceStatus.OK) {
            map.setCenter(results[0].geometry.location);
          }
        });
      });
    }, 300);
  }

}
