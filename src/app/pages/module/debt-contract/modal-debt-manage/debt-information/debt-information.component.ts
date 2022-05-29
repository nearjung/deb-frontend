import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { trdebtcollection } from 'src/app/model/trdebtcollection';
import { MsbankService } from 'src/app/services/msbank.service';
import { MsdebtstatusService } from 'src/app/services/msdebtstatus.service';
import { TrdebtcollectionService } from 'src/app/services/trdebtcollection.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-debt-information',
  templateUrl: './debt-information.component.html',
  styleUrls: ['./debt-information.component.scss']
})
export class DebtInformationComponent implements OnInit {
  @Input() data: any;
  @Output() result = new EventEmitter<any>();
  public userInfo = JSON.parse(localStorage.getItem("userInfo"));
  private ngUnsubscribe = new Subject();

  public debt = new trdebtcollection();
  public bankList: any;
  public statusList: any;

  constructor(
    private trdebtcollectionService: TrdebtcollectionService,
    private msBankService: MsbankService,
    private msDebtStatusService: MsdebtstatusService,
    public dialogRef: MatDialogRef<DebtInformationComponent>,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.debt = this.data;
    }

    this.getBank();
    this.getStatus();
  }

  OnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  getBank() {
    this.msBankService.findAll().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.bankList = result.serviceResult.value;
      } else {
        Swal.fire("Error !", result.serviceResult.text, "error");
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    })
  }

  getStatus() {
    this.msDebtStatusService.findAll().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.statusList = result.serviceResult.value;
      } else {
        Swal.fire("Error !", result.serviceResult.text, "error");
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    })
  }

  onSave() {
    this.debt.active = 'Y';
    this.debt.updatedBy = this.userInfo.user.username;
    this.debt.updateDate = new Date();
    if (!this.debt.createdBy) {
      this.debt.createdBy = this.userInfo.user.username;
      this.debt.createDate = new Date();
    }
    this.trdebtcollectionService.createOrUpdate(this.debt).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.result.emit(result.serviceResult.value.item);
        Swal.fire("Success !", "บันทึกสำเร็จ", "success");
      } else {
        Swal.fire("Error !", result.serviceResult.text, "error");
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    });
  }

  onClear() {
    this.debt = new trdebtcollection();
  }

  onCancel() {
    Swal.fire({
      title: "แจ้งเตือน !",
      text: "คุณต้องการยกเลิกสัญญานี้หรือไม่ ?",
      icon: "question",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
      showCancelButton: true
    }).then(btn => {
      if (btn.isConfirmed) {
        let data = new trdebtcollection();
        data = this.debt;
        data.status = "BKKCANCEL";
        data.updateDate = new Date();
        data.updatedBy = this.userInfo.username;
        this.trdebtcollectionService.createOrUpdate(this.debt).subscribe(result => {
          if (result.serviceResult.status === "Success") {
            Swal.fire("Success", "บันทึกสำเร็จ !", "success");
            this.dialogRef.close(true);
          } else {
            Swal.fire("Error !", result.serviceResult.text, "error");
          }
        }, err => {
          console.error(err);
          Swal.fire("Error !", err.message, "error");
        })
      }
    });
  }

}
