import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

// export type reducerStateType = {
//     +titleReducer: object
// };

const reducer = (state = {}, action) => {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'LOGIN':
            newState.user = action.user;
            newState.token = action.token;
            console.log('logged in', newState.token);
            return newState;
        case 'LOGOUT':
            return {};
        default:
            return state;
    }
}

const loader = (state = { loaded: false }, action) => {
  const newState = state;
  switch (action.type) {
    case 'LOADED':
      return { loaded: !newState.loaded };
    default:
      return state;
  }
}

const search = (state = {}, action) => {
    console.log('got to reducer');
    let newState = Object.assign({}, state);
    switch (action.type) {
        case 'SEARCH':
            return { value: action.value };
        default:
            return newState;
    }
}

const rootReducer = combineReducers({
    reducer,
    router,
    loader,
    search
});

export default rootReducer;
