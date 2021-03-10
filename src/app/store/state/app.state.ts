import {initialTravelItemState, TravelItemState} from './travel-item.state';

export interface AppState {
    travelItems: TravelItemState;
}

export const initialAppState: AppState = {
    travelItems: initialTravelItemState,
};
