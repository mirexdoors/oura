import axios from "axios";

export const getAllInfoFromDateArray = async (dates, token) => {
    const result = [];

    for (const date of dates) {
        result.push(await getData(date, token));
    }

    return result;
};

const filteredData = (data) => {
    if (data.sleep) {
        return {
            sleep: data.sleep.map((item) => {
                return {
                    bedtime_start: item.bedtime_start,
                    bedtime_end: item.bedtime_end,
                    score: item.score,
                    total: item.total,
                    duration: item.duration,
                    awake: item.awake,
                    light: item.light,
                    rem: item.rem,
                    deep: item.deep,
                    summary_date: item.summary_date,
                    onset_latency: item.onset_latency,
                    restless: item.restless,
                    efficiency: item.efficiency,
                    midpoint_time: item.midpoint_time,
                    hr_lowest: item.hr_lowest,
                    hr_average: item.hr_average,
                    rmssd: item.rmssd,
                    breath_average: item.breath_average,
                    temperature_delta: item.temperature_delta,
                };
            }),
        };
    } else if (data.activity) {
        return {
            activity: data.activity.map((item) => {
                return {
                    score: item.score,
                    daily_movement: item.daily_movement,
                    non_wear: item.non_wear,
                    rest: item.rest,
                    inactive: item.inactive,
                    summary_date: item.summary_date,
                    steps: item.steps,
                    cal_total: item.cal_total,
                    cal_active: item.cal_active,
                    met_min_medium_plus: item.met_min_medium_plus,
                    average_met: item.average_met,
                    timezone: item.timezone,
                };
            }),
        };
    } else if (data.readiness) {
        return {
            readiness: data.readiness.map((item) => {
                return {
                    score: item.score,
                    summary_date: item.summary_date,
                };
            }),
        };
    }
};

export const getSleepAndActiveInfo = async (payload, token, request) => {
    let {start, end} = payload;

    if (Array.isArray(payload)){
        start = payload[0].start;
        end = payload[0].end;
    }

    return await axios.get(
        `https://api.ouraring.com/v1/${request}?access_token=${token}&start=${start}&end=${end}`
    );
};

export const getDataFromRaw = (payload) => {
    let dataObj = {};

    if (payload !== null) {
        payload.forEach(item => {
            let obj = filteredData(item.data);
            if (obj.sleep) dataObj.sleep = obj.sleep;
            if (obj.activity) dataObj.activity = obj.activity;
            if (obj.readiness) dataObj.readiness = obj.readiness;
        });
    }
    return dataObj;
};

const getData = async (dates, token) => {

    return await axios
        .all([
            getSleepAndActiveInfo(dates, token, "sleep"),
            getSleepAndActiveInfo(dates, token, "activity"),
            getSleepAndActiveInfo(dates, token, "readiness"),
        ])
};
