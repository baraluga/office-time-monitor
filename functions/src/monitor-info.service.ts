import { database } from "firebase-admin";
import { from, Observable, of } from 'rxjs';
import { catchError, first, map, switchMap } from "rxjs/operators";
import { dateToPeriod, DB_REF } from "./app-references";
import { RenderedTime } from "./time-monitor-info.model";

export const updateRenderedTime$ = (newTime: RenderedTime,
    existingTimes: Array<RenderedTime>) => getDBRef(DB_REF.renderedTimes).set([
        existingTimes.filter(t => t.period !== newTime.period), newTime
    ])

export const onCheckin$ = (timeIn: Date) =>
    dbRefValue$(DB_REF.renderedTimes).pipe(
        switchMap((times: Array<RenderedTime>) => {
            const period = dateToPeriod(timeIn);
            if (times.find(time => time.period === period)) {
                console.log(`Already checked in today!`)
                return of(true);
            }
            return from(getDBRef(DB_REF.renderedTimes).set([...times,
            { timeIn: timeIn.toUTCString(), period: period } as RenderedTime]))
        }),
        catchError(_ => of(false))
    )


export const updateOffsetAllowance$ = (newAllowance: number) =>
    getDBRef(DB_REF.offsetAllowance).set(newAllowance)

export const getDBRef = (dbRef: string): database.Reference =>
    database().ref(dbRef)

export const dbRefValue$ = (dbRef: string): Observable<any> =>
    from(getDBRef(dbRef).once('value')).pipe(
        map(snapshot => snapshot.val()),
        first()
    )