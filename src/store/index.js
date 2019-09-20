import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { all } from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';
import { persistStore } from 'redux-persist';
import persistReducers from './persistReducers';

import auth from './reducers/auth';
import user from './reducers/user';
import authSaga from './sagas/auth';
import userSaga from './sagas/user';

const sagaMiddleware = createSagaMiddleware({
  sagaMonitor: (() => {
    if (process.env.NODE_ENV === 'development') {
      return console.tron.createSagaMonitor();
    }
    return null;
  })(),
});

const enhancer = (() => {
  if (process.env.NODE_ENV === 'development') {
    return compose(
      console.tron.createEnhancer(),
      applyMiddleware(sagaMiddleware)
    );
  }
  return applyMiddleware(sagaMiddleware);
})();

const store = createStore(
  persistReducers(combineReducers({ auth, user })),
  enhancer
);
const persistor = persistStore(store);

sagaMiddleware.run(function* rootSaga() {
  return yield all([authSaga, userSaga]);
});

export { store, persistor };
