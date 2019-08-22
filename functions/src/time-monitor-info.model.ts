export interface RenderedTime {
    hours?: number;
    period: string;
    timeIn?: Date;
    timeOut?: Date;
}

export interface TimeMonitoringInfo {
    requiredDays: number;
    offDays: number;
    requiredDailyHours: number;
    renderedHours: Array<any>;
    monthlyCutoff: number;
    offsetAllowance: number;
};
