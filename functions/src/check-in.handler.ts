import { database } from 'firebase-admin';
import { Request, Response } from 'firebase-functions';
import { dateToPeriod, DB_REF } from './app-references';
import { RenderedTime } from './time-monitor-info.model';


/**
 * Function to handle the "check-in" of the day. This function will do the ff:
 * 1. Get current time stamp, currTime
 * 2. Create new instance of RenderedTime with currTime
 * 3. Store to DB
 * 4. Construct response (optimal time out and running offset allowance)
 * 5. Send response
 * @param request 
 * @param response 
 */
export const handler = (request: Request, response: Response) => {
    const dbRenderedHours = database().ref(DB_REF.renderedTimes);
    const CURR_TIME = new Date();
    const optimalTimeout = new Date();
    const currPeriod = dateToPeriod(CURR_TIME);
    optimalTimeout.setHours(CURR_TIME.getHours() + 9);
    // Store to DB
    dbRenderedHours.once('value').then(
        (currentValue) =>
            dbRenderedHours.set([
                ...currentValue.val(),
                { period: currPeriod, timeIn: CURR_TIME.toUTCString() } as RenderedTime
            ])
                .then(() => response.send(constructResponse(optimalTimeout, 0)))
    ).catch((error) => response.status(500).json({ message: 'Something went wrong!' }));
}

export const constructResponse =
    (optimalTimeout: Date, offsetAllowance: number) => ({
        optimalTimeout: optimalTimeout.toUTCString(),
        offsetAllowance: offsetAllowance
    })
