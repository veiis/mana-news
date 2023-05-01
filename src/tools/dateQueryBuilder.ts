export const dateQueryBuilder = (date: Date) => {
    const start = new Date(date);
    const end = new Date(date);
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(23, 59, 59, 999);

    return { start, end };
};

export const extractStartAndEndOfDay = (s: Date, e: Date) => {
    const start = new Date(s);
    const end = new Date(e);
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(23, 59, 59, 999);

    return { startAt: start, endAt: end };
};
