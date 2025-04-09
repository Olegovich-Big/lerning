import {
  Presentation,
  Slide,
  TextObj,
  ImgObj,
  ElementType,
  BackgroundType,
  Size,
  Pos,
  Background
} from '../test';

// Minimal test data
export const minimalWorkspaceSize: Size = {
  width: 800,
  height: 600
};

export const minimalPresentation: Presentation = {
  title: "Минимальная презентация",
  slides: [],
  sizeWorkspace: minimalWorkspaceSize
};

// Maximum test data
export const maxWorkspaceSize: Size = {
  width: 1920,
  height: 1080
};

// Text element 1
const textElement1: TextObj = {
  id: "text1",
  type: ElementType.text,
  text: "Образец текста 1",
  fontSize: 16,
  fontFamily: "Arial",
  color: "#000000",
  pos: { x: 50, y: 50 },
  size: { width: 200, height: 100 }
};

// Text element 2
const textElement2: TextObj = {
  id: "text2",
  type: ElementType.text,
  text: "Образец текста 2",
  fontSize: 24,
  fontFamily: "Roboto",
  color: "#333333",
  pos: { x: 300, y: 50 },
  size: { width: 250, height: 150 }
};

// Image element 1
const imageElement1: ImgObj = {
  id: "img1",
  type: ElementType.image,
  src: "https://via.placeholder.com/300x200",
  pos: { x: 50, y: 200 },
  size: { width: 300, height: 200 }
};

// Image element 2
const imageElement2: ImgObj = {
  id: "img2",
  type: ElementType.image,
  src: "https://via.placeholder.com/250x150",
  pos: { x: 400, y: 200 },
  size: { width: 250, height: 150 }
};

// Background for slide 1
const solidBackground: Background = {
  type: BackgroundType.color,
  color: "#FFFFFF"
};

// Background for slide 2
const imageBackground: Background = {
  type: BackgroundType.image,
  url: "https://via.placeholder.com/1920x1080/cccccc"
};

// Background for slide 3
const gradientBackground: Background = {
  type: BackgroundType.gradiend,
  colors: ["#3494E6", "#EC6EAD"],
  direction: "to right"
};

// Slide 1
const slide1: Slide = {
  id: "slide1",
  elements: [textElement1, imageElement1],
  background: solidBackground
};

// Slide 2
const slide2: Slide = {
  id: "slide2",
  elements: [textElement2, imageElement2],
  background: imageBackground
};

// Slide 3
const slide3: Slide = {
  id: "slide3",
  elements: [
    {
      id: "text3",
      type: ElementType.text,
      text: "Градиентный фон",
      fontSize: 32,
      fontFamily: "Times New Roman",
      color: "#FFFFFF",
      pos: { x: 200, y: 100 },
      size: { width: 300, height: 100 }
    }
  ],
  background: gradientBackground
};

// Maximum presentation
export const maxPresentation: Presentation = {
  title: "Максимальная презентация",
  slides: [slide1, slide2, slide3],
  sizeWorkspace: maxWorkspaceSize
};

// Presentation with one empty slide
export const presentationWithEmptySlide: Presentation = {
  title: "Презентация с пустым слайдом",
  slides: [
    {
      id: "emptySlide",
      elements: [],
      background: null
    }
  ],
  sizeWorkspace: minimalWorkspaceSize
}; 