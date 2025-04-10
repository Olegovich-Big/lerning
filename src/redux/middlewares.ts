import { saveToLocalStorage } from '../utils/localStorage';
import { 
  SET_VALIDATION_ERROR, 
  SET_PRESENTATION,
  UNDO, 
  REDO, 
  ADD_HISTORY_ITEM,
  CHANGE_TITLE,
  ADD_SLIDE,
  DELETE_SLIDE,
  MOVE_SLIDE,
  UPDATE_SLIDE_BACKGROUND,
  ADD_TEXT,
  ADD_IMAGE,
  DELETE_ELEMENT,
  UPDATE_ELEMENT_TEXT,
  UPDATE_ELEMENT_POSITION,
  UPDATE_ELEMENT_SIZE
} from './actionTypes';
import { RootState } from './reducers';
import { validatePresentationData } from '../utils/validator';
import { addHistoryItem, undo, redo } from './actions';

// Список действий, которые нужно отслеживать для истории
const HISTORY_ACTIONS = [
  CHANGE_TITLE,
  ADD_SLIDE,
  DELETE_SLIDE,
  MOVE_SLIDE,
  UPDATE_SLIDE_BACKGROUND,
  ADD_TEXT,
  ADD_IMAGE,
  DELETE_ELEMENT,
  UPDATE_ELEMENT_TEXT,
  UPDATE_ELEMENT_POSITION,
  UPDATE_ELEMENT_SIZE
];

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
  // При установке новой презентации проверяем её на валидность
  if (action.type === SET_PRESENTATION) {
    try {
      validatePresentationData(action.payload);
    } catch (error) {
      // Если данные не валидны, отправляем сообщение об ошибке
      if (error instanceof Error) {
        store.dispatch({
          type: SET_VALIDATION_ERROR,
          payload: error.message
        });
      } else {
        store.dispatch({
          type: SET_VALIDATION_ERROR,
          payload: 'Неизвестная ошибка валидации данных'
        });
      }
      // Не вызываем next, чтобы действие не дошло до редьюсера
      return;
    }
  }
  
  return next(action);
};

// Middleware для управления историей
export const historyMiddleware = (store: any) => (next: any) => (action: any) => {
  const currentState = store.getState();
  
  // Обрабатываем Undo/Redo
  if (action.type === UNDO) {
    const { history } = currentState;
    if (history.past.length === 0) return next(action);
    
    // Получаем последнюю запись из истории
    const previousState = history.past[history.past.length - 1];
    
    // Отправляем действие undo с данными из истории
    return next(undo(previousState));
  }
  
  if (action.type === REDO) {
    const { history } = currentState;
    if (history.future.length === 0) return next(action);
    
    // Получаем следующую запись из будущего
    const nextState = history.future[0];
    
    // Отправляем действие redo с данными из истории
    return next(redo(nextState));
  }
  
  // Пропускаем создание записи для самих действий истории
  if (action.type === ADD_HISTORY_ITEM || action.type === UNDO || action.type === REDO) {
    return next(action);
  }
  
  // Создаем запись в истории для отслеживаемых действий
  if (HISTORY_ACTIONS.includes(action.type)) {
    const result = next(action);
    const newState = store.getState();
    
    // Сохраняем текущее состояние и UI-контекст
    const historyItem = {
      presentationState: { ...newState.presentation },
      uiState: {
        currentSlideIndex: newState.ui.currentSlideIndex,
        selectedElementId: newState.ui.selectedElementId
      },
      actionType: action.type
    };
    
    store.dispatch(addHistoryItem(historyItem));
    return result;
  }
  
  return next(action);
}; 