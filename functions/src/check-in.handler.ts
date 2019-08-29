import { Request, Response } from 'firebase-functions';
import { combineLatest } from 'rxjs';
import { ResponseService } from './app-references';
import { onCheckin$, totalAccruedOffset$ } from './monitor-info.service';


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
    const respService = new ResponseService(response);
    const CURR_TIME = new Date();
    // Store to DB
    combineLatest([
        onCheckin$(CURR_TIME),
        totalAccruedOffset$(CURR_TIME),
    ]).subscribe(([successCheckIn, offsetAllowance]) => {
        console.log(successCheckIn, offsetAllowance)
        if (!!successCheckIn) {
            respService.sendOK({
                timeIn: CURR_TIME.toUTCString(),
                remainingOffset: offsetAllowance
            })
        } else {
            respService.sendError();
        }
    });
}
