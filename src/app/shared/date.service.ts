import { Injectable } from "@angular/core";
import * as moment from 'moment'
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DateService {
    public selected: BehaviorSubject<moment.Moment> = new BehaviorSubject(moment());
    public month: BehaviorSubject<moment.Moment> = new BehaviorSubject(moment());

    changeMonth(dir: number) {
        const value = this.month.value.add(dir, 'month');
        this.month.next(value);
    }

    changeDate(date: moment.Moment) {
        if (this.month.value.isSame(date, 'month')) {
            const value = this.selected.value.set({
                date: date.date(),
                month: date.month()
            });
            this.selected.next(value);
        }
    }
}