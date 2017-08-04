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

const actions = {
    login,
    logout,
    loaded
}

export default actions;
