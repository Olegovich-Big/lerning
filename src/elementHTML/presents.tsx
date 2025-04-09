import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import '../styles/presentation.css';
import SlideElement from './components/SlideElement';
import SlideThumbnail from './components/SlideThumbnail';
import Workspace from './components/Workspace';
import Editor from '../components/Editor';
import { 
  Presentation, 
  Slide, 
  BackgroundType, 
  ElementType, 
  TextObj, 
  ImgObj,
  Background
} from '../test';

function Presents() {
  // Создаем пустую презентацию
  const [presentation, setPresentation] = useState<Presentation>({
    title: "Новая презентация",
    slides: [],
    sizeWorkspace: { width: 800, height: 600 }
  });
  
  // Состояние для текущего выбранного слайда
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(-1);
  
  // Состояние для редактирования имени презентации
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  
  // Получение текущего слайда
  const currentSlide = 
    currentSlideIndex >= 0 && presentation.slides.length > currentSlideIndex 
      ? presentation.slides[currentSlideIndex] 
      : null;
  
  // Функция создания нового слайда
  const addNewSlide = () => {
    const newSlide: Slide = {
      id: uuidv4(),
      elements: [],
      background: { type: BackgroundType.color, color: '#FFFFFF' }
    };
    
    const newSlides = [...presentation.slides, newSlide];
    setPresentation({...presentation, slides: newSlides});
    setCurrentSlideIndex(newSlides.length - 1);
  };
  
  // Функция удаления слайда
  const deleteSlide = (slideIndex: number) => {
    if (slideIndex < 0 || slideIndex >= presentation.slides.length) return;
    
    const newSlides = [...presentation.slides];
    newSlides.splice(slideIndex, 1);
    
    setPresentation({...presentation, slides: newSlides});
    
    // Корректируем текущий индекс слайда
    if (currentSlideIndex >= newSlides.length) {
      setCurrentSlideIndex(newSlides.length > 0 ? newSlides.length - 1 : -1);
    }
  };
  
  // Функция изменения названия презентации
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPresentation({...presentation, title: e.target.value});
  };
  
  // Функция добавления текста
  const addText = () => {
    if (!currentSlide) return;
    
    const newTextElement: TextObj = {
      id: uuidv4(),
      type: ElementType.text,
      text: "Новый текст",
      fontSize: 16,
      fontFamily: "Arial",
      color: "#000000",
      pos: { x: 50, y: 50 },
      size: { width: 200, height: 100 }
    };
    
    const updatedSlide = {
      ...currentSlide,
      elements: [...currentSlide.elements, newTextElement]
    };
    
    const newSlides = [...presentation.slides];
    newSlides[currentSlideIndex] = updatedSlide;
    
    setPresentation({...presentation, slides: newSlides});
  };
  
  // Функция добавления изображения
  const addImage = () => {
    if (!currentSlide) return;
    
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
          
          const newImageElement: ImgObj = {
            id: uuidv4(),
            type: ElementType.image,
            src: event.target.result as string,
            pos: { x: 50, y: 150 },
            size: { width: 300, height: 200 }
          };
          
          const updatedSlide = {
            ...currentSlide!,
            elements: [...currentSlide!.elements, newImageElement]
          };
          
          const newSlides = [...presentation.slides];
          newSlides[currentSlideIndex] = updatedSlide;
          
          setPresentation({...presentation, slides: newSlides});
        };
        
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };
  
  // Функция удаления элемента
  const deleteElement = (elementId: string) => {
    if (!currentSlide) return;
    
    const updatedElements = currentSlide.elements.filter(el => el.id !== elementId);
    
    const updatedSlide = {
      ...currentSlide,
      elements: updatedElements
    };
    
    const newSlides = [...presentation.slides];
    newSlides[currentSlideIndex] = updatedSlide;
    
    setPresentation({...presentation, slides: newSlides});
  };
  
  // Функция обновления текста элемента
  const updateElementText = (elementId: string, newText: string) => {
    if (!currentSlide) return;
    
    const updatedElements = currentSlide.elements.map(element => 
      element.id === elementId && element.type === ElementType.text
        ? { ...element, text: newText } as TextObj
        : element
    );
    
    const updatedSlide = {
      ...currentSlide,
      elements: updatedElements
    };
    
    const newSlides = [...presentation.slides];
    newSlides[currentSlideIndex] = updatedSlide;
    
    setPresentation({...presentation, slides: newSlides});
  };
  
  // Функция обновления позиции элемента
  const updateElementPosition = (elementId: string, x: number, y: number) => {
    if (!currentSlide) return;
    
    const updatedElements = currentSlide.elements.map(element => 
      element.id === elementId
        ? { ...element, pos: { x, y } }
        : element
    );
    
    const updatedSlide = {
      ...currentSlide,
      elements: updatedElements
    };
    
    const newSlides = [...presentation.slides];
    newSlides[currentSlideIndex] = updatedSlide;
    
    setPresentation({...presentation, slides: newSlides});
  };
  
  // Функция изменения фона слайда
  const changeBackground = (backgroundType: BackgroundType) => {
    if (!currentSlide) return;
    
    let newBackground: Background;
    
    switch (backgroundType) {
      case BackgroundType.color:
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.value = '#FFFFFF';
        
        colorPicker.onchange = (e: Event) => {
          const target = e.target as HTMLInputElement;
          
          newBackground = {
            type: BackgroundType.color,
            color: target.value
          };
          
          updateSlideBackground(newBackground);
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
              
              newBackground = {
                type: BackgroundType.image,
                url: event.target.result as string
              };
              
              updateSlideBackground(newBackground);
            };
            
            reader.readAsDataURL(file);
          }
        };
        
        input.click();
        break;
    }
  };
  
  // Вспомогательная функция для обновления фона слайда
  const updateSlideBackground = (background: Background) => {
    if (!currentSlide) return;
    
    const updatedSlide = {
      ...currentSlide,
      background: background
    };
    
    const newSlides = [...presentation.slides];
    newSlides[currentSlideIndex] = updatedSlide;
    
    setPresentation({...presentation, slides: newSlides});
  };
  
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
            onBlur={() => setIsEditingTitle(false)}
            autoFocus
          />
        ) : (
          <div 
            className="presentation-title" 
            onClick={() => setIsEditingTitle(true)}
          >
            {presentation.title}
          </div>
        )}
        <div className="presentation-actions">
          <button className="toolbar-button">Экспорт</button>
        </div>
      </div>
      
      {/* Основное содержимое */}
      <div className="presentation-body">
        {/* Боковая панель со слайдами */}
        <div className="slides-sidebar">
          <button className="add-slide-button" onClick={addNewSlide}>+ Добавить слайд</button>
          
          {presentation.slides.map((slide, index) => (
            <div key={slide.id} className="slide-thumbnail-container">
              <SlideThumbnail 
                slide={slide}
                index={index}
                isActive={index === currentSlideIndex}
                onClick={() => setCurrentSlideIndex(index)}
              />
              <button 
                className="delete-slide-button"
                onClick={() => deleteSlide(index)}
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
                <button onClick={addText} className="tool-button">Добавить текст</button>
                <button onClick={addImage} className="tool-button">Добавить изображение</button>
                <div className="background-tools">
                  <button className="tool-button">Фон</button>
                  <div className="background-dropdown">
                    <button onClick={() => changeBackground(BackgroundType.color)}>Цвет</button>
                    <button onClick={() => changeBackground(BackgroundType.image)}>Изображение</button>
                  </div>
                </div>
              </div>
              <Workspace 
                currentSlide={currentSlide}
                workspaceSize={presentation.sizeWorkspace}
                onDeleteElement={deleteElement}
                onUpdateElementText={updateElementText}
                onUpdateElementPosition={updateElementPosition}
              />
            </>
          ) : (
            <div className="empty-workspace">
              <div className="create-slide-container">
                <p>Нет выбранного слайда</p>
                <button onClick={addNewSlide} className="add-slide-button">Создать новый слайд</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Presents;