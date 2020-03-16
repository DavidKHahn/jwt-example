import { combineReducers } from 'redux';
import authReducer from './authReducer';

const appReducer = combineReducers({
    auth: authReducer,
});

const rootReducer = (state, action) => {
     // if (action.type === 'RESET_REDUX') {    // reset redux
    //   state = undefined
    // }
    return appReducer(state, action);  // TODO: uncomment this once reducers become available
}

export default rootReducer;
