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

const TIME_PARAMS = [
  'Time asleep', 'Time in bed', 'Time awake in bed', 'Light sleep', 'REM sleep', 'Deep sleep', 'Sleep midpoint', 'Inactive time', 'Resting time', 'Non-wear time'
];
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
        if (APINames[category][param]) {
          const appName = APINames[category][param];
          if (!result.includes(appName) && !['Medium+ METs'].includes(appName)) {
            result.push(appName);
          }
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
const getTimeFromSeconds = (time, isDay = false) => {
  const hours = Math.floor(time / 60 / 60);
  const minutes = Math.floor(time / 60) - (hours * 60);
  let formattedHours = hours.toString().padStart(2, '0');
  if (isDay && hours.toString().padStart(2, '0') > 23) {
    formattedHours = 0;
  }
  return [
    formattedHours,
    minutes.toString().padStart(2, '0'),
  ].join(':');
};
const getTempSumm = (data, isCorr = false) => {
  const tempSumm = [];
  //2.Данные сведем в одну таблицу:
  for (const dataCategory in data) {
    data[dataCategory].forEach((item, index) => {
      for (const param in item) {
        if (item[param] !== undefined) {
          let appName = APINames[dataCategory][param];
          if (param === 'summary_date') {
            appName = 'summary_date';
          }
          if (param == 'bedtime_start' || param == 'bedtime_end') {
            item[param] = getSecondsToday(item[param]);
          }
          if (param == 'bedtime_start' && (item[param] < 43200))
            item[param] = item[param] + 86400;


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
    deviation[param] = Math.sqrt(summOfSqrDevForDay[param] / length).toFixed(1);

    if (param === 'Bedtime' || param === 'Get-out-of-bed time') {
      deviation[param] = getTimeFromSeconds(deviation[param]);
    }
    if (param === 'Inactive time' || param === 'Resting' +
        ' time' || param === 'Non-wear time') deviation[param] = deviation[param] * 60;

    if (TIME_PARAMS.includes(param)) deviation[param] = getTimeFromSeconds(deviation[param]);
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

const getWeekDay = (date) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date(date).getDay()];
};
const getSummByDay = (summa) => {
  const days = {
    monday: {},
    tuesday: {},
    wednesday: {},
    thursday: {},
    friday: {},
    saturday: {},
    sunday: {}
  };
  summa.forEach(item => {
    //определяем день недели
    const weekDay = getWeekDay(item.summary_date);
    for (const param in item) {
      if (Object.prototype.hasOwnProperty.call(days[weekDay], param)) {
        days[weekDay][param] += item[param];
      } else {
        days[weekDay][param] = item[param];
      }
    }
  });
  return days;
};
const getDaysWithParam = (parameter, tmpSumm) => {
  console.log(tmpSumm)
  const result = {
    sunday: 0,
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
  };
  tmpSumm.forEach(item => {
    if (item[parameter]) {
      //определяем здесь день недели и записываем в свойство
      const day = getWeekDay(item['summary_date']);
      result[day]++;
    }
  });
  console.log(result);
  return result;
};

const getMeanByDay = (days, tmpSumm) => {
  for (const day in days) {
    for (const param in days[day]) {

//найдем количество элементов, в которых встречается
// параметр пот дням недели
      const daysWithParam = getDaysWithParam(param, tmpSumm);

      days[day][param] = (days[day][param] / daysWithParam[day]).toFixed(2);
      if (param === 'Bedtime' || param === 'Get-out-of-bed time') {
        days[day][param] = getTimeFromSeconds(days[day][param], true);
      }
      if (param === 'Inactive time' || param === 'Resting' +
          ' time' || param === 'Non-wear time') days[day][param] = days[day][param] * 60;
      if (TIME_PARAMS.includes(param)) days[day][param] = getTimeFromSeconds(days[day][param]);
    }
  }
  return days;
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

    if (item === 'Bedtime' || item === 'Get-out-of-bed time') {
      means[item] = getTimeFromSeconds(means[item], true);
      ranges[item] = getTimeFromSeconds(ranges[item], true);
    }

    if (item === 'Inactive time' || item === 'Resting' +
        ' time' || item === 'Non-wear time') {
      means[item] = means[item] * 60;
      ranges[item] = ranges[item] * 60;
    }

    if (TIME_PARAMS.includes(item)) {
      means[item] = getTimeFromSeconds(means[item]);
      ranges[item] = getTimeFromSeconds(ranges[item]);
    }

    const itemMean = means[item] + ' ± ' + meansSD[item];
    let itemRange = ranges[item] + ' ± ' + rangesSD[item];
    // if (rangesSD[item] > 0 && rangesSD[item] !== '0:00')
    // { itemRange +=  ' ± ' + rangesSD[item]; }

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
          if (APINames[dataCategory][param]) {
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
      }
    });
  }


  //2.Данные сведем в одну таблицу:
  const tempSumm = getTempSumm(data, true);
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

export const dataTableDaysInfo = (data) => {
  const result = [];
  const tempSumm = getTempSumm(data);

  const summByDay = getSummByDay(tempSumm);

  const meanByday = getMeanByDay(summByDay, tempSumm);

  const parameters = getParameters(data);
  parameters.forEach(item => {
    const element = {parameter: item};
    for (const day in meanByday) {
      if (Object.prototype.hasOwnProperty.call(meanByday[day], item)) {
        if (meanByday[day][item] !== 'NaN' && meanByday[day][item] !== 'undefined') {
          element[day] = meanByday[day][item];
        }
      }

    }
    result.push(element)
  });
  return result;
};

export const calcOffset = (offsetAtSeconds) => {
  const offsetPosition = offsetAtSeconds > 0 ? '+' : '';
  return `UTC/GMT ${offsetPosition} ${getTimeFromSeconds(offsetAtSeconds)}`
};
