export interface RenderedTime {
    period: string;
    renderedHours?: number;
    timeIn: string;
    timeOut?: string;
}

export interface TimeMonitoringInfo {
    requiredDays: number;
    offDays: number;
    requiredDailyHours: number;
    renderedTimes: Array<any>;
    monthlyCutoff: number;
    offsetAllowance: number;
};
