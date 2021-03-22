import {db} from "@/db";

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
        timezone: 'timezone'
    },
    readiness: {
        score: 'Readiness score'
    }
};

export const TIME_PARAMS = [
    'Time asleep', 'Time in bed', 'Time awake in bed', 'Light sleep', 'REM sleep', 'Deep sleep', 'Sleep midpoint', 'Inactive time', 'Resting time', 'Non-wear time'
];

export const getHHmmFromDateObject = (str) => new Date(str).toTimeString().split(' ')[0];

export const getSecondsFromTime = (str) => {
    const ar = str.toString().split(':');
    return ar[0] * 3600 + ar[1] * 60;
};

export const getTimeFromMinutes = (time) => {
    const hours = Math.floor(time / 60);
    const minutes = time - hours * 60;
    let formattedHours = hours.toString().padStart(2, '0');

    return [
        formattedHours,
        minutes.toString().padStart(2, '0'),
    ].join(':');
};

const getSecondsToday = (date) => {
    const getOffset = (s) => {
        return (s.match(/z$|[+-]\d\d:\d\d$/i) || [])[0];
    };

    const offsetToMins = (offset) => {
        // Deal with Z or z
        if (/z/i.test(offset)) return 0;
        // Deal +/-HH:mm
        const sign = /^-/.test(offset) ? '1' : '-1';
        const [h, m] = offset.slice(-5).split(':');
        return sign * h * 60 + +m;
    };

    const userTimezone = new Date().getTimezoneOffset();
    const d = new Date(date);
    const offset = getOffset(date);

    if (offset !== undefined) {
        const dateTimeZone = offsetToMins(offset);

        let resultSeconds = d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();

        if (dateTimeZone !== userTimezone) {
            resultSeconds = resultSeconds + ((userTimezone - dateTimeZone) * 60);
        }

        return resultSeconds;
    }
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

const getIterationCount = (param, summa, timezone = false, isForAway = false) => {
    let i = 0;
    summa.forEach(item => {
        if (!timezone) {
            if (Object.prototype.hasOwnProperty.call(item, param)) i++;
        } else {
            if (!isForAway) {
                if (item.timezone === timezone && Object.prototype.hasOwnProperty.call(item, param)) i++;
            } else {
                if (item.timezone !== timezone && Object.prototype.hasOwnProperty.call(item, param)) i++;
            }
        }
    });
    return i;
};

const getAverageForParams = (summa, summaForParam, timezone = false, isForAway = false) => {
    const averageOfParam = {};


    for (let index in summa) {
        for (let param in summa[index]) {
            const coeff = getIterationCount(param, summa, timezone, isForAway);


            if (summa[index][param]) {
                if (timezone) {
                    if (!isForAway) {
                        if (Number(summa[index].timezone) === timezone) {
                            averageOfParam[param] = (summaForParam[param] / coeff).toFixed(2);
                        }
                    } else {
                        if (Number(summa[index].timezone) !== timezone) {
                            averageOfParam[param] = (summaForParam[param] / coeff).toFixed(2);
                        }
                    }
                } else {
                    averageOfParam[param] = (summaForParam[param] / (coeff)).toFixed(2);
                }
            }
        }
    }
    return averageOfParam;
};

const getSummForParam = (summa, timezone = false, isForAwayTimeZone = false) => {

    const summOfParam = {};
    summa.forEach((day, index) => {
        for (let param in summa[index]) {
            if (param !== 'summary_date') {
                if (timezone) {
                    if (!summOfParam[param]) summOfParam[param] = 0;
                    if (!isForAwayTimeZone) {
                        if (Number(summa[index].timezone) === timezone) {
                            summOfParam[param] = summOfParam[param] + Number(summa[index][param]);
                        }
                    } else {
                        if (Number(summa[index].timezone) !== timezone) {
                            summOfParam[param] = summOfParam[param] + Number(summa[index][param]);
                        }
                    }
                } else {
                    if (!summOfParam[param]) summOfParam[param] = 0;
                    summOfParam[param] = summOfParam[param] + summa[index][param];
                }
            }
        }
    });

    return summOfParam;
};

export const getTimeFromSeconds = (time, isDay = false) => {
    const hours = Math.floor(time / 3600);
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

const getTempSumm = (data, isCorr = false, isForTimeZone = false) => {
    const tempData = JSON.parse(JSON.stringify(data));
    let tempSummDates = [];

    //заполним дни по датам
    tempData.activity.forEach((item) => {
            tempSummDates.push({
                summary_date: item.summary_date
            });
        }
    );

    //2.Данные сведем в одну таблицу:
    for (const dataCategory in tempData) {
        tempData[dataCategory].forEach((item, index) => {

            for (const param in item) {
                if (item[param] !== undefined) {

                    let appName = APINames[dataCategory][param];
                    if (param === 'summary_date') {
                        appName = 'summary_date';
                    }
                    if (param === 'bedtime_start' || param === 'bedtime_end') {
                        item[param] = getSecondsToday(item[param]);
                    }
                    if (param == 'bedtime_start' && (item[param] < 43200)) {
                        item[param] = item[param] + 86400;
                    }

                    const currentItem = tempSummDates.filter(current => current.summary_date === item.summary_date);

                    if (currentItem[0] && appName !== 'summary_date')
                        currentItem[0][appName] = item[param];

                    if (!isForTimeZone && param === 'timezone') {
                        delete currentItem[0].timezone
                    }

                    if (isCorr && param !== 'timezone') {
                        if (tempData[dataCategory][index - 1])
                            currentItem[0][appName + ' prev. day'] = tempData[dataCategory][index - 1][param];
                        if (tempData[dataCategory][index + 1])
                            currentItem[0][appName + ' next day'] = tempData[dataCategory][index + 1][param];
                    }
                }
            }
        });
    }
    return tempSummDates;
};

export const getMeans = (summa) => {
    const summOfParam = getSummForParam(summa);
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
    summa = JSON.parse(JSON.stringify(summa));

    const devForDay = getDevForDay(summa, averages);
    const sqrDevForDay = getSqrDevForDay(devForDay);
    const summOfSqrDevForDay = getSummOfSqrDevForDay(sqrDevForDay);
    return getDeviation(summOfSqrDevForDay, length);
};

export const getWeekDay = (date) => {
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

export const getAverageWithoutSD = (data) => {
    const result = {};

    const parameters = getParameters(data);
    const tempSummData = getTempSumm(data);
    const means = getMeans(tempSummData);

    parameters.forEach(item => {
        if (item !== 'timezone') {
            result[item] = Number(Number(means[item]).toFixed(2));
        }
    });

    return result;
};

export const getUserSummaryDateObject = (data) => {
    return getTempSumm(data);
};

const getUsersAverage = async (dates) => {
    const temporaryData = [];
    const notDisplayedFields = [
        'timezone',
    ];


    await db.collection('parameters')
        .where('summary_date', '>=', dates.start)
        .where('summary_date', '<=', dates.end)
        .get()
        .then(querySnapshots => {
            querySnapshots.forEach(doc => {
                temporaryData.push(doc.data());
            });
        });


    if (temporaryData.length > 0) {
        const averageValuesMap = temporaryData.reduce((acc, currentItem) => {
            for (const parameter in currentItem) {
                if (typeof currentItem[parameter] === 'number' && !notDisplayedFields.includes(parameter)) {

                    if (acc.has(parameter)) {
                        const newVal = acc.get(parameter) + currentItem[parameter]
                        acc.set(parameter, newVal);
                    } else {
                        acc.set(parameter, currentItem[parameter]);
                    }
                }
            }
            return acc;
        }, new Map());

        averageValuesMap.forEach((item, key, map) => {
                let value = Number((item / temporaryData.length).toFixed(2));

                if (key === 'Bedtime' || key === 'Get-out-of-bed time') {
                    value = getTimeFromSeconds(value, true);
                }

                if (key === 'Inactive time' || key === 'Resting time' || key === 'Non-wear time') {
                    value = (value * 60).toFixed(2);
                }

                if (TIME_PARAMS.includes(key)) {
                    value = getTimeFromSeconds(value);
                }

                map.set(key, value);
            });

        //get standard deviations
        const allUsersAverageSD = getSD(temporaryData, Object.fromEntries(averageValuesMap));
        averageValuesMap.forEach((value, key, map) => {
            let newValue = value;
            if (!isNaN(allUsersAverageSD[key])) {
               newValue += ` ± ${allUsersAverageSD[key]}`;
            }
            map.set(key, newValue);
        });

        return averageValuesMap;
    }
    return [];
};

export const dataTableMeanInfo = async (data, yearData, dates) => {
    const result = [];
    const parameters = getParameters(data);
    const tempSummData = getTempSumm(data);
    const tempSummYearData = getTempSumm(yearData);

    const means = getMeans(tempSummYearData);
    const ranges = getMeans(tempSummData);
    const meansSD = getSD(tempSummYearData, means);
    const rangesSD = getSD(tempSummData, ranges);

    const usersAverage = await getUsersAverage(dates);

    parameters.forEach(item => {
        if (item !== 'timezone') {
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

            result.push({
                parameter: item,
                mean: itemMean,
                range: itemRange,
                users_mean: usersAverage.get(item),
            })
        }
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
                if (getCorrelation(paramSumm, summOfSqrDevForDay[item.name], summOfSqrDevForDay[anotherParam.name]) != 'NaN') {
                    result.push({
                        name_1: item.name,
                        name_2: anotherParam.name,
                        coeff: getCorrelation(paramSumm, summOfSqrDevForDay[item.name], summOfSqrDevForDay[anotherParam.name]),
                    });
                }
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
        if (item !== 'timezone') {
            const element = {parameter: item};
            for (const day in meanByday) {
                if (Object.prototype.hasOwnProperty.call(meanByday[day], item)) {
                    if (meanByday[day][item] !== 'NaN' && meanByday[day][item] !== 'undefined') {
                        element[day] = meanByday[day][item];
                    }
                }

            }
            result.push(element)
        }
    });
    return result;
};

export const calcOffset = (offsetAtSeconds) => {
    const offsetPosition = offsetAtSeconds > 0 ? '+' : '';
    return `UTC/GMT ${offsetPosition} ${getTimeFromSeconds(offsetAtSeconds)}`
};

const getDaysAtTimeZones = (tmpData, timeZone) => {
    const initialValue = 0;
    const reducerNative = (accumulator, currentDay) => {
        if (currentDay.timezone === timeZone) {
            return 1 + accumulator;
        } else return accumulator;
    };

    const reducerOutside = (accumulator, currentDay) => {
        if (!!currentDay.timezone && currentDay.timezone !== timeZone) {
            return 1 + accumulator;
        } else return accumulator;
    };

    const reducerNoInfo = (accumulator, currentDay) => {
        if (!currentDay.timezone) {
            return 1 + accumulator;
        } else return accumulator;
    };

    return {
        native: tmpData.reduce(reducerNative, initialValue),
        outside: tmpData.reduce(reducerOutside, initialValue),
        noInfo: tmpData.reduce(reducerNoInfo, initialValue),
    };
};
const getMinutesTimeZone = (gmt) => {
    const timeZone = getMinutesTimeZoneHelper(gmt);

    const timeZoneArray = timeZone.split(':');
    if (timeZone.indexOf('-') > -1)
        return Number(timeZoneArray[0] * 60) - Number(timeZoneArray[1]);
    else
        return Number(timeZoneArray[0] * 60) + Number(timeZoneArray[1]);
};

const getMinutesTimeZoneHelper = (gmt) => {
    const timeZoneArray = gmt.split(' ');
    let timeZone = null;
    if (timeZoneArray[1] === '+') {
        timeZone = timeZoneArray[2];
    } else {
        timeZone = 0 - timeZoneArray[2];
    }
    return timeZone;
};

export const travelDaysHelper = (data, info) => {

    const timeZoneAtMinutes = getMinutesTimeZone(info.gtmOffset);

    const tempSumm = getTempSumm(data, false, true);
    const infoTZ = getDaysAtTimeZones(tempSumm, timeZoneAtMinutes);
    return [
        {
            name: 'Number of days in the native time zone' +
                ' (including DST)',
            value: infoTZ.native,
        },
        {
            name: 'Number of days outside your home time zone' +
                ' (amount)',
            value: infoTZ.outside,
        },
        {
            name: 'Number of days without timezone info',
            value: infoTZ.noInfo,
        },
    ];
};
const getGmtFromTimeZone = (minutes) => {
    let gmt = '';

    if (minutes > 0)
        gmt += '+ ';
    else
        gmt += '- ';

    let hours = Math.trunc(minutes / 60);
    if (hours < 10) hours = '0' + hours;

    gmt += hours + ':';

    let gmtMinutes = minutes % 60;
    if (gmtMinutes === 0) gmtMinutes = '00';
    gmt += gmtMinutes;

    gmt += ' GMT';
    return gmt;
};

const getPeriods = (days) => {
    return days.reduce((current, day, index, array) => {
        if (index === 0) {
            current.push({
                gmt: getGmtFromTimeZone(day.timezone),
                row: 1,
                start: day.summary_date,
                end: day.summary_date,
            });
        } else {
            if ((getGmtFromTimeZone(day.timezone) === getGmtFromTimeZone(array[index - 1].timezone))) {
                current[current.length - 1].row += 1;
                current[current.length - 1].end = day.summary_date;
            } else {

                current.push({
                    gmt: getGmtFromTimeZone(day.timezone),
                    row: 1,
                    start: day.summary_date,
                    end: day.summary_date,
                });
            }
        }
        return current;
    }, []);
};

export const getTravelPeriods = (data) => {
    return getPeriods(data.activity);
};

export const getPeriodsForParams = (data) => {
    return data.map((item, index) => {
        return {
            text: item.start + ' — ' + item.end + ' (' + item.gmt + ')',
            value: 'period' + index,
            sortable: false,
        }
    })
};

export const getMeansByTimezone = (summ, timezone, isForAway = false) => {
    const summOfParam = getSummForParam(summ, timezone, isForAway);
    return getAverageForParams(summ, summOfParam, timezone, isForAway);
};

export const getMeanParamsForTimeZone = (data, timezone, periods) => {
    const result = [];
    const timeZoneAtMinutes = getMinutesTimeZone(timezone);
    const parameters = getParameters(data);
    const tempSummData = getTempSumm(data, false, true);
    const tempSummDataHome = tempSummData.filter((item) => item.timezone === timeZoneAtMinutes);
    const tempSummDataAway = tempSummData.filter((item) => item.timezone !== timeZoneAtMinutes);
    const meansHome = getMeansByTimezone(tempSummDataHome, timeZoneAtMinutes);

    const meansAway = getMeansByTimezone(tempSummDataAway, timeZoneAtMinutes, true);
    const meansHomeSD = getSD(tempSummDataHome, meansHome);
    const meansAwaySD = getSD(tempSummDataAway, meansAway);

    //разбиваем общий массив дат по параметрам
    const dataByPeriods = periods.map(period => {
        return tempSummData.filter(day => {
            return new Date(day.summary_date) >= new Date(period.start) && new Date(day.summary_date) <= new Date(period.end);
        })
    });

    // передаём в sd
    const meansByPeriods = dataByPeriods.map((period) => {
        let meanData = [];
        if (period[0].timezone === timeZoneAtMinutes) {
            meanData = getMeansByTimezone(period, timeZoneAtMinutes);
        } else {
            meanData = getMeansByTimezone(period, timeZoneAtMinutes, true);
        }
        return {
            mean: meanData,
            sd: getSD(period, meanData)
        };
    });

    parameters.map(item => {
        if (item !== 'timezone') {
            if (item === 'Bedtime' || item === 'Get-out-of-bed time') {
                meansHome[item] = getTimeFromSeconds(meansHome[item], true);
                if (meansAway[item] !== undefined)
                    meansAway[item] = getTimeFromSeconds(meansAway[item], true);
            }

            if (item === 'Inactive time' || item === 'Resting' +
                ' time' || item === 'Non-wear time') {
                meansHome[item] = meansHome[item] * 60;
                if (meansAway[item] !== undefined)
                    meansAway[item] = meansAway[item] * 60;
            }

            if (TIME_PARAMS.includes(item)) {
                meansHome[item] = getTimeFromSeconds(meansHome[item]);
                if (meansAway[item] !== undefined)
                    meansAway[item] = getTimeFromSeconds(meansAway[item]);
            }

            const itemHome = meansHome[item] + ' ± ' + meansHomeSD[item];

            let itemAway = 'no data';
            if (meansAway[item] !== undefined)
                itemAway = meansAway[item] + ' ± ' + meansAwaySD[item];

            const paramValue = {
                param: item,
                home_mean: itemHome,
                away_mean: itemAway,
            };

            meansByPeriods.forEach((period, index) => {
                if (item === 'Bedtime' || item === 'Get-out-of-bed time') {
                    period.mean[item] = getTimeFromSeconds(period.mean[item], true);
                }

                if (item === 'Inactive time' || item === 'Resting' +
                    ' time' || item === 'Non-wear time') {
                    period.mean[item] = period.mean[item] * 60;
                }

                if (TIME_PARAMS.includes(item)) {
                    period.mean[item] = getTimeFromSeconds(period.mean[item]);
                }
                if (period.mean[item] === undefined || period.mean[item] === 'NaN:NaN') paramValue['period' + index] = 'no data';
                else
                    paramValue['period' + index] = period.mean[item] + ' ± ' + period.sd[item];
            });

            result.push(paramValue);
        }
    });
    return result;
};
