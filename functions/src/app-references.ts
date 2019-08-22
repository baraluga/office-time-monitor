export const DB_REF = {
    monthlyCutoff: '/monthlyCutoff',
    offDays: '/offDays',
    offsetAllowance: '/offsetAllowance',
    renderedHours: '/renderedHours',
    requiredDailyHours: '/requiredDailyHours',
    requiredDays: '/requiredDays'
}

export const dateToPeriod = (date: Date) =>
    `${date.getFullYear()}${date.getMonth()}${date.getDay()}`
