import { Presentation } from '../test';

/**
 * Экспортирует презентацию в формате JSON
 * @param presentation - объект презентации для экспорта
 */
export const exportPresentation = (presentation: Presentation): void => {
  try {
    // Подготовка данных для экспорта
    const dataStr = JSON.stringify(presentation, null, 2);
    
    // Создание объекта Blob для файла
    const blob = new Blob([dataStr], { type: 'application/json' });
    
    // Создание URL объекта
    const url = URL.createObjectURL(blob);
    
    // Создание ссылки для скачивания
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `${presentation.title.replace(/\s+/g, '_')}_presentation.json`;
    
    // Добавляем ссылку в DOM, инициируем скачивание и убираем ссылку
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Освобождаем URL объект
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Ошибка при экспорте презентации:', error);
    throw new Error('Не удалось экспортировать презентацию');
  }
};

/**
 * Импортирует презентацию из JSON файла
 * @returns Promise с объектом презентации
 */
export const importPresentation = (): Promise<Presentation> => {
  return new Promise((resolve, reject) => {
    try {
      // Создаем элемент input для выбора файла
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'application/json';
      
      // Обрабатываем выбор файла
      fileInput.onchange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (!target.files || target.files.length === 0) {
          reject(new Error('Файл не выбран'));
          return;
        }
        
        const file = target.files[0];
        const reader = new FileReader();
        
        // Обрабатываем загрузку файла
        reader.onload = (e: ProgressEvent<FileReader>) => {
          try {
            if (!e.target?.result) {
              reject(new Error('Не удалось прочитать файл'));
              return;
            }
            
            const content = e.target.result as string;
            const presentation = JSON.parse(content) as Presentation;
            resolve(presentation);
          } catch (error) {
            reject(new Error('Не удалось разобрать файл как JSON'));
          }
        };
        
        // Обрабатываем ошибки чтения файла
        reader.onerror = () => {
          reject(new Error('Произошла ошибка при чтении файла'));
        };
        
        // Читаем файл как текст
        reader.readAsText(file);
      };
      
      // Инициируем клик по элементу для выбора файла
      fileInput.click();
    } catch (error) {
      reject(new Error('Не удалось импортировать презентацию'));
    }
  });
}; 