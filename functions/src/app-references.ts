import { Response } from 'firebase-functions';

export const DB_REF = {
    root: '/',
    renderedTimes: '/renderedTimes'
}

export const REQUIRED_DAILY_HOURS = 8;
export const REQUIRED_MAN_DAYS = 20;

export const leadZero = (value: any) => String(value).padStart(2, '0')

export const dateToPeriodMonth = (date: Date) =>
    `${date.getFullYear()}${leadZero(date.getMonth())}`

export const dateToPeriod = (date: Date) =>
    `${dateToPeriodMonth(date)}${leadZero(date.getDate())}`

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