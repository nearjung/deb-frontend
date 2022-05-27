import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { trdebtcollection } from 'src/app/model/trdebtcollection';
import { MsdebtstatusService } from 'src/app/services/msdebtstatus.service';
import { SyuserService } from 'src/app/services/syuser.service';
import { TrdebtcollectionService } from 'src/app/services/trdebtcollection.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-trace-setting',
  templateUrl: './modal-trace-setting.component.html',
  styleUrls: ['./modal-trace-setting.component.scss']
})
export class ModalTraceSettingComponent implements OnInit {
  public syuserList: any;
  public trdebtCollection = new trdebtcollection();
  public userInfo = JSON.parse(localStorage.getItem("userInfo"));
  public debtStatus: any;
  public debtList: any;

  public setDebtStatus: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalTraceSettingComponent>,
    private syUserService: SyuserService,
    private trdebtCollectionService: TrdebtcollectionService,
    private msDebtStatusService: MsdebtstatusService
  ) { }

  ngOnInit(): void {
    if (this.data?.mode === "assign") {
      this.onGetMember();
      this.trdebtCollection = this.data.data;
      this.onGetDebtStatus();
    }

    if (this.data?.mode === "work") {
      this.onGetDebtStatus();
      this.debtList = this.data.data;
    }
  }

  onGetMember() {
    this.syUserService.findAll().subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.syuserList = result.serviceResult.value;
      } else {
        Swal.fire("Error !", result.serviceResult.text, "error");
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    });
  }

  onGetDebtStatus() {
    this.msDebtStatusService.findAll().subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.debtStatus = result.serviceResult.value;
      } else {
        Swal.fire("Error !", result.serviceResult.text, "error");
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    });
  }

  onClose() {
    this.dialogRef.close(true);
  }

  onSave() {
    if (this.data?.mode === "assign") {
      if (this.data?.data?.length > 0) {
        let countComplete = 0;
        for (let data of this.data?.data) {
          let debtCollection = new trdebtcollection();
          debtCollection = data;
          debtCollection.traceBy = this.trdebtCollection.traceBy;
          debtCollection.status = this.setDebtStatus;
          debtCollection.updateDate = new Date();
          debtCollection.updatedBy = this.userInfo.user.username;
          this.trdebtCollectionService.createOrUpdate(this.trdebtCollection).subscribe(result => {
            if (result.serviceResult.status === "Success") {
              countComplete = countComplete + 1;
              if (countComplete === this.data?.data.length) {
                Swal.fire("Success !", "บันทึกสำเร็จ", "success");
                this.onClose();
              }
            } else {
              Swal.fire("Error !", result.serviceResult.text, "error");
            }
          }, err => {
            console.error(err);
            Swal.fire("Error !", err.message, "error");
          });
        }
      } else {
        this.trdebtCollection.updatedBy = this.userInfo.user.username;
        this.trdebtCollection.status = this.setDebtStatus;
        this.trdebtCollection.updateDate = new Date();
        this.trdebtCollectionService.createOrUpdate(this.trdebtCollection).subscribe(result => {
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
      }
    } else if (this.data?.mode === "work") {
      for (let debt of this.debtList) {
        let debtData = new trdebtcollection();
        debtData = debt;
        debtData.updatedBy = this.userInfo.user.username;
        debtData.updateDate = new Date();
        debtData.status = this.setDebtStatus;
        if (debtData['checked']) {
          this.trdebtCollectionService.createOrUpdate(debtData).subscribe(result => {
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
        }
      }
    }
  }
}
