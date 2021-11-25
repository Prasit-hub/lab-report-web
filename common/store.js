import { combineReducers, createStore } from 'redux'
import authReducer from '../aaa/auth-reducer'
import commonReducer from './common-reducer'
import {MakeStore, createWrapper, Context, HYDRATE} from 'next-redux-wrapper';

const reducers =  combineReducers({ 
    auth: authReducer,
    common: commonReducer,

 });


const makeStore = (context) => {
    return createStore(reducers);
};

const wrapper = createWrapper(makeStore, { debug: false})

export default wrapper;
