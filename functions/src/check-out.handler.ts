import { Request, Response } from 'firebase-functions';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { dateToPeriod, DB_REF, ResponseService } from './app-references';
import {
    dbRefValue$, updateOffsetAllowance$,
    updateRenderedTime$
} from './monitor-info.service';
import { RenderedTime, TimeMonitoringInfo } from './time-monitor-info.model';
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
export const handler = (request: Request, resp: Response) => {
    const respService = new ResponseService(resp);
    const timeOut = new Date();
    dbRefValue$(DB_REF.root).pipe(
        map((monitorInfo: TimeMonitoringInfo) => {
            const today: RenderedTime = monitorInfo.renderedTimes.find(time =>
                time.period === dateToPeriod(timeOut))
            const timeDiff = timeOut.getTime() - (new Date(today.timeIn)).getTime();
            const renderedToday = timeDiff / (1000 * 60 * 60);
            const accruedOffset = (monitorInfo.offsetAllowance || 0) +
                (renderedToday - monitorInfo.requiredDailyHours);
            return [{
                ...today, timeOut: timeOut.toUTCString(),
                renderedHours: renderedToday
            } as RenderedTime, accruedOffset, monitorInfo.renderedTimes]
        }),
        tap(rendered => updateRenderedTime$(rendered[0] as RenderedTime,
            rendered[2] as any)),
        tap(rendered => updateOffsetAllowance$(rendered[1] as number)),
        map(renderedBody => {
            const renderdTime = renderedBody[0] as RenderedTime;
            const offsetAllowance = renderedBody[1];
            return {
                timeIn: renderdTime.timeIn, timeOut: renderdTime.timeOut,
                rendered: renderdTime.renderedHours, offset: offsetAllowance
            }
        }),
        catchError(() => of(false))
    ).subscribe(okResponse => okResponse ? respService.sendOK(okResponse) :
        respService.sendError());
}