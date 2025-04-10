import React from 'react';
import { Slide, Size, Background, BackgroundType } from '../../test';
import SlideElement from './SlideElement';
import styles from './Workspace.module.css';

interface WorkspaceProps {
  currentSlide: Slide | null;
  workspaceSize: Size;
  onDeleteElement?: (elementId: string) => void;
  onUpdateElementText?: (elementId: string, newText: string) => void;
  onUpdateElementPosition?: (elementId: string, x: number, y: number) => void;
  onUpdateElementSize?: (elementId: string, width: number, height: number) => void;
  selectedElementId?: string | null;
  onSelectElement?: (elementId: string) => void;
  onWorkspaceClick?: () => void;
}

const Workspace: React.FC<WorkspaceProps> = ({ 
  currentSlide, 
  workspaceSize,
  onDeleteElement,
  onUpdateElementText,
  onUpdateElementPosition,
  onUpdateElementSize,
  selectedElementId,
  onSelectElement,
  onWorkspaceClick
}) => {
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

  const handleWorkspaceClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onWorkspaceClick) {
      onWorkspaceClick();
    }
  };

  if (!currentSlide) {
    return (
      <div className={styles.workspace}>
        <div className={styles.emptyPresentation}>
          <h2>Презентация не содержит слайдов</h2>
          <button className={styles.createButton}>Добавить слайд</button>
        </div>
      </div>
    );
  }

  const slideStyle = {
    ...workspaceStyle,
    ...renderBackground(currentSlide.background)
  };

  return (
    <div className={styles.workspace}>
      <div 
        className={styles.slideWorkspace} 
        style={slideStyle} 
        onClick={handleWorkspaceClick}
      >
        {currentSlide.elements.length === 0 ? (
          <div className={styles.emptySlide}>Пустой слайд. Добавьте текст или изображение.</div>
        ) : (
          currentSlide.elements.map(element => (
            <SlideElement 
              key={element.id} 
              element={element} 
              onDelete={onDeleteElement}
              onUpdateText={onUpdateElementText}
              onUpdatePosition={onUpdateElementPosition}
              onUpdateSize={onUpdateElementSize}
              isSelected={element.id === selectedElementId}
              onSelect={onSelectElement}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Workspace; 