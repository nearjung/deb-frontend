import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { trdebtrelation } from 'src/app/model/trdebtrelation';
import { MscustomerService } from 'src/app/services/mscustomer.service';
import { TrdebtrelationService } from 'src/app/services/trdebtrelation.service';
import Swal from 'sweetalert2';
import { ModalCustomerRelationComponent } from './modal-customer-relation/modal-customer-relation.component';

@Component({
  selector: 'app-customer-information',
  templateUrl: './customer-information.component.html',
  styleUrls: ['./customer-information.component.scss']
})
export class CustomerInformationComponent implements OnInit {
  @Input() data: any;
  @Output() result = new EventEmitter<any>();
  public userInfo = JSON.parse(localStorage.getItem("userInfo"));
  private ngUnsubscribe = new Subject();

  public customerList: any;

  constructor(
    private msCustomerService: MscustomerService,
    private trdebtrelationService: TrdebtrelationService,
    public dialogRef: MatDialogRef<CustomerInformationComponent>,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.getCustomerList();
    }
  }

  OnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  openManageModal() {
    const dialogRef = this.dialog.open(ModalCustomerRelationComponent, {
      data: this.data,
      width: "500px"
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getCustomerList();
    });
  }

  getCustomerList() {
    this.msCustomerService.findByDebt(this.data.debtCollectionNumber).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.customerList = result.serviceResult.value;
      } else {
        Swal.fire("Error !", result.serviceResult.text, "error");
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    });
  }

  onDelete(obj: any) {
    Swal.fire({
      title: "คำเตือน !",
      text: "คุณต้องการลบข้อมูลนี้หรือไม่ ?",
      icon: "error",
      confirmButtonColor: "#2FC700",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      cancelButtonColor: "#FF0000",
      showCancelButton: true,
      showConfirmButton: true
    }).then(btn => {
      if (btn.isConfirmed) {
        let data = new trdebtrelation();
        data = obj;
        data.active = "N";
        data.updateBy = this.userInfo.user.username;
        data.updateDate = new Date();
        this.trdebtrelationService.createOrUpdate(data).subscribe(result => {
          if (result.serviceResult.status === "Success") {
            Swal.fire("Success !", "บันทึกสำเร็จ", "success");
            this.getCustomerList();
          } else {
            Swal.fire("Error !", result.serviceResult.text, "error");
          }
        }, err => {
          console.error(err);
          Swal.fire("Error !", err.message, "error");
        });
      }
    })
  }
}
