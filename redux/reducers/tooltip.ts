import { Action, AnyAction } from "redux";
import { SET_DATA_TOOLTIP, CLEAR_DATA_TOOLTIP } from "../actions/actions";
import { IItemsData } from "../../helpers/interfaces";
import { HYDRATE } from 'next-redux-wrapper';

type SetDataTooltip = Action<typeof SET_DATA_TOOLTIP> & { payload: IItemsData };
type ClearDataTooltip = Action<typeof CLEAR_DATA_TOOLTIP> & { payload: {} };

type GeneralType = SetDataTooltip | ClearDataTooltip | AnyAction;

const reducer = (state = {} as IItemsData, action: GeneralType) => {
    switch (action.type) {
        case HYDRATE:
            return { ...state, ...action.payload.tooltip };
        case SET_DATA_TOOLTIP:
            return { ...state, ...action.payload };
        case CLEAR_DATA_TOOLTIP:
            return {} as IItemsData;
        default:
            return { ...state };
    }
};

export default reducer;
