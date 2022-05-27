import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { trproperty } from 'src/app/model/trproperty';
import { TrpaymentService } from 'src/app/services/trpayment.service';
import { TrpropertyService } from 'src/app/services/trproperty.service';
import Swal from 'sweetalert2';
import { ModalPropertyComponent } from '../property-information/modal-property/modal-property.component';
import { ModalPaymentComponent } from './modal-payment/modal-payment.component';

@Component({
  selector: 'app-payment-information',
  templateUrl: './payment-information.component.html',
  styleUrls: ['./payment-information.component.scss']
})
export class PaymentInformationComponent implements OnInit {
  @Input() data: any;
  @Output() result = new EventEmitter<any>();
  public userInfo = JSON.parse(localStorage.getItem("userInfo"));
  private ngUnsubscribe = new Subject();

  public paymentList: any;
  constructor(
    public dialog: MatDialog,
    private trpaymentService: TrpaymentService
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.getPaymentList();
    }
  }

  OnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  getPaymentList() {
    this.trpaymentService.findByDebt(this.data.debtCollectionNumber).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.paymentList = result.serviceResult.value;
      } else {
        Swal.fire("Error !", result.serviceResult.text, "error");
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    });
  }

  openManageModal(data: any = null) {
    let obj = new trproperty();
    if (data) {
      obj = data;
    } else {
      obj.debtCollectionNumber = this.data.debtCollectionNumber;
    }
    const dialogRef = this.dialog.open(ModalPaymentComponent, {
      data: obj,
      width: "70%"
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getPaymentList();
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
        this.trpaymentService.createOrUpdate(obj).subscribe(result => {
          if (result.serviceResult.status === "Success") {
            Swal.fire("Success !", "บันทึกสำเร็จ", "success");
            this.getPaymentList();
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
