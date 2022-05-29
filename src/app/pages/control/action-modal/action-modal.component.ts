import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-action-modal',
  templateUrl: './action-modal.component.html',
  styleUrls: ['./action-modal.component.scss']
})
export class ActionModalComponent implements OnInit {
  public icon: string = "yes";
  public title: string;
  public description: string;
  public btnOk: boolean = true;
  public btnOkText: string = "ตกลง";
  public btnOkColor: string = "primary";
  public btnCancel: boolean = true;
  public btnCancelText: string = "ยกเลิก";
  public btnCancelColor: string = "warn";

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if (this.data) {
      this.icon = this.data.icon;
      this.title = this.data.title;
      this.description = this.data.description;
      this.btnOk = this.data.btnOk;
      this.btnOkText = this.data.btnOkText;
      this.btnOkColor = this.data.btnOkColor;
      this.btnCancel = this.data.btnCancel;
      this.btnCancelText = this.data.btnCancelText;
      this.btnCancelColor = this.data.btnCancelColor;
    }
  }

}
