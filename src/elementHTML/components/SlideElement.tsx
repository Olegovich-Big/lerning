import React from 'react';
import { SlideObj, ElementType, TextObj, ImgObj } from '../../test';

interface SlideElementProps {
  element: SlideObj;
}

const SlideElement: React.FC<SlideElementProps> = ({ element }) => {
  const style = {
    left: `${element.pos.x}px`,
    top: `${element.pos.y}px`,
    width: `${element.size.width}px`,
    height: `${element.size.height}px`,
  };

  switch (element.type) {
    case ElementType.text:
      const textObj = element as TextObj;
      const textStyle = {
        ...style,
        fontSize: `${textObj.fontSize}px`,
        fontFamily: textObj.fontFamily,
        color: textObj.color || '#000000',
      };
      return (
        <div className="slide-element text" style={textStyle}>
          {textObj.text}
        </div>
      );
    
    case ElementType.image:
      const imgObj = element as ImgObj;
      return (
        <div className="slide-element image" style={style}>
          <img src={imgObj.src} alt="Slide image" />
        </div>
      );
    
    default:
      return null;
  }
};

export default SlideElement; 