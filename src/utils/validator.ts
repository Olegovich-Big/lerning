import Ajv from 'ajv';
import { Presentation, Slide, BackgroundType, ElementType } from '../test';

// Инициализация экземпляра Ajv
const ajv = new Ajv({ allErrors: true });

// Схема для типа Size
const sizeSchema = {
  type: 'object',
  required: ['width', 'height'],
  properties: {
    width: { type: 'number' },
    height: { type: 'number' }
  }
};

// Схема для типа Pos
const posSchema = {
  type: 'object',
  required: ['x', 'y'],
  properties: {
    x: { type: 'number' },
    y: { type: 'number' }
  }
};

// Схема для базового объекта слайда
const baseSlideObjSchema = {
  type: 'object',
  required: ['id', 'size', 'pos'],
  properties: {
    id: { type: 'string' },
    size: sizeSchema,
    pos: posSchema
  }
};

// Схема для текстового объекта
const textObjSchema = {
  type: 'object',
  allOf: [baseSlideObjSchema],
  required: ['type', 'text', 'fontSize', 'fontFamily'],
  properties: {
    type: { const: ElementType.text },
    text: { type: 'string' },
    fontSize: { type: 'number' },
    fontFamily: { type: 'string' },
    color: { type: 'string', nullable: true }
  }
};

// Схема для объекта изображения
const imgObjSchema = {
  type: 'object',
  allOf: [baseSlideObjSchema],
  required: ['type', 'src'],
  properties: {
    type: { const: ElementType.image },
    src: { type: 'string' }
  }
};

// Схема для объектов слайда
const slideObjSchema = {
  oneOf: [textObjSchema, imgObjSchema]
};

// Схема для типов фона
const backgroundSchema = {
  oneOf: [
    {
      type: 'object',
      required: ['type', 'color'],
      properties: {
        type: { const: BackgroundType.color },
        color: { type: 'string' }
      }
    },
    {
      type: 'object',
      required: ['type', 'url'],
      properties: {
        type: { const: BackgroundType.image },
        url: { type: 'string' }
      }
    },
    {
      type: 'object',
      required: ['type', 'colors', 'direction'],
      properties: {
        type: { const: BackgroundType.gradiend },
        colors: { 
          type: 'array',
          items: { type: 'string' }
        },
        direction: { type: 'string' }
      }
    },
    { type: 'null' }
  ]
};

// Схема для слайда
const slideSchema = {
  type: 'object',
  required: ['id', 'elements', 'background'],
  properties: {
    id: { type: 'string' },
    elements: { 
      type: 'array',
      items: slideObjSchema
    },
    background: backgroundSchema
  }
};

// Схема для презентации
const presentationSchema = {
  type: 'object',
  required: ['title', 'slides', 'sizeWorkspace'],
  properties: {
    title: { type: 'string' },
    slides: { 
      type: 'array',
      items: slideSchema
    },
    sizeWorkspace: sizeSchema
  }
};

// Компилируем схему
const validatePresentation = ajv.compile(presentationSchema);

/**
 * Проверяет валидность объекта презентации
 * @param presentation - объект презентации для валидации
 * @returns результат валидации с флагом успеха и возможными ошибками
 */
export const validatePresentationData = (presentation: unknown): { valid: boolean; errors: string[] } => {
  const valid = validatePresentation(presentation);
  
  if (!valid) {
    // Форматируем ошибки в удобный вид
    const errors = (validatePresentation.errors || []).map(err => {
      const path = err.instancePath || '';
      const message = err.message || 'Неизвестная ошибка';
      return `${path ? path + ': ' : ''}${message}`;
    });
    
    return { valid: false, errors };
  }
  
  return { valid: true, errors: [] };
};

/**
 * Проверяет презентацию и возвращает ее, если она валидна
 * или генерирует ошибку в противном случае
 * @param data - данные для проверки
 * @returns валидный объект презентации
 * @throws Error если презентация не валидна
 */
export const validateAndGetPresentation = (data: unknown): Presentation => {
  const validation = validatePresentationData(data);
  
  if (!validation.valid) {
    const errorMessage = `Презентация не валидна: ${validation.errors.join(', ')}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
  
  return data as Presentation;
}; 