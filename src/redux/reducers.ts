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
  SET_DRAGGED_SLIDE_INDEX
} from './actionTypes';
import { Presentation, ElementType } from '../test';

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
      
    // Устанавливаем индекс на новый слайд после его добавления
    case ADD_SLIDE: {
      const slidesCount = action.getState ? 
        action.getState().presentation.slides.length : 0;
        
      return {
        ...state,
        currentSlideIndex: slidesCount
      };
    }
      
    default:
      return state;
  }
};

// Корневой редьюсер
const rootReducer = combineReducers({
  presentation: presentationReducer,
  ui: uiReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer; 