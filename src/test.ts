export type EditorType = {
    presentation: Presentation;
    selection: PresentationSelection;
}
export type Presentation = {
    title: string;
    slides: Slide[];
    sizeWorkspace: Size;
}
export type Selection = {
    elementId: string;
    slideId: string;
}
export type PresentationSelection = Selection[];
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
    src: string;
    fontSize: number;
    fontFamily: string;
    color?: string;
};
export type Slide = {
    id: string;
    elements: (SlideObj)[];
    background: string;
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