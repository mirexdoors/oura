const APINames = {
  sleep: {
    bedtime_start: 'Bedtime',
    bedtime_end: 'Get-out-of-bed time',
    score: 'Sleep score',
    total: 'Time asleep',
    duration: 'Time in bed',
    awake: 'Time awake in bed',
    light: 'Light sleep',
    rem: 'REM sleep',
    deep: 'Deep sleep',
    onset_latency: 'Sleep latency',
    restless: 'Restlessness',
    efficiency: 'Sleep efficiency',
    midpoint_time: 'Sleep midpoint',
    hr_lowest: 'Lowest HR',
    hr_average: 'Average HR',
    rmssd: 'Average HRV',
    breath_average: 'Respiratory rate',
    temperature_delta: 'Temperature dev',
  },
  activity: {
    score: 'Activity score',
    daily_movement: 'Walking equivalent',
    non_wear: 'Non-wear time',
    rest: 'Resting time',
    inactive: 'Inactive time',
    steps: 'Steps',
    cal_total: 'Total burn',
    cal_active: 'Activity burn',
    met_min_medium_plus: 'Medium+ METs',
    average_met: 'Average METs',
  },
  readiness: {
    score: 'Readiness score'
  }
};
const getSecondsToday = (date) => {
  const d = new Date(date);
  return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
};

const getCorrelation = (summ, deviationX, deviationY) => {
  return ((summ) / Math.sqrt(deviationX * deviationY))
      .toFixed(3);
};

export const dataTableCoeffHelper = (data) => {
  const result = [];
  const parameters = [];
  const tempNames = [];
  let tempSumm = {};
  //1. Собираем все параметры в 1 массив в виде объекта
  for (const dataCategory in data) {
    data[dataCategory].forEach(item => {
      for (const param in item) {
        if (item[param] !== undefined) {
          if (typeof item[param] !== 'number') {
            if (new Date(item[param]) != 'Invalid Date')
              item[param] = getSecondsToday(item[param]);
          }
          const appName = APINames[dataCategory][param];
          if (!tempNames.includes(appName)) {
            tempNames.push(appName);
            parameters.push({
              name: appName,
              summ: 0,
              deviation: 0
            });
          }
        }
      }
    });
  }


  //2.Данные сведем в одну таблицу:
  for (const dataCategory in data) {
    data[dataCategory].forEach((item, index) => {
      for (const param in item) {
        if (item[param] !== undefined) {
          const appName = APINames[dataCategory][param];
          if (!Object.prototype.hasOwnProperty.call(tempSumm, index)) tempSumm[index] = {};
          tempSumm[index][appName] = item[param];
        }
      }
    });
  }
  //3. Вычисляем суму значений параметра
  const summOfParam = {};
  for (let index in tempSumm) {
    for (let param in tempSumm[index]) {
      if (!summOfParam[param]) summOfParam[param] = 0;
      summOfParam[param] = summOfParam[param] + tempSumm[index][param];
    }
  }

  //4. Вычисляем среднее арифметическое
  const averageOfParam = {};
  for (let index in tempSumm) {
    for (let param in tempSumm[index]) {
      averageOfParam[param] = summOfParam[param] / (Number(index) + 1);
    }
  }

  //5 Вычисляем для каждого испытуемого отклонения от
  // среднего арифметического
  const devForDay = {};
  for (let day in tempSumm) {
    devForDay[day] = {};
    for (let param in tempSumm[day])
      devForDay[day][param] = averageOfParam[param] - tempSumm[day][param];
  }
//6 Возводим в квадрат каждое
  const sqrDevForDay = {};
  for (let day in devForDay) {
    sqrDevForDay[day] = {};
    for (let param in devForDay[day])
      sqrDevForDay[day][param] = devForDay[day][param] * devForDay[day][param];
  }

  //7 Потом рассчитываем сумма квадратов отклонений
  const summOfSqrDevForDay = {};
  for (let day in sqrDevForDay) {
    for (let param in sqrDevForDay[day]) {
      if (!summOfSqrDevForDay[param]) summOfSqrDevForDay[param] = 0;
      summOfSqrDevForDay[param] = summOfSqrDevForDay[param] + sqrDevForDay[day][param];
    }
  }


//8.Рассчитываем для каждого наблюдения произведение
// разности среднего арифметического и значения (для каждой
// пары)
  const linkParams = {};
  for (let day in devForDay) {
    linkParams[day] = {};
    const keys = Object.keys(devForDay[day]);
    for (let param in devForDay[day]) {
      keys.forEach(item => {
      if (item !== param && !Object.prototype.hasOwnProperty.call(linkParams[day], item + '$' + param)) {
        const key = param + '$' + item;

        linkParams[day][key] = devForDay[day][param] * devForDay[day][item];
      }
      });
    }
  }

  //9 получаем сумму произведений для каждой пары
  const summLinkParams = {};
  for (let day in linkParams) {
    for (let param in linkParams[day]) {
      if (!summLinkParams[param]) summLinkParams[param] = 0;
      summLinkParams[param] = summLinkParams[param] + linkParams[day][param];
    }
  }


  //2. Заполняем результирующий массив (должно быть 378 пар)
  parameters.forEach((item, index) => {
    for (let i = index + 1; i < parameters.length; i++) {
      const anotherParam = parameters[i];
      let key = item.name + '$' + anotherParam.name;
      if (!Object.prototype.hasOwnProperty.call(summLinkParams,  item.name + '$' + anotherParam.name)) {
        key = anotherParam.name + '$' + item.name;
      }

      const paramSumm = summLinkParams[key];
      result.push({
        name_1: item.name,
        name_2: anotherParam.name,
        coeff: getCorrelation(paramSumm, summOfSqrDevForDay[item.name], summOfSqrDevForDay[anotherParam.name])
      });
    }
  });

  return result;
};
