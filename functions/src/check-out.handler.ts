import { Request, Response } from 'firebase-functions';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {
    dateToPeriod, DB_REF, REQUIRED_DAILY_HOURS,
    ResponseService
} from './app-references';
import { dbRefValue$, updateRenderedTime$ } from './monitor-info.service';
import { RenderedTime, TimeMonitoringInfo, renderedTimeToHumanReadable } from './time-monitor-info.model';
/**
 * Function to handle the "check-out" of the day. This function should do:
 * 1. Record the current time stamp
 * 2. Compute renderedTime (get latest renderedTime.timeIn, subtract!)
 * 3. Update offsetAllowance
 * 4. Update renderedHours TODO: Not required?
 * 5. Respond with new offsetAllowance
 * @param request 
 * @param response 
 */
export const handler = (_: Request, resp: Response) => {
    const respService = new ResponseService(resp);
    const timeOut = new Date();
    dbRefValue$(DB_REF.root).pipe(
        map((monitorInfo: TimeMonitoringInfo) => {
            const today: RenderedTime = monitorInfo.renderedTimes.find(time =>
                time.period === dateToPeriod(timeOut))
            const timeDiff = timeOut.getTime() - (new Date(today.timeIn)).getTime();
            const renderedToday = timeDiff / (1000 * 60 * 60);
            const accruedOffset = ((monitorInfo.offsetAllowance || 0) +
                (renderedToday - REQUIRED_DAILY_HOURS)) * 60; // to minutes
            return [{
                ...today, timeOut: timeOut.toUTCString(),
                renderedHours: renderedToday,
                accruedOffset: Math.floor(accruedOffset)
            } as RenderedTime, monitorInfo.renderedTimes]
        }),
        tap(rendered => updateRenderedTime$(rendered[0] as RenderedTime,
            rendered[1] as any)),
        map(renderedBody => renderedTimeToHumanReadable(
            { ...renderedBody[0] } as RenderedTime)),
        catchError(() => of(false))
    ).subscribe(okResponse => okResponse ?
        respService.sendOK(okResponse) : respService.sendError());
}