import { LOADING } from './action-type'

export const loading = (isLoading) => ({
    type: LOADING,
    isLoading: isLoading
});
