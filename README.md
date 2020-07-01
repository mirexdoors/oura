# oura

##TODO
- Раздел Travel
  В случае отстутствия введенных страны и города - To use this section please enter your home location in the Settings (гиперссылка).
  Временные интервалы: last month, last year, entire period
  Таблица, по строкам (сводная табличка поездок):
  Количество дней в родном часовом поясе (с учётом летнего времени)
  Количество дней вне родного часового пояса сумма
  Количество дней по часовым поясам (название часового пояса GMT +..., количество дней (подряд), дата начала пребывания, дата конца пребывания) - учитываются непрерывные периоды. Если 3 дня в неродном, день в родном, 3 дня в неродном - эти периоды по 3 дня записываются отдельно (типо отдельные поездки).
  
  Рядом кнопка (пока не понимаю где): Parameters by time zone
  
  1 столбец - parameters (как в mean)
  2 столбец - Home Mean +-SD  (средние параметры дома)
  3 столбец - Away Mean +- SD (средние параметры вне дома)
  4ый и далее - 01.11.2019-07.11.2019 GMT+10 (средние параметры по поездкам)
- перенести logout в верхнее меню
- Меню добавить в селект
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
