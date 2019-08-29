import { database } from "firebase-admin";
import { from, Observable, of } from 'rxjs';
import { catchError, first, map, switchMap } from "rxjs/operators";
import { dateToPeriod, DB_REF, dateToPeriodMonth } from "./app-references";
import { RenderedTime } from "./time-monitor-info.model";
import { DateTime } from "luxon";

export const updateRenderedTime$ = (newTime: RenderedTime,
    existingTimes: Array<RenderedTime>) => getDBRef(DB_REF.renderedTimes).set([
        existingTimes.filter(t => t.period !== newTime.period), newTime
    ])

export const totalAccruedOffset$ = (thisMonth: Date) =>
    dbRefValue$(DB_REF.renderedTimes).pipe(
        map((times: Array<RenderedTime>) => {
            const daysWithinPeriod = times.filter(
                time => (time.period || '').startsWith(dateToPeriodMonth(thisMonth)))
            return daysWithinPeriod.reduce((totalOffset, day) =>
                totalOffset + (day.accruedOffset || 0), 0)
        }),
        catchError(_ => of(false))
    )


export const onCheckin$ = (timeIn: Date) =>
    dbRefValue$(DB_REF.renderedTimes).pipe(
        switchMap((times: Array<RenderedTime>) => {
            const period = dateToPeriod(timeIn);
            if (!times.find(time => time.period === period)) {
                getDBRef(DB_REF.renderedTimes).set([...times,
                { timeIn: timeIn.toUTCString(), period: period } as RenderedTime])
            }
            return of(true)
        }),
        catchError(_ => of(false))
    )

export const getDBRef = (dbRef: string): database.Reference =>
    database().ref(dbRef)

export const dbRefValue$ = (dbRef: string): Observable<any> =>
    from(getDBRef(dbRef).once('value')).pipe(
        map(snapshot => snapshot.val()),
        first()
    )