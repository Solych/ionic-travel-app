import {Action} from '@ngrx/store';
import TravelItem from '../shared/model/TravelItem';

export enum ETravelItemActions {
    SetTravelItems = '[Travel Item] Set Items',
    AddTravelItem = '[Travel Item] Add Item',
    SelectItem = '[Travel Item] Select Item',
}

export class AddTravelItem implements Action {
    public readonly type = ETravelItemActions.AddTravelItem;
    constructor(public payload: TravelItem) {}
}

export class SetTravelItems implements Action {
    public readonly type = ETravelItemActions.SetTravelItems;
    constructor(public payload: TravelItem[]) {}
}

export class SelectItem implements Action {
    public readonly type = ETravelItemActions.SelectItem;
    constructor(public payload: TravelItem) {}
}

export type TravelItemActions = SetTravelItems | AddTravelItem | SelectItem;
