import {AppState} from '../state/app.state';
import {travelItemReducer} from './travel-item.reducer';
import {ActionReducerMap} from '@ngrx/store';

export const appReducers: ActionReducerMap<AppState, any> = {
    travelItems: travelItemReducer,
};
