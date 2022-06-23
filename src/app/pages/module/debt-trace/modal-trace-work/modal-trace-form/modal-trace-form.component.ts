import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { trfollow } from 'src/app/model/trfollow';
import { SyfollowstatusService } from 'src/app/services/syfollowstatus.service';
import { SyfollowtypeService } from 'src/app/services/syfollowtype.service';
import { TrfollowService } from 'src/app/services/trfollow.service';
import { MscustomercontactService } from 'src/app/services/mscustomercontact.service'
import Swal from 'sweetalert2';
import { mscustomercontact } from 'src/app/model/mscustomercontact';

@Component({
  selector: 'app-modal-trace-form',
  templateUrl: './modal-trace-form.component.html',
  styleUrls: ['./modal-trace-form.component.scss']
})
export class ModalTraceFormComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public trfollow = new trfollow();
  public followType: any;
  public userInfo = JSON.parse(localStorage.getItem("userInfo"));
  public followStatusList: any;
  public contactList: any;

  constructor(
    private trfollowService: TrfollowService,
    private syfollowTypeService: SyfollowtypeService,
    public dialogRef: MatDialogRef<ModalTraceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private syfollowStatusService: SyfollowstatusService,
    private mscustomerContactService: MscustomercontactService
  ) { }

  ngOnInit(): void {
    this.getFollowType();
    this.getFollowStatus();
    this.getContact();
  }

  OnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  onClose() {
    this.dialogRef.close(true);
  }

  onClear() {
    this.trfollow = new trfollow();
  }

  getContact() {
    this.contactList = [];
    this.mscustomerContactService.getDebtContact(this.data.debtCollectionNumber).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        let resultData = result.serviceResult.value;

        for (let contact of resultData) {
          if (contact.phone) {
            contact.phoneList = contact.phone.split(",");
            for (let phone of contact.phoneList) {
              this.contactList.push(phone);
            }
          }
        }
      }
    })
  }

  getFollowType() {
    this.syfollowTypeService.findAll().subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.followType = result.serviceResult.value;
      } else {
        Swal.fire("Error !", result.serviceResult.text, "error");
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    })
  }

  getFollowStatus() {
    this.syfollowStatusService.findAll().subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.followStatusList = result.serviceResult.value;
      } else {
        Swal.fire("Error !", result.serviceResult.text, "error");
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    });
  }

  onSave() {
    if (this.trfollow.amount < this.data.totalAmount) {
      Swal.fire("Error !", "ยอดปิดหนี้ไม่ควรต่ำกว่ายอดหนี้", "warning");
      return;
    } else {
      this.trfollow.active = 'Y';
      this.trfollow.updatedBy = this.userInfo.user.username;
      this.trfollow.updateDate = new Date();
      if (!this.trfollow.createdBy) {
        this.trfollow.createdBy = this.userInfo.user.username;
        this.trfollow.createDate = new Date();
      }
      this.trfollow.debtCollectionNumber = this.data.debtCollectionNumber;
      this.trfollowService.createOrUpdate(this.trfollow).subscribe(result => {
        if (result.serviceResult.status === "Success") {
          Swal.fire("Success !", "บันทึกสำเร็จ", "success");
          this.onClose();
        } else {
          Swal.fire("Error !", result.serviceResult.text, "error");
        }
      }, err => {
        console.error(err);
        Swal.fire("Error !", err.message, "error");
      });

      if (this.trfollow.status === 'WRONGNUMBER') {
        let data = new mscustomercontact();
        data.status = this.trfollow.status;
        data.phoneNumber = this.trfollow.phoneNumber;
        data.updateBy = this.userInfo.user.username;
        data.updateDate = new Date();
        this.mscustomerContactService.saveByPhoneNumber(data).subscribe(result => {
          if (result.serviceResult.status !== "Success") {
            Swal.fire("Error !", result.serviceResult.text, "error");
          }
        })
      }
    }
  }
}
