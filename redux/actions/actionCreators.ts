import {
    SET_DATA_TOOLTIP,
    CLEAR_DATA_TOOLTIP
} from "./actions";
import { IItemsData } from "../../helpers/interfaces";

export const setDataTooltip = (payload): {type: typeof SET_DATA_TOOLTIP, payload: IItemsData} => ({
    type: SET_DATA_TOOLTIP,
    payload
});
export const clearDataTooltip = (): {type: typeof CLEAR_DATA_TOOLTIP} => ({
    type: CLEAR_DATA_TOOLTIP,
});
