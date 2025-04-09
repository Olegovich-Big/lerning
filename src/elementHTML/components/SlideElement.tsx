import React, { useState, useRef, useEffect } from 'react';
import { SlideObj, ElementType, TextObj, ImgObj } from '../../test';
import styles from './SlideElement.module.css';

interface SlideElementProps {
  element: SlideObj;
  onDelete?: (id: string) => void;
  onUpdateText?: (id: string, newText: string) => void;
  onUpdatePosition?: (id: string, x: number, y: number) => void;
}

const SlideElement: React.FC<SlideElementProps> = ({ 
  element, 
  onDelete,
  onUpdateText,
  onUpdatePosition
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState((element as TextObj).text || '');
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: element.pos.x, y: element.pos.y });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  const elementRef = useRef<HTMLDivElement>(null);
  
  const style: React.CSSProperties = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${element.size.width}px`,
    height: `${element.size.height}px`,
    position: 'absolute',
  };
  
  // Обработчики перетаскивания
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    
    setIsDragging(true);
    
    const rect = elementRef.current?.getBoundingClientRect();
    if (rect) {
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    
    e.stopPropagation();
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const parent = elementRef.current?.parentElement;
    if (parent) {
      const parentRect = parent.getBoundingClientRect();
      const x = e.clientX - parentRect.left - offset.x;
      const y = e.clientY - parentRect.top - offset.y;
      
      setPosition({ x, y });
    }
  };
  
  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (onUpdatePosition) {
      onUpdatePosition(element.id, position.x, position.y);
    }
  };
  
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset]);
  
  // Обработчик двойного клика для начала редактирования
  const handleDoubleClick = () => {
    if (element.type === ElementType.text) {
      setIsEditing(true);
    }
  };
  
  // Обработчик изменения текста
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  
  // Обработчик завершения редактирования
  const handleBlur = () => {
    setIsEditing(false);
    
    if (onUpdateText && element.type === ElementType.text) {
      onUpdateText(element.id, text);
    }
  };
  
  // Обработчик удаления элемента
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(element.id);
    }
  };
  
  // Классы для элемента
  const elementClasses = `slide-element ${element.type} ${isDragging ? 'dragging' : ''}`;
  
  switch (element.type) {
    case ElementType.text:
      const textObj = element as TextObj;
      const textStyle: React.CSSProperties = {
        ...style,
        fontSize: `${textObj.fontSize}px`,
        fontFamily: textObj.fontFamily,
        color: textObj.color || '#000000',
      };
      
      return (
        <div 
          ref={elementRef}
          className={elementClasses} 
          style={textStyle}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
        >
          {isEditing ? (
            <textarea
              className="text-editor"
              value={text}
              onChange={handleTextChange}
              onBlur={handleBlur}
              autoFocus
            />
          ) : (
            <>
              {textObj.text}
              {onDelete && (
                <button 
                  className="element-delete-button"
                  onClick={handleDelete}
                >
                  ✕
                </button>
              )}
            </>
          )}
        </div>
      );
    
    case ElementType.image:
      const imgObj = element as ImgObj;
      return (
        <div 
          ref={elementRef}
          className={elementClasses} 
          style={style}
          onMouseDown={handleMouseDown}
        >
          <img src={imgObj.src} alt="Slide image" />
          {onDelete && (
            <button 
              className="element-delete-button"
              onClick={handleDelete}
            >
              ✕
            </button>
          )}
        </div>
      );
    
    default:
      return null;
  }
};

export default SlideElement; 