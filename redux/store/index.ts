import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { createWrapper, HYDRATE } from 'next-redux-wrapper';

import TooltipReducer from "../reducers/tooltip";

const rootReducer = combineReducers({
    tooltip: TooltipReducer
});

export type RootState = ReturnType<typeof rootReducer>;

const store = () => createStore(
    rootReducer
);

export const wrapper = createWrapper(() => store(), {debug: true});

export default store;
