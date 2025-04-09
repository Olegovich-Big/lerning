import React from 'react';
import { Slide, BackgroundType } from '../../test';

interface SlideThumbnailProps {
  slide: Slide;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const SlideThumbnail: React.FC<SlideThumbnailProps> = ({ slide, index, isActive, onClick }) => {
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

  return (
    <div 
      className={`slide-thumbnail ${isActive ? 'active' : ''}`} 
      onClick={onClick}
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