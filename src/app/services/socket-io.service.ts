import { environment } from './../../environments/environment.prod';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import * as socketIo from 'socket.io-client';
import { AppConfigService } from './app-config.service';
import { NotificationEvent, syNotification } from '../model/syNotification';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})

abstract class SocketService {
    socketData: any;
    socketDataList = [];
    constructor(private socket, appConfigService: AppConfigService) {
        this.createEventExecute();
    }

    getSocket() {
        return this.socket;
    }

    abstract execute(notification: syNotification): void;

    private createEventExecute() {
        this.socket.on('execute', this.socketExecute);
    }

    private deleteEventExecute() {
        this.socket.removeListener('execute', this.socketExecute);
    }

    private socketExecute = (notification) => {
        if (this.socketData) {
            if (notification.formCode && this.socketData.formCode && notification.formCode.toLowerCase() !== "all") {
                if (!notification.formCode.includes(this.socketData.formCode) && !this.socketData.formCode.includes(notification.formCode)) {
                    //console.log("Member ID: [" + this.socketData.username + "], *FormCode Active: " + this.socketData.formCode + ", Socket Id: " + notification.socketId + " *skip.");
                    return;
                } else {
                    console.log("  --> Member ID: [" + this.socketData.member_id + "], *FormCode Active: " + this.socketData.formCode + ", Socket Id: " + notification.socketId + " execute.");
                }
            } else {
                console.log("  --> Member ID: [" + this.socketData.member_id + "], *FormCode Active: " + this.socketData.formCode + ", Socket Id: " + notification.socketId + " execute.");
            }
        } else {
            return;
        }
        switch (notification.event) {
            case NotificationEvent.Test:
                Swal.fire({ title: "Test Notification.", text: notification.data, icon: "success" });
            break;
            case NotificationEvent.sentAlert:
                Swal.fire({ title: "Alert", text: notification.data, icon: "warning" });
            break;
            default:
                this.execute(notification);
            break;
        }
    };

    listenToServer(event: any): Observable<any> {
        return new Observable((subscribe) => {
            this.socket.on(event, (data) => {
                subscribe.next(data);
            })
        })
    }

    socketRegister(formCode: any, memberId: any = null): void {
        this.socketData = { formCode: formCode, member_id: memberId };
        this.socketDataList.push(JSON.parse(JSON.stringify(this.socketData)));
        this.socket.emit('register', this.socketData);
    }

    socketDestroy() {
        for (let index = 0; index < this.socketDataList.length; index++) {
            const socketData = this.socketDataList[index];
            this.socket.emit('removeFormCode', socketData);
        }
        this.socketData = undefined;
        this.socketDataList = [];
        this.deleteEventExecute();
    }
    // formCode Support muti code -> dashboard, timeline */
    // socketRegister(formCode, roomno = null, roleId = null, username = null) {
    // 	var user = JSON.parse(localStorage.getItem("user"));
    // 	// var routerActive = new ActivatedRoute();
    // 	// routerActive.queryParams.subscribe(params => {
    // 	//     if (!roomno) {
    // 	// 		roomno = params["roomno"];
    // 	//     }
    // 	// });
    // 	this.socketData = { formCode: formCode, roomno: roomno, roleId: (roleId) ? roleId : (user) ? user.roleId : roleId, username: (username) ? username : (user) ? user.username : username };
    // 	this.socketDataList.push(JSON.parse(JSON.stringify(this.socketData)));
    // 	this.socket.emit('register', this.socketData);
    // }
}

export { SocketService };