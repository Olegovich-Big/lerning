import React, { useRef } from 'react';
import { Slide, BackgroundType } from '../../test';
import styles from './SlideThumbnail.module.css';

interface SlideThumbnailProps {
  slide: Slide;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
}

const SlideThumbnail: React.FC<SlideThumbnailProps> = ({ 
  slide, 
  index, 
  isActive, 
  onClick,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  // Определяем стиль фона для миниатюры
  let backgroundStyle: React.CSSProperties = {};
  
  if (slide.background) {
    switch (slide.background.type) {
      case BackgroundType.color:
        backgroundStyle = { backgroundColor: slide.background.color };
        break;
      case BackgroundType.image:
        backgroundStyle = { 
          backgroundImage: `url(${slide.background.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        };
        break;
      case BackgroundType.gradiend:
        const gradient = slide.background;
        backgroundStyle = {
          background: `linear-gradient(${gradient.direction}, ${gradient.colors.join(', ')})`
        };
        break;
    }
  } else {
    backgroundStyle = { backgroundColor: 'white' };
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (onDragStart) {
      e.dataTransfer.setData('text/plain', String(index));
      onDragStart(e, index);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (onDragOver) {
      onDragOver(e);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (onDrop) {
      onDrop(e, index);
    }
  };

  return (
    <div 
      className={`slide-thumbnail ${isActive ? 'active' : ''}`} 
      onClick={onClick}
      draggable={true}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="slide-thumbnail-preview" style={backgroundStyle}>
        {slide.elements.length === 0 && <div className="slide-thumbnail-empty">Пустой слайд</div>}
        {/* Здесь можно добавить миниатюрные версии элементов, но для простоты опустим */}
      </div>
      <div className="slide-thumbnail-number">{index + 1}</div>
    </div>
  );
};

export default SlideThumbnail; 