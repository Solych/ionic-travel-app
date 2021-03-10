import {createSelector} from '@ngrx/store';
import {AppState} from './state/app.state';
import {TravelItemState} from './state/travel-item.state';

const selectTravelItems = (state: AppState) => state.travelItems;

export const selectTravelItemsList = createSelector(selectTravelItems, (state: TravelItemState) => state.travelItems);
export const selectSelectedItem = createSelector(selectTravelItems, (state: TravelItemState) => state.selectedItem);
