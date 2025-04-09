import React, { useState } from 'react';
import { minimalPresentation, maxPresentation, presentationWithEmptySlide } from '../data/presentation-data';
import '../styles/presentation.css';
import SlideElement from './components/SlideElement';
import SlideThumbnail from './components/SlideThumbnail';
import Workspace from './components/Workspace';
import { Presentation } from '../test';

function Presents() {
  // Начальное состояние - выбираем, какие данные использовать (minimal, maximal или with empty slide)
  const [dataType, setDataType] = useState<'minimal' | 'maximal' | 'empty'>('maximal');
  
  // Выбор презентации в зависимости от типа данных
  const getPresentation = (): Presentation => {
    switch (dataType) {
      case 'minimal':
        return minimalPresentation;
      case 'maximal':
        return maxPresentation;
      case 'empty':
        return presentationWithEmptySlide;
    }
  };
  
  const presentation = getPresentation();
  
  // Состояние для текущего выбранного слайда
  const [currentSlideIndex, setCurrentSlideIndex] = useState(
    presentation.slides.length > 0 ? 0 : -1
  );
  
  // Получение текущего слайда
  const currentSlide = 
    currentSlideIndex >= 0 && presentation.slides.length > currentSlideIndex 
      ? presentation.slides[currentSlideIndex] 
      : null;
  
  // Обработчик смены типа данных
  const handleDataTypeChange = (type: 'minimal' | 'maximal' | 'empty') => {
    setDataType(type);
    // Сбрасываем индекс на первый слайд при изменении презентации
    const newPresentation = type === 'minimal' 
      ? minimalPresentation 
      : (type === 'maximal' ? maxPresentation : presentationWithEmptySlide);
    
    setCurrentSlideIndex(newPresentation.slides.length > 0 ? 0 : -1);
  };
  
  return (
    <div className="presentation-container">
      {/* Выбор типа данных */}
      <div className="data-selector">
        <button 
          className={`data-type-button ${dataType === 'minimal' ? 'active' : ''}`}
          onClick={() => handleDataTypeChange('minimal')}
        >
          Минимальные данные
        </button>
        <button 
          className={`data-type-button ${dataType === 'maximal' ? 'active' : ''}`}
          onClick={() => handleDataTypeChange('maximal')}
        >
          Максимальные данные
        </button>
        <button 
          className={`data-type-button ${dataType === 'empty' ? 'active' : ''}`}
          onClick={() => handleDataTypeChange('empty')}
        >
          Один пустой слайд
        </button>
      </div>
      
      {/* Заголовок презентации */}
      <div className="presentation-header">
        <input 
          type="text" 
          className="presentation-title" 
          value={presentation.title} 
          readOnly
        />
        <div className="presentation-actions">
          <button className="toolbar-button">Экспорт</button>
        </div>
      </div>
      
      {/* Основное содержимое */}
      <div className="presentation-body">
        {/* Боковая панель со слайдами */}
        <div className="slides-sidebar">
          <button className="add-slide-button">+ Добавить слайд</button>
          
          {presentation.slides.map((slide, index) => (
            <SlideThumbnail 
              key={slide.id}
              slide={slide}
              index={index}
              isActive={index === currentSlideIndex}
              onClick={() => setCurrentSlideIndex(index)}
            />
          ))}
        </div>
        
        {/* Рабочая область */}
        <Workspace 
          currentSlide={currentSlide}
          workspaceSize={presentation.sizeWorkspace}
        />
      </div>
    </div>
  );
}

export default Presents;