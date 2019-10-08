# Bonus Wheel

## JS API

Для отображения окна вызовите функцию `window.showWheel(config, callback)`

```javascript
const config = [
  ...
  {
    value: 2, // значение которое будет передано в callback если выпадет этот сектор
    text: '15%', // текст для отображения на секторе
    allow: true, // может ли этот сектор выпасть
  }
  ...
]
```

- В `config` необходимо задать строго 12 секторов
- Для секторов со скидкой (параметр `text` вида `/^\d\%$/`) размер шрифта будет увеличен
- Для секторов с текcтом максимальная длина слова 10 символов и максимум 3 строки

`callback` будет вызван с одним параметром `result` при нажатии пользователем на кнопку 'Получить промокод', после чего через 3 секунды окно закроется

```javascript
  const result = {
    value: 2, // значение указанное в config для выпавшего сектора
    name: 'Вася', // введенное пользователем значение в поле 'Имя'
    phone: '+7(999)-99-99', // введенное пользователем значение в поле 'Телефон'
  };
```

Валидация и корректировка данных не производится, только проверка что в поле что-то введено

Вызов `window.showWheel` вернет функцию `hide` которую можно использовать для преждевременного закрытия окна

HTML код окна необходимо добавить на страницу самостоятельно

## CSS

Верстка выполнена в методологии BEM с использование блоков `wheel`, `reel` и вспомогательно класса `visually-hidden`

Для масштабирования текста вместе с графикой все размеры указаны в `em`, а `font-size` корневого элемента `.wheel` меняется в зависимости от размеров окна браузера

Окно переходит в вертикальный режим когда высота окна браузера больше ширины
