import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SharedService {
    private subject = new Subject<any>();
    public editDataDetails: any = [];
    private dataSource = new BehaviorSubject(this.editDataDetails);
    public getData = this.dataSource.asObservable();

    sendClickEvent() {
        this.subject.next(null);
    }

    getClickEvent(): Observable<any> {
        return this.subject.asObservable();
    }

    sendData(obj: any) {
        this.dataSource.next(obj);
    }

}