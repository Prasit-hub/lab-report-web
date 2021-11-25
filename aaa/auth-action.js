import { LOGGED_IN, LOGGED_OUT } from '../common/action-type'

export const loggedIn = (auth) => ({
    type: LOGGED_IN,
    auth: auth
});

export const loggedOut = () => ({
    type: LOGGED_OUT
});

