export interface RenderedTime {
    period: string;
    renderedHours?: number;
    timeIn: string;
    timeOut?: string;
    accruedOffset?: number; // in minutes
}

export interface TimeMonitoringInfo {
    offDays: number;
    renderedTimes: Array<any>;
    monthlyCutoff: number;
    offsetAllowance: number;
};

export const renderedTimeToHumanReadable = (time: RenderedTime) => {
    const actualHours = time.renderedHours || 0;
    const wholeHours = Math.floor(actualHours);
    const wholeMinutes = Math.floor((actualHours - wholeHours) * 60);
    return {
        ...time,
        renderedHours: `${wholeHours} hour/s and ${wholeMinutes} minute/s`,
        accruedOffset: `${time.accruedOffset} minutes`
    }
}
