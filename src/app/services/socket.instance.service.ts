import io from 'socket.io-client';
import { Injectable } from "@angular/core";
import { ConfigServerService } from "../core/config-server.service";
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class SocketInstanceService {
    private socket;
    private constructor(private configService: ConfigServerService) {
        this.socket = io(environment.endPointSocket);
        this.socket.on('connect', function (data) { });
        this.socket.on('disconnect', function () {
            if (this.id) console.log("Socket Id: " + this.id + "  Disconnect.");
        });
        this.socket.on('register', function (data) {
            if (this.id) console.log("Socket Id: " + this.id + ", formcode: " + data.formCode + " *Register successfully.");
        });
        this.socket.on('removeFormcode', function (data) {
            if (this.id) {
                console.log("Socket Id: " + this.id + ", remove formcode: '" + data.formcode + "' successfully.");
                console.log("*Socket Id: " + this.id + ", current formcode: " + data.userSocket.formcode);
            }
        });
    }

    public getSocketId() {
        return this.socket.id;
    }

    public getSocket() {
        return this.socket;
    }

}