import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducers';
import { localStorageMiddleware, validationMiddleware, historyMiddleware } from './middlewares';

// Проверяем наличие Redux DevTools Extension для улучшенной отладки
const composeEnhancers = 
  typeof window === 'object' && 
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? 
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : 
    compose;

// Применяем мидлвары
const enhancer = composeEnhancers(
  applyMiddleware(
    historyMiddleware, // Должен быть первым для корректного захвата состояния
    localStorageMiddleware,
    validationMiddleware
  )
);

// Создаем хранилище Redux
const store = createStore(rootReducer, enhancer);

export default store; 