import { Request, Response } from 'firebase-functions';
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { database } from 'firebase-admin';
import { DB_REF, dateToPeriod } from './app-references';
import { RenderedTime } from './time-monitor-info.model';

const refRenderedHours = database().ref(DB_REF.renderedHours);
const refOffsetAllowance = database().ref(DB_REF.offsetAllowance);

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
export const handler = (request: Request, response: Response) => {
    const currentTime = new Date();
    from(refRenderedHours.once('value')).pipe(
        // Compute actual renderedHours
        tap(snapshot => {
            const renderedHoursByPeriods = [...snapshot.val()]
                .filter((time: RenderedTime) =>
                    time.period === dateToPeriod(currentTime));
            const today = renderedHoursByPeriods.length > 1 ?
                renderedHoursByPeriods[-1] : undefined;
        })
    );
}
