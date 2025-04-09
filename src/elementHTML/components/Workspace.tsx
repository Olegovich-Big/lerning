import React from 'react';
import { Slide, Size, Background, BackgroundType } from '../../test';
import SlideElement from './SlideElement';

interface WorkspaceProps {
  currentSlide: Slide | null;
  workspaceSize: Size;
}

const Workspace: React.FC<WorkspaceProps> = ({ currentSlide, workspaceSize }) => {
  const renderBackground = (background: Background | null) => {
    if (!background) {
      return { backgroundColor: 'white' };
    }

    switch (background.type) {
      case BackgroundType.color:
        return { backgroundColor: background.color };
      case BackgroundType.image:
        return { 
          backgroundImage: `url(${background.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        };
      case BackgroundType.gradiend:
        return {
          background: `linear-gradient(${background.direction}, ${background.colors.join(', ')})`
        };
      default:
        return { backgroundColor: 'white' };
    }
  };

  const workspaceStyle = {
    width: `${workspaceSize.width}px`,
    height: `${workspaceSize.height}px`,
  };

  if (!currentSlide) {
    return (
      <div className="workspace">
        <div className="empty-presentation">
          <h2>Презентация не содержит слайдов</h2>
          <button className="create-slide-button">Добавить слайд</button>
        </div>
      </div>
    );
  }

  const slideStyle = {
    ...workspaceStyle,
    ...renderBackground(currentSlide.background)
  };

  return (
    <div className="workspace">
      <div className="slide-workspace" style={slideStyle}>
        {currentSlide.elements.length === 0 ? (
          <div className="empty-slide">Пустой слайд. Добавьте текст или изображение.</div>
        ) : (
          currentSlide.elements.map(element => (
            <SlideElement key={element.id} element={element} />
          ))
        )}
      </div>
    </div>
  );
};

export default Workspace; 