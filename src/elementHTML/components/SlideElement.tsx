import React, { useState, useRef, useEffect } from 'react';
import { SlideObj, ElementType, TextObj, ImgObj } from '../../test';
import styles from './SlideElement.module.css';

interface SlideElementProps {
  element: SlideObj;
  onDelete?: (id: string) => void;
  onUpdateText?: (id: string, newText: string) => void;
  onUpdatePosition?: (id: string, x: number, y: number) => void;
  onUpdateSize?: (id: string, width: number, height: number) => void;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

type ResizeDirection = 
  'top' | 'right' | 'bottom' | 'left' | 
  'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | null;

const SlideElement: React.FC<SlideElementProps> = ({ 
  element, 
  onDelete,
  onUpdateText,
  onUpdatePosition,
  onUpdateSize,
  isSelected = false,
  onSelect
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState((element as TextObj).text || '');
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<ResizeDirection>(null);
  const [position, setPosition] = useState({ x: element.pos.x, y: element.pos.y });
  const [size, setSize] = useState({ width: element.size.width, height: element.size.height });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  const elementRef = useRef<HTMLDivElement>(null);
  
  const style: React.CSSProperties = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size.width}px`,
    height: `${size.height}px`,
    position: 'absolute',
  };
  
  // Обработчики перетаскивания
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    
    if (onSelect) {
      onSelect(element.id);
    }
    
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
    if (isDragging) {
      const parent = elementRef.current?.parentElement;
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        const x = e.clientX - parentRect.left - offset.x;
        const y = e.clientY - parentRect.top - offset.y;
        
        setPosition({ x, y });
      }
    } else if (isResizing) {
      const parent = elementRef.current?.parentElement;
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        const currentX = e.clientX - parentRect.left;
        const currentY = e.clientY - parentRect.top;
        
        let newWidth = size.width;
        let newHeight = size.height;
        let newX = position.x;
        let newY = position.y;
        
        // Обработка изменения размера по направлениям
        switch (isResizing) {
          case 'right':
            newWidth = Math.max(currentX - position.x, 20);
            break;
          case 'left':
            const deltaXLeft = position.x - currentX;
            newWidth = Math.max(size.width + deltaXLeft, 20);
            if (newWidth !== size.width) {
              newX = position.x - deltaXLeft;
            }
            break;
          case 'bottom':
            newHeight = Math.max(currentY - position.y, 20);
            break;
          case 'top':
            const deltaYTop = position.y - currentY;
            newHeight = Math.max(size.height + deltaYTop, 20);
            if (newHeight !== size.height) {
              newY = position.y - deltaYTop;
            }
            break;
          case 'topLeft':
            const deltaXTopLeft = position.x - currentX;
            const deltaYTopLeft = position.y - currentY;
            newWidth = Math.max(size.width + deltaXTopLeft, 20);
            newHeight = Math.max(size.height + deltaYTopLeft, 20);
            if (newWidth !== size.width) {
              newX = position.x - deltaXTopLeft;
            }
            if (newHeight !== size.height) {
              newY = position.y - deltaYTopLeft;
            }
            break;
          case 'topRight':
            const deltaYTopRight = position.y - currentY;
            newWidth = Math.max(currentX - position.x, 20);
            newHeight = Math.max(size.height + deltaYTopRight, 20);
            if (newHeight !== size.height) {
              newY = position.y - deltaYTopRight;
            }
            break;
          case 'bottomLeft':
            const deltaXBottomLeft = position.x - currentX;
            newWidth = Math.max(size.width + deltaXBottomLeft, 20);
            newHeight = Math.max(currentY - position.y, 20);
            if (newWidth !== size.width) {
              newX = position.x - deltaXBottomLeft;
            }
            break;
          case 'bottomRight':
            newWidth = Math.max(currentX - position.x, 20);
            newHeight = Math.max(currentY - position.y, 20);
            break;
        }
        
        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: newX, y: newY });
      }
    }
  };
  
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      if (onUpdatePosition) {
        onUpdatePosition(element.id, position.x, position.y);
      }
    }
    
    if (isResizing) {
      setIsResizing(null);
      if (onUpdateSize) {
        onUpdateSize(element.id, size.width, size.height);
      }
      if (onUpdatePosition) {
        onUpdatePosition(element.id, position.x, position.y);
      }
    }
  };
  
  const handleResizeStart = (e: React.MouseEvent, direction: ResizeDirection) => {
    e.stopPropagation();
    setIsResizing(direction);
  };
  
  useEffect(() => {
    if (isDragging || isResizing) {
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
  }, [isDragging, isResizing, offset, size, position]);
  
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
  const elementClasses = `slide-element ${element.type} ${isDragging ? 'dragging' : ''} ${isSelected ? 'selected' : ''}`;
  
  // Рендер точек ресайза для выбранного элемента
  const renderResizeHandles = () => {
    if (!isSelected) return null;
    
    return (
      <>
        <div 
          className={`${styles.resizeHandle} ${styles.topLeft}`} 
          onMouseDown={(e) => handleResizeStart(e, 'topLeft')}
        />
        <div 
          className={`${styles.resizeHandle} ${styles.top}`} 
          onMouseDown={(e) => handleResizeStart(e, 'top')}
        />
        <div 
          className={`${styles.resizeHandle} ${styles.topRight}`} 
          onMouseDown={(e) => handleResizeStart(e, 'topRight')}
        />
        <div 
          className={`${styles.resizeHandle} ${styles.right}`} 
          onMouseDown={(e) => handleResizeStart(e, 'right')}
        />
        <div 
          className={`${styles.resizeHandle} ${styles.bottomRight}`} 
          onMouseDown={(e) => handleResizeStart(e, 'bottomRight')}
        />
        <div 
          className={`${styles.resizeHandle} ${styles.bottom}`} 
          onMouseDown={(e) => handleResizeStart(e, 'bottom')}
        />
        <div 
          className={`${styles.resizeHandle} ${styles.bottomLeft}`} 
          onMouseDown={(e) => handleResizeStart(e, 'bottomLeft')}
        />
        <div 
          className={`${styles.resizeHandle} ${styles.left}`} 
          onMouseDown={(e) => handleResizeStart(e, 'left')}
        />
      </>
    );
  };
  
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
              {onDelete && isSelected && (
                <button 
                  className="element-delete-button"
                  onClick={handleDelete}
                >
                  ✕
                </button>
              )}
            </>
          )}
          {renderResizeHandles()}
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
          {onDelete && isSelected && (
            <button 
              className="element-delete-button"
              onClick={handleDelete}
            >
              ✕
            </button>
          )}
          {renderResizeHandles()}
        </div>
      );
    
    default:
      return null;
  }
};

export default SlideElement; 