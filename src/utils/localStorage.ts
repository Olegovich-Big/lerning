import { Presentation } from '../test';

const STORAGE_KEY = 'presentation_data';

/**
 * Сохраняет презентацию в localStorage
 * @param presentation - объект презентации
 */
export const saveToLocalStorage = (presentation: Presentation): void => {
  try {
    const serializedData = JSON.stringify(presentation);
    localStorage.setItem(STORAGE_KEY, serializedData);
  } catch (error) {
    console.error('Ошибка при сохранении в localStorage:', error);
  }
};

/**
 * Загружает презентацию из localStorage
 * @returns объект презентации или null, если данные не найдены
 */
export const loadFromLocalStorage = (): Presentation | null => {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (!serializedData) {
      return null;
    }
    return JSON.parse(serializedData) as Presentation;
  } catch (error) {
    console.error('Ошибка при загрузке из localStorage:', error);
    return null;
  }
};

/**
 * Удаляет сохраненные данные из localStorage
 */
export const clearLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Ошибка при очистке localStorage:', error);
  }
};

/**
 * Проверяет, есть ли сохраненная презентация в localStorage
 * @returns true, если данные найдены
 */
export const hasLocalStorageData = (): boolean => {
  return localStorage.getItem(STORAGE_KEY) !== null;
}; 