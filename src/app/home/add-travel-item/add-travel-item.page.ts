import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import Photo from '../../shared/model/Photo';
import {ActionSheetController, Platform, ToastController} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {CameraResultType, CameraSource, Capacitor, Plugins} from '@capacitor/core';
import TravelsService from '../../core/service/TravelsService';
import TravelItem from '../../shared/model/TravelItem';
import {ActivatedRoute} from '@angular/router';

declare const window: any;
const VK = window.VK;

const photoCode = 4;
@Component({
  selector: 'app-add-travel-item',
  templateUrl: './add-travel-item.page.html',
  styleUrls: ['./add-travel-item.page.scss'],
})
export class AddTravelItemPage implements OnInit {
  name: string;
  photos: Photo[] = [];
  date: string;
  isMobile: boolean;
  chosenImageIndex = 0;
  isShow: boolean;
  vkAuthResponse: any;

  @ViewChild('filePicker') filePicker: ElementRef<HTMLInputElement>;


  constructor(private actionSheetController: ActionSheetController,
              private httpClient: HttpClient,
              private travelsService: TravelsService,
              private toastController: ToastController,
              private platform: Platform,
              private activatedRoute: ActivatedRoute,
              private ngZone: NgZone) {
  }

  ngOnInit() {
    this.isMobile = this.platform.is('mobile') && this.platform.is('hybrid');
    this.isShow = false;
    this.activatedRoute.params.subscribe(data => {
      if (data && data.id) {
        this.getTravelItem(data.id);
      }
    });
  }

  addItem() {
    if (!this.date) {
      this.toastMessage('Please, fill the date of a travel');
      return;
    } else if (!this.name) {
      this.toastMessage('Please, fill the name of a travel');
      return;
    }
    const travelItem = new TravelItem(this.name, this.date, Math.floor(Math.random() * 10000), this.photos);
    this.travelsService.addTravelItem(travelItem);
    this.toastMessage('New travel item was added!');
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

  openImagePicker() {
    if (this.isShow) {
      return;
    }
    const buttons = [{
      text: 'From file system',
      icon: 'laptop-outline',
      handler: () => {
        this.filePicker.nativeElement.click();
      }
    }, {
      text: 'From VK',
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
      text: 'From Camera',
      icon: 'camera-outline',
      handler: () => {
        this.getImagesFromCamera();
      }
    }, {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
    }];
    if (!this.isMobile) {
      buttons.splice(2, 1);
    }
    this.actionSheetController.create({
      header: 'Download pictures',
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

  private getImagesFromCamera() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.toastController.create({
        message: 'Camera is not available',
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

  private loginToast(firstName: string, lastName: string) {
    this.toastController.create({
      message: `You are logged as ${firstName} ${lastName}`,
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

  private getTravelItem(id: number) {
    this.travelsService.getTravelsItems().subscribe(data => {
      const item = data.find(travelItem => travelItem.id === +id);
      if (item) {
        this.fillForm(item);
        this.isShow = true;
      }
    });
  }

  private fillForm(travelItem: TravelItem) {
    this.name = travelItem.name;
    this.photos = travelItem.photos;
    this.date = travelItem.travelDate;
  }
}
