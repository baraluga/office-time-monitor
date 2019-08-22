import { database } from 'firebase-admin';
import { Request, Response } from 'firebase-functions';
import { from } from 'rxjs';
import { first } from 'rxjs/operators';
import { dateToPeriod, DB_REF } from './app-references';
import { RenderedTime } from './time-monitor-info.model';
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
    const timeOut = new Date();
    const refRenderedHours = database().ref(DB_REF.renderedTimes);
    from(refRenderedHours.once('value')).pipe(
        first()
    ).subscribe(snapshot => {
        const renderedHoursByPeriods = [...snapshot.val()]
            .filter((time: RenderedTime) =>
                time.period === dateToPeriod(timeOut));
        const today: RenderedTime = renderedHoursByPeriods[renderedHoursByPeriods.length - 1];
        const timeDiff = timeOut.getTime() - (new Date(today.timeIn)).getTime();
        const renderedToday = timeDiff / (1000 * 60 * 60);
        // Update renderedTime instance
        resp.send(`You've rendered ${renderedToday} hours today!`)
    })
}
