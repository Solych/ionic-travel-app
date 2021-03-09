import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddTravelItemPage } from './add-travel-item.page';

describe('AddTravelItemPage', () => {
  let component: AddTravelItemPage;
  let fixture: ComponentFixture<AddTravelItemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTravelItemPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTravelItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
