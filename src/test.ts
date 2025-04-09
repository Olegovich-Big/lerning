export type EditorType = {
    presentation: Presentation;
    selection: PresentationSelection;
}

// Presentation type - основной тип презентации
export type Presentation = {
    title: string;
    slides: Slide[];
    sizeWorkspace: Size;
}

// Selection type - тип для выделения элементов
export type Selection = {
    elementId: string;
    slideId: string;
}

// PresentationSelection type - коллекция выделенных элементов
export type PresentationSelection = Selection[];

// Background types
export type SolidBackground = {
    type: BackgroundType.color;
    color: string;
};

export type ImageBackground = {
    type: BackgroundType.image;
    url: string;
};

export type GradientBackground = {
    type: BackgroundType.gradiend;
    colors: string[];
    direction: string;
};

export type Background = SolidBackground | ImageBackground | GradientBackground | null;

export type Color = {
    type: 'solid';
    color: string;
};

export type ImgObj = BaseSlideObj & {
    type: ElementType.image;
    src: string;
};

export type TextObj = BaseSlideObj & {
    type: ElementType.text;
    text: string;
    fontSize: number;
    fontFamily: string;
    color?: string;
};

// Slide type - тип слайда
export type Slide = {
    id: string;
    elements: SlideObj[];
    background: Background;
}

export enum BackgroundType {
    gradiend = 'gradient',
    image = 'image',
    color = 'color'
}

export type SlideObj = TextObj | ImgObj;

export type Size = {
    width: number;
    height: number;
}

export type Pos = {
    x: number;
    y: number;
}

export type BaseSlideObj = {
    size: Size;
    pos: Pos;
    id: string;
};

export enum ElementType {
    text = 'text',
    image = 'image',
};

// Functions for presentation management

// Change presentation title
export function changeTitle(presentation: Presentation, newTitle: string): Presentation {
    return {
        ...presentation,
        title: newTitle
    };
}

// Add slide
export function addSlide(presentation: Presentation, newSlide: Slide): Presentation {
    return {
        ...presentation,
        slides: [...presentation.slides, newSlide]
    };
}

// Remove slide by id
export function removeSlide(presentation: Presentation, slideId: string): Presentation {
    return {
        ...presentation,
        slides: presentation.slides.filter(slide => slide.id !== slideId)
    };
}

// Change slide position
export function changeSlidePosition(presentation: Presentation, slideId: string, newPosition: number): Presentation {
    const slides = [...presentation.slides];
    const currentIndex = slides.findIndex(slide => slide.id === slideId);
    
    if (currentIndex === -1 || newPosition < 0 || newPosition >= slides.length) {
        return presentation;
    }
    
    const [slideToMove] = slides.splice(currentIndex, 1);
    slides.splice(newPosition, 0, slideToMove);
    
    return {
        ...presentation,
        slides
    };
}

// Add text to slide
export function addTextToSlide(presentation: Presentation, slideId: string, textObj: TextObj): Presentation {
    return {
        ...presentation,
        slides: presentation.slides.map(slide => 
            slide.id === slideId 
                ? { ...slide, elements: [...slide.elements, textObj] }
                : slide
        )
    };
}

// Add image to slide
export function addImageToSlide(presentation: Presentation, slideId: string, imgObj: ImgObj): Presentation {
    return {
        ...presentation,
        slides: presentation.slides.map(slide => 
            slide.id === slideId 
                ? { ...slide, elements: [...slide.elements, imgObj] }
                : slide
        )
    };
}

// Remove element from slide
export function removeElement(presentation: Presentation, slideId: string, elementId: string): Presentation {
    return {
        ...presentation,
        slides: presentation.slides.map(slide => 
            slide.id === slideId 
                ? { 
                    ...slide, 
                    elements: slide.elements.filter(element => element.id !== elementId)
                }
                : slide
        )
    };
}

// Change element position
export function changeElementPosition(presentation: Presentation, slideId: string, elementId: string, newPos: Pos): Presentation {
    return {
        ...presentation,
        slides: presentation.slides.map(slide => 
            slide.id === slideId 
                ? { 
                    ...slide, 
                    elements: slide.elements.map(element => 
                        element.id === elementId 
                            ? { ...element, pos: newPos }
                            : element
                    )
                }
                : slide
        )
    };
}

// Change element size
export function changeElementSize(presentation: Presentation, slideId: string, elementId: string, newSize: Size): Presentation {
    return {
        ...presentation,
        slides: presentation.slides.map(slide => 
            slide.id === slideId 
                ? { 
                    ...slide, 
                    elements: slide.elements.map(element => 
                        element.id === elementId 
                            ? { ...element, size: newSize }
                            : element
                    )
                }
                : slide
        )
    };
}

// Change text content
export function changeTextContent(presentation: Presentation, slideId: string, elementId: string, newText: string): Presentation {
    return {
        ...presentation,
        slides: presentation.slides.map(slide => 
            slide.id === slideId 
                ? { 
                    ...slide, 
                    elements: slide.elements.map(element => 
                        element.id === elementId && element.type === ElementType.text
                            ? { ...element, text: newText } as TextObj
                            : element
                    )
                }
                : slide
        )
    };
}

// Change text font size
export function changeTextFontSize(presentation: Presentation, slideId: string, elementId: string, newFontSize: number): Presentation {
    return {
        ...presentation,
        slides: presentation.slides.map(slide => 
            slide.id === slideId 
                ? { 
                    ...slide, 
                    elements: slide.elements.map(element => 
                        element.id === elementId && element.type === ElementType.text
                            ? { ...element, fontSize: newFontSize } as TextObj
                            : element
                    )
                }
                : slide
        )
    };
}

// Change text font family
export function changeTextFontFamily(presentation: Presentation, slideId: string, elementId: string, newFontFamily: string): Presentation {
    return {
        ...presentation,
        slides: presentation.slides.map(slide => 
            slide.id === slideId 
                ? { 
                    ...slide, 
                    elements: slide.elements.map(element => 
                        element.id === elementId && element.type === ElementType.text
                            ? { ...element, fontFamily: newFontFamily } as TextObj
                            : element
                    )
                }
                : slide
        )
    };
}

// Change slide background
export function changeSlideBackground(presentation: Presentation, slideId: string, newBackground: Background): Presentation {
    return {
        ...presentation,
        slides: presentation.slides.map(slide => 
            slide.id === slideId 
                ? { ...slide, background: newBackground }
                : slide
        )
    };
}