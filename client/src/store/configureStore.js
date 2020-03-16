import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from 'sagas/sagas';
import rootReducer from './reducer';

export default function createStoreWithMiddleware(history, data) {
    // Sync dispatched route actions to the history
    const reduxRouterMiddleware = routerMiddleware(history);
    const sagaMiddleware = createSagaMiddleware();
    const middleware = [reduxRouterMiddleware, sagaMiddleware];

    const composeEnhancers = window._REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(rootReducer, data, composeEnhancers(
        applyMiddleware(...middleware),
    ));

    sagaMiddleware.run(rootSaga);

    return store;
}
