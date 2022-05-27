import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { trlawsuit } from 'src/app/model/trlawsuit';
import { TrlawsuitService } from 'src/app/services/trlawsuit.service';
import Swal from 'sweetalert2';
import { ModalPropertyComponent } from '../property-information/modal-property/modal-property.component';
import { ModallawsuitComponent } from './modal-lawsuit/modal-lawsuit.component';

@Component({
  selector: 'app-lawsuit-information',
  templateUrl: './lawsuit-information.component.html',
  styleUrls: ['./lawsuit-information.component.scss']
})
export class LawsuitInformationComponent implements OnInit {
  @Input() data: any;
  @Output() result = new EventEmitter<any>();
  public userInfo = JSON.parse(localStorage.getItem("userInfo"));
  private ngUnsubscribe = new Subject();
  public lawList: any;

  constructor(
    private trlawsuitService: TrlawsuitService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.getLawSuit();
    }
  }

  OnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  getLawSuit() {
    this.trlawsuitService.findByDebt(this.data.debtCollectionNumber).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.lawList = result.serviceResult.value;
      } else {
        Swal.fire("Error !", result.serviceResult.text, "error");
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    })
  }

  openManageModal(data: any = null) {
    let obj = new trlawsuit();
    if (data) {
      obj = data;
    } else {
      obj.debtCollectionNumber = this.data.debtCollectionNumber;
    }
    const dialogRef = this.dialog.open(ModallawsuitComponent, {
      data: obj,
      width: "70%"
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getLawSuit();
    });
  }

  onDelete(obj: any) {
    Swal.fire({
      title: "แจ้งเตือน !",
      text: "คุณต้องการจะลบข้อมูลนี้หรือไม่ ?",
      icon: "question",
      showConfirmButton: true,
      confirmButtonColor: "#2FC700",
      confirmButtonText: "ตกลง",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      cancelButtonColor: "#FF0000"
    }).then(btn => {
      if (btn.isConfirmed) {
        obj.active = 'N';
        obj.updatedBy = this.userInfo.user.username;
        obj.updateDate = new Date();
        this.trlawsuitService.createOrUpdate(obj).subscribe(result => {
          if (result.serviceResult.status === "Success") {
            Swal.fire("Success !", "บันทึกสำเร็จ", "success");
            this.getLawSuit();
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
}
