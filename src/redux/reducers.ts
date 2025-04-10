import { combineReducers } from 'redux';
import {
  SET_PRESENTATION,
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
  UPDATE_ELEMENT_SIZE,
  SET_CURRENT_SLIDE_INDEX,
  SET_SELECTED_ELEMENT_ID,
  SET_VALIDATION_ERROR,
  SET_EDITING_TITLE,
  SET_DRAGGED_SLIDE_INDEX,
  UNDO,
  REDO,
  ADD_HISTORY_ITEM
} from './actionTypes';
import { Presentation, ElementType } from '../test';

// Максимальный размер истории
const MAX_HISTORY_LENGTH = 50;

// Начальное состояние презентации
const initialPresentationState: Presentation = {
  title: "Новая презентация",
  slides: [],
  sizeWorkspace: { width: 800, height: 600 }
};

// Начальное UI состояние
const initialUIState = {
  currentSlideIndex: -1,
  selectedElementId: null as string | null,
  isEditingTitle: false,
  draggedSlideIndex: null as number | null,
  validationError: null as string | null
};

// Начальное состояние истории
const initialHistoryState = {
  past: [] as HistoryItem[],
  future: [] as HistoryItem[]
};

// Тип записи в истории
export interface HistoryItem {
  presentationState: Presentation;
  uiState: {
    currentSlideIndex: number;
    selectedElementId: string | null;
  };
  actionType: string;
}

// Редьюсер для презентации
const presentationReducer = (state = initialPresentationState, action: any): Presentation => {
  switch (action.type) {
    case SET_PRESENTATION:
      return action.payload;
      
    case CHANGE_TITLE:
      return {
        ...state,
        title: action.payload
      };
      
    case ADD_SLIDE:
      return {
        ...state,
        slides: [...state.slides, action.payload]
      };
      
    case DELETE_SLIDE: {
      const newSlides = [...state.slides];
      newSlides.splice(action.payload, 1);
      return {
        ...state,
        slides: newSlides
      };
    }
      
    case MOVE_SLIDE: {
      const { fromIndex, toIndex } = action.payload;
      const newSlides = [...state.slides];
      const [movedSlide] = newSlides.splice(fromIndex, 1);
      newSlides.splice(toIndex, 0, movedSlide);
      return {
        ...state,
        slides: newSlides
      };
    }
      
    case UPDATE_SLIDE_BACKGROUND: {
      const { slideIndex, background } = action.payload;
      const newSlides = [...state.slides];
      newSlides[slideIndex] = {
        ...newSlides[slideIndex],
        background
      };
      return {
        ...state,
        slides: newSlides
      };
    }
      
    case ADD_TEXT: {
      const { slideIndex, textElement } = action.payload;
      const newSlides = [...state.slides];
      newSlides[slideIndex] = {
        ...newSlides[slideIndex],
        elements: [...newSlides[slideIndex].elements, textElement]
      };
      return {
        ...state,
        slides: newSlides
      };
    }
      
    case ADD_IMAGE: {
      const { slideIndex, imageElement } = action.payload;
      const newSlides = [...state.slides];
      newSlides[slideIndex] = {
        ...newSlides[slideIndex],
        elements: [...newSlides[slideIndex].elements, imageElement]
      };
      return {
        ...state,
        slides: newSlides
      };
    }
      
    case DELETE_ELEMENT: {
      const { slideIndex, elementId } = action.payload;
      const newSlides = [...state.slides];
      newSlides[slideIndex] = {
        ...newSlides[slideIndex],
        elements: newSlides[slideIndex].elements.filter(el => el.id !== elementId)
      };
      return {
        ...state,
        slides: newSlides
      };
    }
      
    case UPDATE_ELEMENT_TEXT: {
      const { slideIndex, elementId, text } = action.payload;
      const newSlides = [...state.slides];
      newSlides[slideIndex] = {
        ...newSlides[slideIndex],
        elements: newSlides[slideIndex].elements.map(element => 
          element.id === elementId && element.type === ElementType.text
            ? { ...element, text }
            : element
        )
      };
      return {
        ...state,
        slides: newSlides
      };
    }
      
    case UPDATE_ELEMENT_POSITION: {
      const { slideIndex, elementId, x, y } = action.payload;
      const newSlides = [...state.slides];
      newSlides[slideIndex] = {
        ...newSlides[slideIndex],
        elements: newSlides[slideIndex].elements.map(element => 
          element.id === elementId
            ? { ...element, pos: { x, y } }
            : element
        )
      };
      return {
        ...state,
        slides: newSlides
      };
    }
      
    case UPDATE_ELEMENT_SIZE: {
      const { slideIndex, elementId, width, height } = action.payload;
      const newSlides = [...state.slides];
      newSlides[slideIndex] = {
        ...newSlides[slideIndex],
        elements: newSlides[slideIndex].elements.map(element => 
          element.id === elementId
            ? { ...element, size: { width, height } }
            : element
        )
      };
      return {
        ...state,
        slides: newSlides
      };
    }
    
    case UNDO:
    case REDO:
      // Возвращаем состояние презентации из записи истории
      if (action.payload && action.payload.presentationState) {
        return action.payload.presentationState;
      }
      return state;
      
    default:
      return state;
  }
};

