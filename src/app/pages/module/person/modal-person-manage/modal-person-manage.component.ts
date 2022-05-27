import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { mscustomer } from 'src/app/model/mscustomer';
import { MscustomerService } from 'src/app/services/mscustomer.service';
import { MsrelationshipService } from 'src/app/services/msrelationship.service';
import Swal from 'sweetalert2';
import { ModalRelationManageComponent } from '../modal-relation-manage/modal-relation-manage.component';

@Component({
  selector: 'app-modal-person-manage',
  templateUrl: './modal-person-manage.component.html',
  styleUrls: ['./modal-person-manage.component.scss']
})
export class ModalPersonManageComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public mscustomer = new mscustomer();
  public userInfo = JSON.parse(localStorage.getItem("userInfo"));
  public customerRelationList: any;
  public relationList: any;

  constructor(
    private msCustomerService: MscustomerService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private msRelationshipService: MsrelationshipService
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.mscustomer = this.data;
      this.getRelation();
    }
  }

  OnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  onClear() {
    this.mscustomer = new mscustomer();
  }

  onSave() {
    if (!this.mscustomer.createdBy) {
      this.mscustomer.createDate = new Date();
      this.mscustomer.createdBy = this.userInfo.user.username;
    }

    this.mscustomer.updateDate = new Date();
    this.mscustomer.updatedBy = this.userInfo.user.username;
    this.mscustomer.active = "Y";

    this.msCustomerService.createOrUpdate(this.mscustomer).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.data = result.serviceResult.value;
        Swal.fire("Success !", "บันทึกสำเร็จ", "success");
        this.getRelation();
      } else {
        Swal.fire("Error !", result.serviceResult.text, "error");
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    });
  }

  getRelation() {
    this.msRelationshipService.findByCustomerIdCard(this.data.idcard).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.relationList = result.serviceResult.value;
      } else {
        Swal.fire("Error !", result.serviceResult.text, "error");
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    });
  }


  openManageRelationModal(data: any = null, mode: string = "add") {
    const dialogRef = this.dialog.open(ModalRelationManageComponent, {
      data: { info: data, mode: mode },
      width: "70%",
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getRelation();
      }
    });
  }

}
