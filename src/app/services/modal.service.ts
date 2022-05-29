import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigServerService } from '../core/config-server.service';
import { MatDialog } from '@angular/material/dialog';
import { ActionModalComponent } from '../pages/control/action-modal/action-modal.component';

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    constructor(
        public dialog: MatDialog,
    ) { }

    public async openModal(icon: string, title: string, description: string,
        btnOk: boolean = true, btnOkText: string = 'ตกลง',
        btnOkColor: string = 'primary', btnCancel: boolean = true,
        btnCancelText: string = 'ยกเลิก', btnCancelColor: string = 'warn') {
        const dialogRef = this.dialog.open(ActionModalComponent, {
            data: {
                icon: icon,
                title: title,
                description: description,
                btnOk: btnOk,
                btnOkText: btnOkText,
                btnOkColor: btnOkColor,
                btnCancel: btnCancel,
                btnCancelText: btnCancelText,
                btnCancelColor: btnCancelColor
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            return result;
        });
    }

}