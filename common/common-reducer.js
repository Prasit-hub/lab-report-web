import { LOADING } from './action-type'
import { HYDRATE } from 'next-redux-wrapper'; 

const initialState = {
    isLoading: false
};

function commonReducer(state = initialState, action) {

    switch (action.type) {

        case HYDRATE: {
            return {
                ...state,
                isLoading: action.payload.common.isLoading
            }
        }
        case LOADING: {

            return {
                ...state,
                isLoading: action.isLoading
            }
        }
        default:
            return initialState;
    }
}

export default commonReducer;