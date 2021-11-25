import { LOGGED_IN, LOGGED_OUT } from "../common/action-type";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  isLoggedIn: false,
  token: null,
  username: null
};

function authReducer(state = initialState, action) {

  switch (action.type) {
    case HYDRATE: {
      const nextState = {
        ...state,

        isLoggedIn: action.payload.auth.isLoggedIn,
        username: action.payload.auth.username ? action.payload.auth.username : "",
        token: action.payload.auth.token ? action.payload.auth.token : null,
    
      };

      return nextState;
    }
    case LOGGED_IN: {
      const nextState = {
        ...state,

        isLoggedIn: true,
        username: action.auth.username ? action.auth.username : "",
        token: action.auth.token ? action.auth.token : null,
        };

      return nextState;
    }
    case LOGGED_OUT: {
      const nextState = {
        ...state,

        isLoggedIn: false,
        token: null,
        username: null,
      };

      return nextState;
    }
    default:
      return state;
  }
}

export default authReducer;
