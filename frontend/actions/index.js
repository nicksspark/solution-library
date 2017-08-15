// Action Creators

// import * as types from './types';
const login = (user, token) => {
  return {
    type: 'LOGIN',
    user: user,
    token: token
  };
};

const logout = () => {
    return {
        type: 'LOGOUT'
    }
}

const loaded = () => {
    return {
        type: 'LOADED'
    }
}

const search = (value) => {
    return {
        type: 'SEARCH',
        value: value
    }
}

const bookLoaded = () => {
    return {
        type: 'BOOKLOADED'
    }
}

const streamLoaded = () => {
    return {
        type: 'STREAMLOADED'
    }
}

const actions = {
    login,
    logout,
    loaded,
    search,
    bookLoaded,
    streamLoaded
}

export default actions;
