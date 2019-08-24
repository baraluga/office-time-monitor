import { Response } from 'firebase-functions';

export const DB_REF = {
    root: '/',
    monthlyCutoff: '/monthlyCutoff',
    offDays: '/offDays',
    offsetAllowance: '/offsetAllowance',
    renderedTimes: '/renderedTimes',
    requiredDailyHours: '/requiredDailyHours',
    requiredDays: '/requiredDays'
}

export const dateToPeriod = (date: Date) =>
    `${date.getFullYear()}${date.getMonth()}${date.getDate()}`

export const doNothing = () => undefined;

export const dateToString = (date: Date) => date.toUTCString();

export const stringToDate = (utc: string) => new Date(utc)

export class ResponseService {
    private response: Response;
    constructor(responseObj: Response) { this.response = responseObj; }

    sendOK = (body?: any, status?: number) =>
        this.response.status(status || 200).json(body)

    sendError = (message?: string, status?: number) =>
        this.response.status(status || 500).json(
            { error: message || 'something went wrong!' }
        );
}