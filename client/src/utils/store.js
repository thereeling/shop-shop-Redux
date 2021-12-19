import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { reducer } from './reducers';

const rootReducer =  combineReducers({
    shop: reducer
});


const configureStore = () => {
    return createStore(
        rootReducer,
        compose(applyMiddleware(thunk))
    );
};

export default configureStore;