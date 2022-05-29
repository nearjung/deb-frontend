export class syNotification {
    public notificationId: number = 0;
    public refId: string;
    public module: string;
    public event: NotificationEvent;
    public formCode: string;
    public data: string;
    public member_id: number = 0;
    public status: string;
    public active: string;
    public createBy: string;
    public createDate: Date;
    public updateBy: string;
    public updateDate: Date;
}

export enum NotificationEvent {
    Test = "test",
    deploySystem = "deploySystem",
    validateVersion = "validateVersion",
    reloadData = "reloadData",
    refreshPage = "refreshPage",
    sentMessage = "sentMessage",
    sentAlert = "sentAlert",
    sendRequest = "sendRequest",
}
