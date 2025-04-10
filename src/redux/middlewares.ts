import { saveToLocalStorage } from '../utils/localStorage';
import { SET_VALIDATION_ERROR } from './actionTypes';
import { RootState } from './reducers';
import { validatePresentationData } from '../utils/validator';

// Middleware для автоматического сохранения в localStorage
export const localStorageMiddleware = (store: any) => (next: any) => (action: any) => {
  // Пропускаем действие через редьюсеры
  const result = next(action);
  
  // После обновления состояния сохраняем презентацию в localStorage
  const currentState: RootState = store.getState();
  saveToLocalStorage(currentState.presentation);
  
  return result;
};

// Middleware для валидации данных
export const validationMiddleware = (store: any) => (next: any) => (action: any) => {
  // Пропускаем действие через редьюсеры
  const result = next(action);
  
  // Для определенных действий, которые модифицируют данные, проверяем валидность
  if (
    action.type !== SET_VALIDATION_ERROR && 
    action.type.startsWith('SET_') === false && 
    action.type.startsWith('UPDATE_') === false
  ) {
    const currentState: RootState = store.getState();
    const validation = validatePresentationData(currentState.presentation);
    
    if (!validation.valid) {
      // Если валидация не прошла, отправляем действие с ошибкой
      store.dispatch({
        type: SET_VALIDATION_ERROR,
        payload: validation.errors.join(', ')
      });
    } else if (currentState.ui.validationError) {
      // Если ошибки были, но сейчас всё в порядке, очищаем их
      store.dispatch({
        type: SET_VALIDATION_ERROR,
        payload: null
      });
    }
  }
  
  return result;
}; 