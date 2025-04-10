import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Пример 1: Нарушение правила "react-hooks/rules-of-hooks" - условное использование хуков
function BadComponent1(props: { condition: boolean }) {
  // ОШИБКА: Нельзя использовать хуки условно
  if (props.condition) {
    const [state, setState] = useState(0); // ESLint обнаружит эту ошибку
  }
  
  return <div>Неправильное использование хуков</div>;
}

// Пример 2: Нарушение правила "react-hooks/exhaustive-deps" - отсутствие зависимостей
function BadComponent2() {
  const [count, setCount] = useState(0);
  
  // ОШИБКА: Не указаны все зависимости (count отсутствует в массиве зависимостей)
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, []); // ESLint предупредит, что count должен быть в зависимостях
  
  return <div>Count: {count}</div>;
}

// Пример 3: Нарушение правила "react-hooks-addons/no-unused-deps" - неиспользуемые зависимости
function BadComponent3() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('User');
  
  // ОШИБКА: name указан в зависимостях, но не используется в эффекте
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count, name]); // ESLint предупредит, что name не используется
  
  return <div>Count: {count}, Name: {name}</div>;
}

// Пример 4: Нарушение правила "react-hooks-addons/no-unnecessary-deps" - константные зависимости
function BadComponent4() {
  // ОШИБКА: 42 - это константа, ее не нужно включать в зависимости
  const memoizedValue = useMemo(() => {
    return { result: 42 * 2 };
  }, [42]); // ESLint предупредит, что 42 не нужно указывать
  
  return <div>Value: {memoizedValue.result}</div>;
}

// Правильное использование хуков
function GoodComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('User');
  
  // Правильно: указаны все используемые зависимости
  useEffect(() => {
    document.title = `${name}: ${count}`;
  }, [count, name]);
  
  // Правильно: зависимости соответствуют используемым значениям
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  // Правильно: значения, от которых зависят вычисления, указаны в зависимостях
  const doubledCount = useMemo(() => {
    return count * 2;
  }, [count]);
  
  return (
    <div>
      <p>Name: {name}</p>
      <p>Count: {count}</p>
      <p>Doubled count: {doubledCount}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
}

export { BadComponent1, BadComponent2, BadComponent3, BadComponent4, GoodComponent }; 