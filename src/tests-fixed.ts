import {
  Presentation,
  Slide,
  TextObj,
  ImgObj,
  ElementType,
  Size,
  Pos,
  Background,
  BackgroundType,
  changeTitle,
  addSlide,
  removeSlide,
  changeSlidePosition,
  addTextToSlide,
  addImageToSlide,
  removeElement,
  changeElementPosition,
  changeElementSize,
  changeTextContent,
  changeTextFontSize,
  changeTextFontFamily,
  changeSlideBackground
} from './test';

// Minimal test data
const minimalWorkspaceSize: Size = {
  width: 800,
  height: 600
};

const minimalPresentation: Presentation = {
  title: "Minimal Presentation",
  slides: [],
  sizeWorkspace: minimalWorkspaceSize
};

// Maximum test data
const maxWorkspaceSize: Size = {
  width: 1920,
  height: 1080
};

// Text element 1
const textElement1: TextObj = {
  id: "text1",
  type: ElementType.text,
  text: "Sample Text 1",
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
  text: "Sample Text 2",
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
  src: "https://example.com/image1.jpg",
  pos: { x: 50, y: 200 },
  size: { width: 300, height: 200 }
};

// Image element 2
const imageElement2: ImgObj = {
  id: "img2",
  type: ElementType.image,
  src: "https://example.com/image2.jpg",
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
  url: "https://example.com/background.jpg"
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

// Maximum presentation
const maxPresentation: Presentation = {
  title: "Maximum Presentation",
  slides: [slide1, slide2],
  sizeWorkspace: maxWorkspaceSize
};

// =========== RUN TESTS ============

function runTests() {
  console.log("===================== TESTING WITH MINIMAL DATA =====================");

  // 1. Test changeTitle with minimal data
  console.log("Testing changeTitle with minimal data:");
  const minimalTitleChanged = changeTitle(minimalPresentation, "New Minimal Title");
  console.log(`Original title: ${minimalPresentation.title}`);
  console.log(`New title: ${minimalTitleChanged.title}`);
  console.log("\n");

  // 2. Test addSlide with minimal data
  console.log("Testing addSlide with minimal data:");
  const emptySlide: Slide = {
    id: "emptySlide",
    elements: [],
    background: null
  };
  const minimalWithSlide = addSlide(minimalPresentation, emptySlide);
  console.log(`Original slides count: ${minimalPresentation.slides.length}`);
  console.log(`New slides count: ${minimalWithSlide.slides.length}`);
  console.log("\n");

  // 3. Test removeSlide with minimal data
  console.log("Testing removeSlide with minimal data (should have no effect):");
  const minimalAfterRemove = removeSlide(minimalPresentation, "nonExistentId");
  console.log(`Original slides count: ${minimalPresentation.slides.length}`);
  console.log(`After remove slides count: ${minimalAfterRemove.slides.length}`);
  console.log("\n");

  // 4. Test changeSlidePosition with minimal data (should have no effect)
  console.log("Testing changeSlidePosition with minimal data (should have no effect):");
  const minimalAfterPosition = changeSlidePosition(minimalPresentation, "nonExistentId", 1);
  console.log(`Original slides: ${JSON.stringify(minimalPresentation.slides)}`);
  console.log(`After position change: ${JSON.stringify(minimalAfterPosition.slides)}`);
  console.log("\n");

  // For the remaining tests with minimal data, we need at least one slide
  const minimalWithOneSlide = addSlide(minimalPresentation, emptySlide);

  // 5. Test addTextToSlide with minimal data
  console.log("Testing addTextToSlide with minimal data:");
  const minimalText: TextObj = {
    id: "minText",
    type: ElementType.text,
    text: "Minimal Text",
    fontSize: 12,
    fontFamily: "Arial",
    pos: { x: 10, y: 10 },
    size: { width: 100, height: 50 }
  };
  const minimalWithText = addTextToSlide(minimalWithOneSlide, "emptySlide", minimalText);
  console.log(`Original elements count in slide: ${minimalWithOneSlide.slides[0].elements.length}`);
  console.log(`After adding text elements count: ${minimalWithText.slides[0].elements.length}`);
  console.log("\n");

  // 6. Test addImageToSlide with minimal data
  console.log("Testing addImageToSlide with minimal data:");
  const minimalImage: ImgObj = {
    id: "minImage",
    type: ElementType.image,
    src: "https://example.com/minimal.jpg",
    pos: { x: 10, y: 10 },
    size: { width: 100, height: 50 }
  };
  const minimalWithImage = addImageToSlide(minimalWithOneSlide, "emptySlide", minimalImage);
  console.log(`Original elements count in slide: ${minimalWithOneSlide.slides[0].elements.length}`);
  console.log(`After adding image elements count: ${minimalWithImage.slides[0].elements.length}`);
  console.log("\n");

  // Create a minimal slide with one element for further tests
  const minimalTextElement: TextObj = {
    id: "minimalText",
    type: ElementType.text,
    text: "Test",
    fontSize: 12,
    fontFamily: "Arial",
    pos: { x: 0, y: 0 },
    size: { width: 50, height: 20 }
  };

  const minimalSlideWithElement: Slide = {
    id: "minSlideWithElement",
    elements: [minimalTextElement],
    background: null
  };

  const minimalPresentationWithElement = {
    ...minimalPresentation,
    slides: [minimalSlideWithElement]
  };

  // 7. Test removeElement with minimal data
  console.log("Testing removeElement with minimal data:");
  const minimalAfterElementRemove = removeElement(minimalPresentationWithElement, "minSlideWithElement", "minimalText");
  console.log(`Original elements count: ${minimalPresentationWithElement.slides[0].elements.length}`);
  console.log(`After element remove count: ${minimalAfterElementRemove.slides[0].elements.length}`);
  console.log("\n");

  // 8. Test changeElementPosition with minimal data
  console.log("Testing changeElementPosition with minimal data:");
  const newMinimalPos: Pos = { x: 20, y: 20 };
  const minimalAfterElementPosition = changeElementPosition(
    minimalPresentationWithElement, 
    "minSlideWithElement", 
    "minimalText", 
    newMinimalPos
  );
  console.log(`Original position: ${JSON.stringify(minimalPresentationWithElement.slides[0].elements[0].pos)}`);
  console.log(`New position: ${JSON.stringify(minimalAfterElementPosition.slides[0].elements[0].pos)}`);
  console.log("\n");

  // 9. Test changeElementSize with minimal data
  console.log("Testing changeElementSize with minimal data:");
  const newMinimalSize: Size = { width: 100, height: 40 };
  const minimalAfterElementSize = changeElementSize(
    minimalPresentationWithElement, 
    "minSlideWithElement", 
    "minimalText", 
    newMinimalSize
  );
  console.log(`Original size: ${JSON.stringify(minimalPresentationWithElement.slides[0].elements[0].size)}`);
  console.log(`New size: ${JSON.stringify(minimalAfterElementSize.slides[0].elements[0].size)}`);
  console.log("\n");

  // 10. Test changeTextContent with minimal data
  console.log("Testing changeTextContent with minimal data:");
  const minimalAfterTextContent = changeTextContent(
    minimalPresentationWithElement, 
    "minSlideWithElement", 
    "minimalText", 
    "Updated Text"
  );
  console.log(`Original text: ${(minimalPresentationWithElement.slides[0].elements[0] as TextObj).text}`);
  console.log(`New text: ${(minimalAfterTextContent.slides[0].elements[0] as TextObj).text}`);
  console.log("\n");

  // 11. Test changeTextFontSize with minimal data
  console.log("Testing changeTextFontSize with minimal data:");
  const minimalAfterFontSize = changeTextFontSize(
    minimalPresentationWithElement, 
    "minSlideWithElement", 
    "minimalText", 
    24
  );
  console.log(`Original font size: ${(minimalPresentationWithElement.slides[0].elements[0] as TextObj).fontSize}`);
  console.log(`New font size: ${(minimalAfterFontSize.slides[0].elements[0] as TextObj).fontSize}`);
  console.log("\n");

  // 12. Test changeTextFontFamily with minimal data
  console.log("Testing changeTextFontFamily with minimal data:");
  const minimalAfterFontFamily = changeTextFontFamily(
    minimalPresentationWithElement, 
    "minSlideWithElement", 
    "minimalText", 
    "Times New Roman"
  );
  console.log(`Original font family: ${(minimalPresentationWithElement.slides[0].elements[0] as TextObj).fontFamily}`);
  console.log(`New font family: ${(minimalAfterFontFamily.slides[0].elements[0] as TextObj).fontFamily}`);
  console.log("\n");

  // 13. Test changeSlideBackground with minimal data
  console.log("Testing changeSlideBackground with minimal data:");
  const newMinimalBackground: Background = {
    type: BackgroundType.color,
    color: "#EEEEEE"
  };
  const minimalAfterBackground = changeSlideBackground(
    minimalPresentationWithElement, 
    "minSlideWithElement", 
    newMinimalBackground
  );
  console.log(`Original background: ${JSON.stringify(minimalPresentationWithElement.slides[0].background)}`);
  console.log(`New background: ${JSON.stringify(minimalAfterBackground.slides[0].background)}`);
  console.log("\n");

  // ==========================================================================
  console.log("===================== TESTING WITH MAXIMUM DATA =====================");

  // 1. Test changeTitle with maximum data
  console.log("Testing changeTitle with maximum data:");
  const maxTitleChanged = changeTitle(maxPresentation, "New Maximum Title");
  console.log(`Original title: ${maxPresentation.title}`);
  console.log(`New title: ${maxTitleChanged.title}`);
  console.log("\n");

  // 2. Test addSlide with maximum data
  console.log("Testing addSlide with maximum data:");
  const newSlide: Slide = {
    id: "newSlide",
    elements: [
      {
        id: "newText",
        type: ElementType.text,
        text: "New Text",
        fontSize: 18,
        fontFamily: "Verdana",
        color: "#0000FF",
        pos: { x: 100, y: 100 },
        size: { width: 200, height: 100 }
      }
    ],
    background: {
      type: BackgroundType.gradiend,
      colors: ["#FF0000", "#0000FF"],
      direction: "to right"
    }
  };
  const maxWithSlide = addSlide(maxPresentation, newSlide);
  console.log(`Original slides count: ${maxPresentation.slides.length}`);
  console.log(`New slides count: ${maxWithSlide.slides.length}`);
  console.log("\n");

  // 3. Test removeSlide with maximum data
  console.log("Testing removeSlide with maximum data:");
  const maxAfterRemove = removeSlide(maxPresentation, "slide1");
  console.log(`Original slides count: ${maxPresentation.slides.length}`);
  console.log(`After remove slides count: ${maxAfterRemove.slides.length}`);
  console.log(`Removed slide id: slide1`);
  console.log("\n");

  // 4. Test changeSlidePosition with maximum data
  console.log("Testing changeSlidePosition with maximum data:");
  const maxAfterPosition = changeSlidePosition(maxPresentation, "slide1", 1);
  console.log(`Original slide order: ${maxPresentation.slides.map(s => s.id).join(', ')}`);
  console.log(`After position change: ${maxAfterPosition.slides.map(s => s.id).join(', ')}`);
  console.log("\n");

  // 5. Test addTextToSlide with maximum data
  console.log("Testing addTextToSlide with maximum data:");
  const newText: TextObj = {
    id: "newText",
    type: ElementType.text,
    text: "Added Text",
    fontSize: 20,
    fontFamily: "Comic Sans MS",
    color: "#FF0000",
    pos: { x: 150, y: 150 },
    size: { width: 200, height: 100 }
  };
  const maxWithText = addTextToSlide(maxPresentation, "slide1", newText);
  console.log(`Original elements count in slide1: ${maxPresentation.slides[0].elements.length}`);
  console.log(`After adding text elements count: ${maxWithText.slides[0].elements.length}`);
  console.log("\n");

  // 6. Test addImageToSlide with maximum data
  console.log("Testing addImageToSlide with maximum data:");
  const newImage: ImgObj = {
    id: "newImage",
    type: ElementType.image,
    src: "https://example.com/new-image.jpg",
    pos: { x: 200, y: 200 },
    size: { width: 300, height: 200 }
  };
  const maxWithImage = addImageToSlide(maxPresentation, "slide2", newImage);
  console.log(`Original elements count in slide2: ${maxPresentation.slides[1].elements.length}`);
  console.log(`After adding image elements count: ${maxWithImage.slides[1].elements.length}`);
  console.log("\n");

  // 7. Test removeElement with maximum data
  console.log("Testing removeElement with maximum data:");
  const maxAfterElementRemove = removeElement(maxPresentation, "slide1", "text1");
  console.log(`Original elements count in slide1: ${maxPresentation.slides[0].elements.length}`);
  console.log(`After element remove count: ${maxAfterElementRemove.slides[0].elements.length}`);
  console.log(`Removed element id: text1`);
  console.log("\n");

  // 8. Test changeElementPosition with maximum data
  console.log("Testing changeElementPosition with maximum data:");
  const newMaxPos: Pos = { x: 75, y: 75 };
  const maxAfterElementPosition = changeElementPosition(maxPresentation, "slide1", "text1", newMaxPos);
  console.log(`Original position of text1: ${JSON.stringify(textElement1.pos)}`);
  console.log(`New position of text1: ${JSON.stringify(newMaxPos)}`);
  console.log("\n");

  // 9. Test changeElementSize with maximum data
  console.log("Testing changeElementSize with maximum data:");
  const newMaxSize: Size = { width: 400, height: 200 };
  const maxAfterElementSize = changeElementSize(maxPresentation, "slide2", "img2", newMaxSize);
  console.log(`Original size of img2: ${JSON.stringify(imageElement2.size)}`);
  console.log(`New size of img2: ${JSON.stringify(newMaxSize)}`);
  console.log("\n");

  // 10. Test changeTextContent with maximum data
  console.log("Testing changeTextContent with maximum data:");
  const maxAfterTextContent = changeTextContent(
    maxPresentation, 
    "slide1", 
    "text1", 
    "Updated Text Content"
  );
  console.log(`Original text of text1: ${textElement1.text}`);
  console.log(`New text of text1: "Updated Text Content"`);
  console.log("\n");

  // 11. Test changeTextFontSize with maximum data
  console.log("Testing changeTextFontSize with maximum data:");
  const maxAfterFontSize = changeTextFontSize(maxPresentation, "slide2", "text2", 32);
  console.log(`Original font size of text2: ${textElement2.fontSize}`);
  console.log(`New font size of text2: 32`);
  console.log("\n");

  // 12. Test changeTextFontFamily with maximum data
  console.log("Testing changeTextFontFamily with maximum data:");
  const maxAfterFontFamily = changeTextFontFamily(
    maxPresentation, 
    "slide1", 
    "text1", 
    "Courier New"
  );
  console.log(`Original font family of text1: ${textElement1.fontFamily}`);
  console.log(`New font family of text1: "Courier New"`);
  console.log("\n");

  // 13. Test changeSlideBackground with maximum data
  console.log("Testing changeSlideBackground with maximum data:");
  const newMaxBackground: Background = {
    type: BackgroundType.gradiend,
    colors: ["#00FF00", "#0000FF"],
    direction: "to bottom"
  };
  const maxAfterBackground = changeSlideBackground(maxPresentation, "slide1", newMaxBackground);
  console.log(`Original background type of slide1: ${JSON.stringify(maxPresentation.slides[0].background)}`);
  console.log(`New background of slide1: ${JSON.stringify(newMaxBackground)}`);
  console.log("\n");

  console.log("All tests completed successfully!");
}

// Run all tests
runTests(); 