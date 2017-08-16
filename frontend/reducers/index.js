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
            return newState;
        case 'LOGOUT':
            return {};
        default:
            return state;
    }
}

const loader = (state = { loaded: false, bookLoaded: false, streamLoaded: false }, action) => {
  const newState = Object.assign({}, state);
  switch (action.type) {
    case 'LOADED':
        console.log('loaded is now ' + !newState.loaded + ' (should only be true on book page!)')
        newState.loaded = !newState.loaded;
        return newState;
    case 'BOOKLOADED':
        newState.bookLoaded = !newState.bookLoaded;
        return newState;
    case 'STREAMLOADED':
        console.log('streamLoaded is now ' + !newState.streamLoaded + ' (should only be true on students page!)')
        newState.streamLoaded = !newState.streamLoaded;
        return newState;
    default:
      return state;
  }
}

const search = (state = {}, action) => {
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
    search,
});

export default rootReducer;
