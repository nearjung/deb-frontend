import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mscustomercontact } from 'src/app/model/mscustomercontact';
import { MscustomercontactService } from 'src/app/services/mscustomercontact.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-telephone-list',
  templateUrl: './modal-telephone-list.component.html',
  styleUrls: ['./modal-telephone-list.component.scss']
})
export class ModalTelephoneListComponent implements OnInit {
  public contactList: any;
  public page: string = 'list';
  public contactData = new mscustomercontact();
  public userInfo = JSON.parse(localStorage.getItem("userInfo"));
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private mscustomerContactService: MscustomercontactService
  ) { }

  ngOnInit(): void {
    this.getContact();
    this.contactData = this.data;
  }

  getContact() {
    this.mscustomerContactService.getDebtContact(this.data.debtCollectionNumber).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.contactList = result.serviceResult.value;

        for (let contact of this.contactList) {
          if (contact.phone) {
            contact.phoneList = contact.phone.split(",");
          }
        }
      }
    })
  }

  onDelete() {
    Swal.fire({
      title: "แจ้งเตือน !",
      text: "คุณต้องการลบข้อมูลนี้หรือไม่ ?",
      icon: "question",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
      showCancelButton: true
    }).then(btn => {
      if (btn.isConfirmed) {
        this.onSave(true);
      }
    })
  }

  onSave(remove: boolean = false) {
    this.contactData.active = (remove) ? "N" : "Y";
    this.contactData.idcard = this.data.idcard;
    if (!this.contactData.createBy) {
      this.contactData.createBy = this.userInfo.user.username;
      this.contactData.createDate = new Date();
    }
    this.contactData.updateBy = this.userInfo.user.username;
    this.contactData.updateDate = new Date();

    this.mscustomerContactService.createOrUpdate(this.contactData).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        Swal.fire("Success !", "บันทึกสำเร็จ !", "success");
        this.getContact();
        this.contactData = new mscustomercontact();
      } else {
        Swal.fire("Error !", result.serviceResult.text, "error");
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    })
  }
}
