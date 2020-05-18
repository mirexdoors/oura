export const APINames = {
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


const getParameters = (data) => {
  const result = [];
  for (const category in data) {
    data[category].forEach(item => {
      for (const param in item) {
        const appName = APINames[category][param];
        if (!result.includes(appName) && !['Bedtime', 'Get-out-of-bed time'].includes(appName)) {
          result.push(appName);
        }
      }
    });
  }
  return result;
};

const getAverageForParams = (summa, summaForParam) => {
  const averageOfParam = {};
  for (let index in summa) {
    for (let param in summa[index]) {
      averageOfParam[param] = (summaForParam[param] / (Number(index) + 1)).toFixed(2);
    }
  }
  return averageOfParam;
};
const getSummForParam = (summa) => {
  //3. Вычисляем суму значений параметра
  const summOfParam = {};
  for (let index in summa) {
    for (let param in summa[index]) {
      if (!summOfParam[param]) summOfParam[param] = 0;
      summOfParam[param] = summOfParam[param] + summa[index][param];
    }
  }
  return summOfParam;
};

const getTempSumm = (data, isCorr = false) => {
  const tempSumm = [];
  //2.Данные сведем в одну таблицу:
  for (const dataCategory in data) {
    data[dataCategory].forEach((item, index) => {
      for (const param in item) {
        if (item[param] !== undefined) {
          const appName = APINames[dataCategory][param];
          if (!Object.prototype.hasOwnProperty.call(tempSumm, index)) tempSumm[index] = {};
          tempSumm[index][appName] = item[param];
          if (isCorr) {
            if (data[dataCategory][index - 1])
              tempSumm[index][appName + ' prev. day'] = data[dataCategory][index - 1][param];
            if (data[dataCategory][index + 1])
              tempSumm[index][appName + ' next day'] = data[dataCategory][index + 1][param];
          }
        }
      }
    });
  }
  return tempSumm;
};

export const getMeans = (data, summa) => {
  const summOfParam = getSummForParam(summa)
  return getAverageForParams(summa, summOfParam);
};

const getDevForDay = (summa, averages) => {
  //5 Вычисляем для каждого испытуемого отклонения от
  // среднего арифметического
  const devForDay = {};
  for (let day in summa) {
    devForDay[day] = {};
    for (let param in summa[day])
      devForDay[day][param] = averages[param] - summa[day][param];
  }
  return devForDay;
};

const getSqrDevForDay = (devForDay) => {
  //6 Возводим в квадрат каждое
  const sqrDevForDay = {};
  for (let day in devForDay) {
    sqrDevForDay[day] = {};
    for (let param in devForDay[day])
      sqrDevForDay[day][param] = devForDay[day][param] * devForDay[day][param];
  }
  return sqrDevForDay;
};

const getSummOfSqrDevForDay = (sqrDevForDay) => {
  //7 Потом рассчитываем сумма квадратов отклонений
  const summOfSqrDevForDay = {};
  for (let day in sqrDevForDay) {
    for (let param in sqrDevForDay[day]) {
      if (!summOfSqrDevForDay[param]) summOfSqrDevForDay[param] = 0;
      summOfSqrDevForDay[param] = summOfSqrDevForDay[param] + sqrDevForDay[day][param];
    }
  }
  return summOfSqrDevForDay;
};

const getDeviation = (summOfSqrDevForDay, length) => {
  const deviation = {};
  for (let param in summOfSqrDevForDay) {
    deviation[param] = Math.sqrt(summOfSqrDevForDay[param]/length).toFixed(1);
  }
  return deviation;
};

const getSD = (summa, averages) => {
  const length = summa.length;

  const devForDay = getDevForDay(summa, averages);
  const sqrDevForDay = getSqrDevForDay(devForDay);
  const summOfSqrDevForDay = getSummOfSqrDevForDay(sqrDevForDay);
  return getDeviation(summOfSqrDevForDay, length);
};

export const dataTableMeanInfo = (data, yearData) => {
  const result = [];

  const parameters = getParameters(data);
  const tempSummData = getTempSumm(data);

  const tempSummYearData = getTempSumm(yearData);
  const means = getMeans(data, tempSummYearData);
  const ranges = getMeans(yearData, tempSummData);
  const meansSD = getSD(tempSummYearData, means);
  const rangesSD = getSD(tempSummData, ranges);

  parameters.forEach(item => {
    const itemMean = means[item] + '±' + meansSD[item];
    const itemRange = ranges[item] + '±' + rangesSD[item];
    result.push({
      parameter: item,
      mean: itemMean,
      range: itemRange
    })
  });

  return result;
};

export const dataTableCoeffHelper = (data) => {
  const result = [];
  const parameters = [];
  const tempNames = [];
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
            //записываем текущий параметр и параметры
            // для +-дня
            parameters.push({
              name: appName,
            });
            parameters.push({
              name: appName + ' prev. day',
            });
            parameters.push({
              name: appName + ' next day',
            });
          }
        }
      }
    });
  }


  //2.Данные сведем в одну таблицу:
  const tempSumm = getTempSumm(data, true);
  console.log(tempSumm.length)
  //3. Вычисляем суму значений параметра
  const summOfParam = getSummForParam(tempSumm);

  //4. Вычисляем среднее арифметическое
  const averageOfParam = getAverageForParams(tempSumm, summOfParam);
  const devForDay = getDevForDay(tempSumm, averageOfParam);
  const sqrDevForDay = getSqrDevForDay(devForDay);
  const summOfSqrDevForDay = getSummOfSqrDevForDay(sqrDevForDay);


//8.Рассчитываем для каждого наблюдения произведение
// разности среднего арифметического и значения (для каждой
// пары)
  const linkParams = {};
  for (let day in devForDay) {
    linkParams[day] = {};
    const keys = Object.keys(devForDay[day]);
    for (let param in devForDay[day]) {
      keys.forEach(item => {
        if (item !== param &&
            !Object.prototype.hasOwnProperty.call(linkParams[day], item + '$' + param) &&
            !((param.indexOf('prev.') > -1 && item.indexOf('prev.') > -1)) &&
            !((param.indexOf('next day') > -1 && item.indexOf('next day') > -1)) &&
            !((param.indexOf('prev.') > -1 && item.indexOf('next day') > -1)) &&
            !((param.indexOf('next day') > -1 && item.indexOf('prev.') > -1)) &&
            ((param !== item + ' next day')) &&
            ((item !== param + ' next day'))
        ) {
          {

            const key = param + '$' + item;
            linkParams[day][key] = devForDay[day][param] * devForDay[day][item];
          }
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
      if (!Object.prototype.hasOwnProperty.call(summLinkParams, item.name + '$' + anotherParam.name)) {
        key = anotherParam.name + '$' + item.name;
      }
      if (Object.prototype.hasOwnProperty.call(summLinkParams, key)) {
        const paramSumm = summLinkParams[key];
        result.push({
          name_1: item.name,
          name_2: anotherParam.name,
          coeff: getCorrelation(paramSumm, summOfSqrDevForDay[item.name], summOfSqrDevForDay[anotherParam.name])
        });
      }
    }
  });
  return result;
};
