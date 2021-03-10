import {Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import Photo from '../../shared/model/Photo';
import {ActionSheetController, Platform, ToastController} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {CameraResultType, CameraSource, Capacitor, Plugins} from '@capacitor/core';
import TravelItem from '../../shared/model/TravelItem';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {take} from 'rxjs/operators';
import {AppState} from '../../store/state/app.state';
import {Store} from '@ngrx/store';
import {selectSelectedItem} from '../../store/travel-item.selector';
import {AddTravelItem, SelectItem} from '../../store/travel-item.action';
import {Subscription} from 'rxjs';

declare const window: any;
const VK = window.VK;

const photoCode = 4;
@Component({
  selector: 'app-add-travel-item',
  templateUrl: './add-travel-item.page.html',
  styleUrls: ['./add-travel-item.page.scss'],
})
export class AddTravelItemPage implements OnInit, OnDestroy {
  name: string;
  photos: Photo[] = [];
  date: string;
  isMobile: boolean;
  chosenImageIndex = 0;
  isShow: boolean;
  vkAuthResponse: any;
  selectedItem$ = this.store$.select(selectSelectedItem);
  subscription: Subscription = new Subscription();
  @ViewChild('filePicker') filePicker: ElementRef<HTMLInputElement>;


  constructor(private actionSheetController: ActionSheetController,
              private httpClient: HttpClient,
              private toastController: ToastController,
              private translateService: TranslateService,
              private platform: Platform,
              private activatedRoute: ActivatedRoute,
              private store$: Store<AppState>,
              private ngZone: NgZone) {
  }

  ngOnInit() {
    this.isMobile = this.platform.is('mobile') && this.platform.is('hybrid');
    this.isShow = false;
    this.activatedRoute.params.subscribe(data => {
      if (data && data.id) {
        this.isShow = true;
      }
    });
    this.subscription.add(this.selectedItem$.subscribe(travelItem => {
      if (travelItem) {
        this.fillForm(travelItem);
      }
    }));
  }

  ngOnDestroy(): void {
    this.store$.dispatch(new SelectItem(null));
    this.subscription.unsubscribe();
    this.actionSheetController.dismiss()
        .then(data => {})
        .catch(err => {});
  }

  async addItem() {
    if (!this.date) {
      const msg = await this.translateService.get('ITEM.ERROR_MSG_DATE').pipe(take(1)).toPromise();
      this.toastMessage(msg);
      return;
    } else if (!this.name) {
      const msg = await this.translateService.get('ITEM.ERROR_MSG_NAME').pipe(take(1)).toPromise();
      this.toastMessage(msg);
      return;
    }
    const travelItem = new TravelItem(this.name, this.date, Math.floor(Math.random() * 10000), this.photos);
    this.store$.dispatch(new AddTravelItem(travelItem));
    const successMsg = await this.translateService.get('ITEM.SUCCESS_ADD').pipe(take(1)).toPromise();
    this.toastMessage(successMsg);
    this.clear();
  }

  removeImage() {
    this.photos.splice(this.chosenImageIndex, 1);
    if (this.chosenImageIndex === this.photos.length) {
      this.chosenImageIndex--;
    }
  }

  setNewImageIndex(index: number) {
    this.chosenImageIndex = index;
  }

  async openImagePicker() {
    if (this.isShow) {
      return;
    }
    const buttons = [{
      text: await this.translateService.get('IMAGE.FILE_SYSTEM').pipe(take(1)).toPromise(),
      icon: 'laptop-outline',
      handler: () => {
        this.filePicker.nativeElement.click();
      }
    }, {
      text: await this.translateService.get('IMAGE.VK').pipe(take(1)).toPromise(),
      icon: 'logo-vk',
      handler: () => {
        if (!this.vkAuthResponse) {
          VK.Auth.login(response => {
            if (response.session) {
              this.vkAuthResponse = response;
              this.loginToast(response.session.user.first_name, response.session.user.last_name);
              this.getImagesFromVk();
            }
          }, photoCode);
        } else {
          this.getImagesFromVk();
        }
      }
    }, {
      text: await this.translateService.get('IMAGE.CAMERA').pipe(take(1)).toPromise(),
      icon: 'camera-outline',
      handler: () => {
        this.getImagesFromCamera();
      }
    }, {
      text: await this.translateService.get('IMAGE.CANCEL_BUTTON').pipe(take(1)).toPromise(),
      icon: 'close',
      role: 'cancel',
    }];
    if (!this.isMobile) {
      buttons.splice(2, 1);
    }
    this.actionSheetController.create({
      header: await this.translateService.get('ITEM.FIELD_PICTURES').pipe(take(1)).toPromise(),
      buttons: [...buttons]
    }).then(picker => picker.present());
  }

  clear() {
    this.name = '';
    this.photos = [];
    this.date = null;
  }

  onFilesChosen(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files || (files && files.length === 0)) {
      return;
    }
    const fileReader = new FileReader();
    this.readFile(0, files, fileReader);
  }

  private readFile(index: number, files: FileList, reader: FileReader) {
    if (index >= files.length) {
      return;
    }
    reader.onload = (event) => {
      const photo = new Photo(event.target.result.toString(), files[index].name);
      this.photos.push(photo);
      this.readFile(index + 1, files, reader);
    };
    reader.readAsDataURL(files[index]);
  }

  private async getImagesFromCamera() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.toastController.create({
        message: await this.translateService.get('IMAGE.CAMERA_NOT_AVAILABLE').pipe(take(1)).toPromise(),
        duration: 4000
      }).then(toast => toast.present());
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Camera,
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.DataUrl,
    }).then(image => {
      const photo = new Photo(image.dataUrl, '');
      this.photos.push(photo);
    }).catch(error => {
      this.toastController.create({
        message: error,
        duration: 4000
      }).then(toast => toast.present());
    });
  }

  private getImagesFromVk() {
    VK.Api.call('photos.getAll', {
          access_token: this.vkAuthResponse.session.sid,
          v: '5.126',
          owner_id: this.vkAuthResponse.session.user.id,
          skip_hidden: 0,
          count: 200,
          offset: 0,
        }, (response) => {
          if (response.response.items && response.response.items.length > 0) {
            response.response.items.forEach(image => {
              this.getImageFieldsFromVk(image, (photo: Photo) => {
                this.photos.push(photo);
                this.ngZone.run(() => {}); // bad solution
              });
            });
          }
        });
  }

  private async loginToast(firstName: string, lastName: string) {
    this.toastController.create({
      message: await this.translateService.get('VK.LOGIN_SUCCESS', {firstName, lastName}).pipe(take(1)).toPromise(),
      duration: 4000
    }).then(toast => toast.present());
  }

  private toastMessage(msg) {
    this.toastController.create({
      message: msg,
      duration: 3000
    }).then(toast => toast.present());
  }

  private getImageFieldsFromVk(item: any, callback: (photo: Photo) => void) {
    const maxWidth = Math.max(...item.sizes.map(sizeItem => sizeItem.width));
    const searchedIndex = item.sizes.findIndex(size => size.width === maxWidth);
    this.getBase64FromSrc(item.sizes[searchedIndex].url, (base64: string) => {
      callback(new Photo(base64, item.text));
    });
  }

  private getBase64FromSrc(src: string, callback: (base64: string) => void) {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      callback(dataURL); // the base64 string

    };
    img.setAttribute('crossOrigin', 'anonymous'); //
    img.src = src;
  }

  private fillForm(travelItem: TravelItem) {
    this.name = travelItem.name;
    this.photos = travelItem.photos;
    this.date = travelItem.travelDate;
  }
}
