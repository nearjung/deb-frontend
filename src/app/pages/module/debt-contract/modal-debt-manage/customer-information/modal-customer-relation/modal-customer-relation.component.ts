import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { trdebtrelation } from 'src/app/model/trdebtrelation';
import { ModalRelationManageComponent } from 'src/app/pages/module/person/modal-relation-manage/modal-relation-manage.component';
import { MscustomerService } from 'src/app/services/mscustomer.service';
import { TrdebtrelationService } from 'src/app/services/trdebtrelation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-customer-relation',
  templateUrl: './modal-customer-relation.component.html',
  styleUrls: ['./modal-customer-relation.component.scss']
})
export class ModalCustomerRelationComponent implements OnInit {
  public searchTxt: string;
  public customerList: any;
  public userInfo = JSON.parse(localStorage.getItem("userInfo"));
  private ngUnsubscribe = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private msCustomer: MscustomerService,
    private trDebtRelation: TrdebtrelationService,
    public dialogRef: MatDialogRef<ModalCustomerRelationComponent>,
    public dialog: MatDialog,
    ) { }

  ngOnInit(): void {
  }

  OnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  search() {
    if (this.searchTxt) {
      this.msCustomer.findByName(this.searchTxt).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.serviceResult.status === "Success") {
          this.customerList = result.serviceResult.value;
        } else {
          Swal.fire("Error !", result.serviceResult.text);
        }
      }, err => {
        console.error(err);
        Swal.fire("Error !", err.message, "error");
      });
    } else {
      this.customerList = [];
    }
  }

  onSelect(obj: any) {
    Swal.fire({
      title: "คำเตือน",
      text: "กรุณาเลือกประเภทผู้กู้",
      icon: "warning",
      confirmButtonText: "ผู้กู้หลัก",
      confirmButtonColor: "#33aa66",
      showDenyButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      denyButtonText: "ผู้กู้รอง",
      denyButtonColor: "#003366",
      cancelButtonText: "ยกเลิก",
      cancelButtonColor: "#fe0037"
    }).then(btn => {
      if (btn.isConfirmed) {
        obj.isMain = 'Y'
        this.onSave(obj);
      } else if (btn.isDenied) {
        obj.isMain = 'N'
        this.onSave(obj);
      }
    });
  }

  onSave(obj: any) {
    this.trDebtRelation.checkIfExist(this.data.debtCollectionNumber, obj.idcard).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success" && result.serviceResult.value) {
        Swal.fire("Error !", "บุคคลนี้อยู่ในชื่อสัญญานี้แล้ว !", "error");
      } else {
        let data = new trdebtrelation();
        data.debtCollectionNumber = this.data.debtCollectionNumber;
        data.active = 'Y';
        data.idcard = obj.idcard;
        data.isMain = obj.isMain;
        data.createBy = this.userInfo.user.username;
        data.createDate = new Date();
        data.updateBy = this.userInfo.user.username;
        data.updateDate = new Date();
        this.trDebtRelation.createOrUpdate(data).subscribe(result => {
          if (result.serviceResult.status === "Success") {
            Swal.fire("Success !", "บันทึกสำเร็จ", "success");
            this.dialogRef.close();
          } else {
            Swal.fire("Error !", result.serviceResult.text, "error");
          }
        }, err => {
          console.error(err);
          Swal.fire("Error !", err.message, "error");
        });
      }
    });
  }

  openAddCustomer() {
    const dialogRef = this.dialog.open(ModalRelationManageComponent, {
      data: this.data,
      width: "70%"
    });
  }

}
