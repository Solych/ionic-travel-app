import {ETravelItemActions, TravelItemActions} from '../travel-item.action';
import {initialTravelItemState, TravelItemState} from '../state/travel-item.state';

export const travelItemReducer = (state = initialTravelItemState, action: TravelItemActions): TravelItemState =>  {
    switch (action.type) {
        case ETravelItemActions.AddTravelItem: {
            state.travelItems.push(action.payload);
            return {
                ...state,
            };
        }

        case ETravelItemActions.SetTravelItems: {
            return {
                ...state,
                travelItems: action.payload
            };
        }

        case ETravelItemActions.SelectItem: {
            return {
                ...state,
                selectedItem: action.payload
            };
        }
        default: return state;
    }
};
