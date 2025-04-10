import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../styles/presentation.css';
import SlideElement from './components/SlideElement';
import SlideThumbnail from './components/SlideThumbnail';
import Workspace from './components/Workspace';
import Editor from '../components/Editor';
import { 
  BackgroundType, 
  ElementType,
  Background,
  SolidBackground,
  ImageBackground
} from '../test';
import { loadFromLocalStorage, hasLocalStorageData } from '../utils/localStorage';
import { exportPresentation, importPresentation } from '../utils/fileOperations';
import { validateAndGetPresentation } from '../utils/validator';
import { RootState } from '../redux/reducers';
import {
  setPresentation,
  changeTitle,
  addSlide,
  deleteSlide,
  moveSlide,
  updateSlideBackground,
  addText,
  addImage,
  deleteElement,
  updateElementText,
  updateElementPosition,
  updateElementSize,
  setCurrentSlideIndex,
  setSelectedElementId,
  setValidationError,
  setEditingTitle,
  setDraggedSlideIndex
} from '../redux/actions';

function Presents() {
  const dispatch = useDispatch();
  
  // Получаем данные из Redux-стейта
  const presentation = useSelector((state: RootState) => state.presentation);
  const {
    currentSlideIndex,
    selectedElementId,
    isEditingTitle,
    draggedSlideIndex,
    validationError
  } = useSelector((state: RootState) => state.ui);
  
  // Получение текущего слайда
  const currentSlide = 
    currentSlideIndex >= 0 && presentation.slides.length > currentSlideIndex 
      ? presentation.slides[currentSlideIndex] 
      : null;
  
  // Загрузка данных из localStorage при монтировании
  useEffect(() => {
    if (hasLocalStorageData()) {
      try {
        const savedData = loadFromLocalStorage();
        if (savedData) {
          // Проверяем валидность данных перед загрузкой
          try {
            const validatedData = validateAndGetPresentation(savedData);
            dispatch(setPresentation(validatedData));
            dispatch(setValidationError(null));
            // Установка первого слайда как активного, если он есть
            if (validatedData.slides.length > 0) {
              dispatch(setCurrentSlideIndex(0));
            }
          } catch (error) {
            if (error instanceof Error) {
              dispatch(setValidationError(error.message));
            } else {
              dispatch(setValidationError('Ошибка валидации данных'));
            }
            console.error('Ошибка валидации данных из localStorage:', error);
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке из localStorage:', error);
      }
    }
  }, [dispatch]);
  
  // Функция создания нового слайда
  const handleAddNewSlide = () => {
    dispatch(addSlide());
    if (presentation.slides.length === 0) {
      dispatch(setCurrentSlideIndex(0));
    } else {
      dispatch(setCurrentSlideIndex(presentation.slides.length));
    }
  };
  
  // Функция удаления слайда
  const handleDeleteSlide = (slideIndex: number) => {
    if (slideIndex < 0 || slideIndex >= presentation.slides.length) return;
    
    dispatch(deleteSlide(slideIndex));
    
    // Корректируем текущий индекс слайда
    if (currentSlideIndex >= presentation.slides.length - 1) {
      const newSlideIndex = presentation.slides.length > 1 ? presentation.slides.length - 2 : -1;
      dispatch(setCurrentSlideIndex(newSlideIndex));
    }
  };
  
  // Функция изменения названия презентации
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeTitle(e.target.value));
  };
  
  // Функция добавления текста
  const handleAddText = () => {
    if (currentSlideIndex === -1) return;
    dispatch(addText(currentSlideIndex));
  };
  
  // Функция добавления изображения
  const handleAddImage = () => {
    if (currentSlideIndex === -1) return;
    
    // Открываем диалог выбора файла
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        const reader = new FileReader();
        
        reader.onload = (event) => {
          if (!event.target) return;
          
          const src = event.target.result as string;
          dispatch(addImage(currentSlideIndex, src));
        };
        
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };
  
  // Функция удаления элемента
  const handleDeleteElement = (elementId: string) => {
    if (currentSlideIndex === -1) return;
    dispatch(deleteElement(currentSlideIndex, elementId));
  };
  
  // Функция обновления текста элемента
  const handleUpdateElementText = (elementId: string, text: string) => {
    if (currentSlideIndex === -1) return;
    dispatch(updateElementText(currentSlideIndex, elementId, text));
  };
  
  // Функция обновления позиции элемента
  const handleUpdateElementPosition = (elementId: string, x: number, y: number) => {
    if (currentSlideIndex === -1) return;
    dispatch(updateElementPosition(currentSlideIndex, elementId, x, y));
  };
  
  // Функция обновления размера элемента
  const handleUpdateElementSize = (elementId: string, width: number, height: number) => {
    if (currentSlideIndex === -1) return;
    dispatch(updateElementSize(currentSlideIndex, elementId, width, height));
  };
  
  // Функция изменения фона слайда
  const handleChangeBackground = (backgroundType: BackgroundType) => {
    if (currentSlideIndex === -1) return;
    
    switch (backgroundType) {
      case BackgroundType.color:
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.value = '#FFFFFF';
        
        colorPicker.onchange = (e: Event) => {
          const target = e.target as HTMLInputElement;
          
          const newBackground: SolidBackground = {
            type: BackgroundType.color,
            color: target.value
          };
          
          dispatch(updateSlideBackground(currentSlideIndex, newBackground));
        };
        
        colorPicker.click();
        break;
        
      case BackgroundType.image:
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (e: Event) => {
          const target = e.target as HTMLInputElement;
          if (target.files && target.files[0]) {
            const file = target.files[0];
            const reader = new FileReader();
            
            reader.onload = (event) => {
              if (!event.target) return;
              
              const newBackground: ImageBackground = {
                type: BackgroundType.image,
                url: event.target.result as string
              };
              
              dispatch(updateSlideBackground(currentSlideIndex, newBackground));
            };
            
            reader.readAsDataURL(file);
          }
        };
        
        input.click();
        break;
    }
  };
  
  // Обработчики для перетаскивания слайдов
  const handleSlideDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dispatch(setDraggedSlideIndex(index));
  };

  const handleSlideDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSlideDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    
    if (draggedSlideIndex !== null && draggedSlideIndex !== targetIndex) {
      dispatch(moveSlide(draggedSlideIndex, targetIndex));
      dispatch(setDraggedSlideIndex(null));
    }
  };
  
  // Функция выбора элемента
  const handleSelectElement = (elementId: string) => {
    dispatch(setSelectedElementId(elementId));
  };
  
  // Функция клика по рабочей области
  const handleWorkspaceClick = () => {
    dispatch(setSelectedElementId(null));
  };
  
  // Функция экспорта презентации
  const handleExport = () => {
    try {
      exportPresentation(presentation);
    } catch (error) {
      console.error('Ошибка при экспорте презентации:', error);
      alert('Ошибка при экспорте презентации');
    }
  };
  
  // Функция импорта презентации
  const handleImport = async () => {
    try {
      const importedData = await importPresentation();
      
      // Валидация импортированных данных
      try {
        const validatedData = validateAndGetPresentation(importedData);
        dispatch(setPresentation(validatedData));
        dispatch(setValidationError(null));
        
        // Установка первого слайда как активного, если он есть
        if (validatedData.slides.length > 0) {
          dispatch(setCurrentSlideIndex(0));
        } else {
          dispatch(setCurrentSlideIndex(-1));
        }
      } catch (error) {
        if (error instanceof Error) {
          dispatch(setValidationError(error.message));
        } else {
          dispatch(setValidationError('Ошибка валидации импортированных данных'));
        }
        console.error('Ошибка валидации импортированных данных:', error);
        alert('Импортированный файл не соответствует формату презентации');
      }
    } catch (error) {
      console.error('Ошибка при импорте презентации:', error);
      alert('Ошибка при импорте презентации');
    }
  };
  
  // В render оставляем интерфейс тем же, но меняем обработчики на связанные с Redux
  return (
    <div className="presentation-container">
      {/* Заголовок презентации */}
      <div className="presentation-header">
        {isEditingTitle ? (
          <input 
            type="text" 
            className="presentation-title" 
            value={presentation.title} 
            onChange={handleTitleChange} 
            onBlur={() => dispatch(setEditingTitle(false))}
            onKeyDown={(e) => e.key === 'Enter' && dispatch(setEditingTitle(false))}
            autoFocus
          />
        ) : (
          <div 
            className="presentation-title" 
            onClick={() => dispatch(setEditingTitle(true))}
          >
            {presentation.title}
          </div>
        )}
        <div className="presentation-actions">
          <button className="toolbar-button" onClick={handleExport}>Экспорт</button>
          <button className="toolbar-button" onClick={handleImport}>Импорт</button>
        </div>
      </div>
      
      {/* Отображение ошибок валидации */}
      {validationError && (
        <div className="validation-error">
          Ошибка: {validationError}
          <button onClick={() => dispatch(setValidationError(null))}>✕</button>
        </div>
      )}
      
      {/* Основное содержимое */}
      <div className="presentation-body">
        {/* Боковая панель со слайдами */}
        <div className="slides-sidebar">
          <button className="add-slide-button" onClick={handleAddNewSlide}>+ Добавить слайд</button>
          
          {presentation.slides.map((slide, index) => (
            <div key={slide.id} className="slide-thumbnail-container">
              <SlideThumbnail 
                slide={slide}
                index={index}
                isActive={index === currentSlideIndex}
                onClick={() => dispatch(setCurrentSlideIndex(index))}
                onDragStart={(e, idx) => handleSlideDragStart(e, idx)}
                onDragOver={handleSlideDragOver}
                onDrop={(e, idx) => handleSlideDrop(e, idx)}
              />
              <button 
                className="delete-slide-button"
                onClick={() => handleDeleteSlide(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        {/* Рабочая область */}
        <div className="workspace-container">
          {currentSlide ? (
            <>
              <div className="slide-tools">
                <button onClick={handleAddText} className="tool-button">Добавить текст</button>
                <button onClick={handleAddImage} className="tool-button">Добавить изображение</button>
                <div className="background-tools">
                  <button className="tool-button">Фон</button>
                  <div className="background-dropdown">
                    <button onClick={() => handleChangeBackground(BackgroundType.color)}>Цвет</button>
                    <button onClick={() => handleChangeBackground(BackgroundType.image)}>Изображение</button>
                  </div>
                </div>
                {selectedElementId && (
                  <button 
                    onClick={() => handleDeleteElement(selectedElementId)} 
                    className="tool-button"
                  >
                    Удалить элемент
                  </button>
                )}
              </div>
              <Workspace 
                currentSlide={currentSlide}
                workspaceSize={presentation.sizeWorkspace}
                onDeleteElement={handleDeleteElement}
                onUpdateElementText={handleUpdateElementText}
                onUpdateElementPosition={handleUpdateElementPosition}
                onUpdateElementSize={handleUpdateElementSize}
                selectedElementId={selectedElementId}
                onSelectElement={handleSelectElement}
                onWorkspaceClick={handleWorkspaceClick}
              />
            </>
          ) : (
            <div className="empty-workspace">
              <div className="create-slide-container">
                <p>Нет выбранного слайда</p>
                <button onClick={handleAddNewSlide} className="add-slide-button">Создать новый слайд</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Presents;