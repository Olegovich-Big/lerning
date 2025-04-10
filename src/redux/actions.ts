import { v4 as uuidv4 } from 'uuid';
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
import { 
  Presentation, 
  Slide, 
  Background,
  TextObj,
  ImgObj,
  BackgroundType,
  ElementType
} from '../test';
import { HistoryItem } from './reducers';

// Действия для презентации
export const setPresentation = (presentation: Presentation) => ({
  type: SET_PRESENTATION,
  payload: presentation
});

export const changeTitle = (title: string) => ({
  type: CHANGE_TITLE,
  payload: title
});

export const addSlide = () => ({
  type: ADD_SLIDE,
  payload: {
    id: uuidv4(),
    elements: [],
    background: { type: BackgroundType.color, color: '#FFFFFF' }
  }
});

export const deleteSlide = (slideIndex: number) => ({
  type: DELETE_SLIDE,
  payload: slideIndex
});

export const moveSlide = (fromIndex: number, toIndex: number) => ({
  type: MOVE_SLIDE,
  payload: { fromIndex, toIndex }
});

export const updateSlideBackground = (slideIndex: number, background: Background) => ({
  type: UPDATE_SLIDE_BACKGROUND,
  payload: { slideIndex, background }
});

// Действия для элементов слайда
export const addText = (slideIndex: number) => ({
  type: ADD_TEXT,
  payload: {
    slideIndex,
    textElement: {
      id: uuidv4(),
      type: ElementType.text,
      text: "Новый текст",
      fontSize: 16,
      fontFamily: "Arial",
      color: "#000000",
      pos: { x: 50, y: 50 },
      size: { width: 200, height: 100 }
    }
  }
});

export const addImage = (slideIndex: number, src: string) => ({
  type: ADD_IMAGE,
  payload: {
    slideIndex,
    imageElement: {
      id: uuidv4(),
      type: ElementType.image,
      src,
      pos: { x: 50, y: 150 },
      size: { width: 300, height: 200 }
    }
  }
});

export const deleteElement = (slideIndex: number, elementId: string) => ({
  type: DELETE_ELEMENT,
  payload: { slideIndex, elementId }
});

export const updateElementText = (slideIndex: number, elementId: string, text: string) => ({
  type: UPDATE_ELEMENT_TEXT,
  payload: { slideIndex, elementId, text }
});

export const updateElementPosition = (slideIndex: number, elementId: string, x: number, y: number) => ({
  type: UPDATE_ELEMENT_POSITION,
  payload: { slideIndex, elementId, x, y }
});

export const updateElementSize = (slideIndex: number, elementId: string, width: number, height: number) => ({
  type: UPDATE_ELEMENT_SIZE,
  payload: { slideIndex, elementId, width, height }
});

// Действия для UI состояния
export const setCurrentSlideIndex = (index: number) => ({
  type: SET_CURRENT_SLIDE_INDEX,
  payload: index
});

export const setSelectedElementId = (id: string | null) => ({
  type: SET_SELECTED_ELEMENT_ID,
  payload: id
});

export const setValidationError = (error: string | null) => ({
  type: SET_VALIDATION_ERROR,
  payload: error
});

export const setEditingTitle = (isEditing: boolean) => ({
  type: SET_EDITING_TITLE,
  payload: isEditing
});

export const setDraggedSlideIndex = (index: number | null) => ({
  type: SET_DRAGGED_SLIDE_INDEX,
  payload: index
});

// Действия для функционала Undo/Redo
export const addHistoryItem = (historyItem: HistoryItem) => ({
  type: ADD_HISTORY_ITEM,
  payload: historyItem
});

export const undo = (historyItem: HistoryItem) => ({
  type: UNDO,
  payload: historyItem
});

export const redo = (historyItem: HistoryItem) => ({
  type: REDO,
  payload: historyItem
}); 