// Редьюсер для UI состояния
const uiReducer = (state = initialUIState, action: any) => {
  switch (action.type) {
    case SET_CURRENT_SLIDE_INDEX:
      return {
        ...state,
        currentSlideIndex: action.payload
      };
      
    case SET_SELECTED_ELEMENT_ID:
      return {
        ...state,
        selectedElementId: action.payload
      };
      
    case SET_VALIDATION_ERROR:
      return {
        ...state,
        validationError: action.payload
      };
      
    case SET_EDITING_TITLE:
      return {
        ...state,
        isEditingTitle: action.payload
      };
      
    case SET_DRAGGED_SLIDE_INDEX:
      return {
        ...state,
        draggedSlideIndex: action.payload
      };
      
    // Автоматическое обновление currentSlideIndex при удалении слайда
    case DELETE_SLIDE: {
      if (state.currentSlideIndex === action.payload) {
        // Если удаляем текущий слайд
        return {
          ...state,
          currentSlideIndex: -1 // Сбрасываем индекс
        };
      } else if (state.currentSlideIndex > action.payload) {
        // Если удаляем слайд перед текущим, сдвигаем индекс
        return {
          ...state,
          currentSlideIndex: state.currentSlideIndex - 1
        };
      }
      return state;
    }
      
    // Обновление currentSlideIndex при перемещении слайдов
    case MOVE_SLIDE: {
      const { fromIndex, toIndex } = action.payload;
      if (state.currentSlideIndex === fromIndex) {
        // Если перемещаем текущий слайд
        return {
          ...state,
          currentSlideIndex: toIndex
        };
      } else if (
        state.currentSlideIndex > fromIndex && 
        state.currentSlideIndex <= toIndex
      ) {
        // Если перемещаем слайд до текущего после текущего
        return {
          ...state,
          currentSlideIndex: state.currentSlideIndex - 1
        };
      } else if (
        state.currentSlideIndex < fromIndex && 
        state.currentSlideIndex >= toIndex
      ) {
        // Если перемещаем слайд после текущего до текущего
        return {
          ...state,
          currentSlideIndex: state.currentSlideIndex + 1
        };
      }
      return state;
    }
    
    case UNDO:
    case REDO:
      // Восстанавливаем UI состояние из записи истории
      if (action.payload) {
        return {
          ...state,
          currentSlideIndex: action.payload.uiState.currentSlideIndex,
          selectedElementId: action.payload.uiState.selectedElementId
        };
      }
      return state;
      
    default:
      return state;
  }
};

// Редьюсер для истории
const historyReducer = (state = initialHistoryState, action: any) => {
  switch (action.type) {
    case ADD_HISTORY_ITEM:
      // Если запись одинаковая с последней - не добавляем
      if (
        state.past.length > 0 && 
        action.payload.actionType === state.past[state.past.length - 1].actionType
      ) {
        return state;
      }
      
      // Добавляем новую запись в историю и очищаем будущее
      return {
        past: [
          ...state.past.slice(-MAX_HISTORY_LENGTH + 1), // Ограничиваем размер истории
          action.payload
        ],
        future: []
      };
      
    case UNDO:
      if (state.past.length === 0) return state;
      
      // Получаем последнюю запись из прошлого
      const previous = state.past[state.past.length - 1];
      
      // Перемещаем из прошлого в будущее
      return {
        past: state.past.slice(0, -1),
        future: [previous, ...state.future]
      };
      
    case REDO:
      if (state.future.length === 0) return state;
      
      // Получаем первую запись из будущего
      const next = state.future[0];
      
      // Перемещаем из будущего в прошлое
      return {
        past: [...state.past, next],
        future: state.future.slice(1)
      };
      
    default:
      // Очищаем историю при загрузке новой презентации
      if (action.type === SET_PRESENTATION) {
        return initialHistoryState;
      }
      return state;
  }
};

// Комбинируем редьюсеры
const rootReducer = combineReducers({
  presentation: presentationReducer,
  ui: uiReducer,
  history: historyReducer
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>; 