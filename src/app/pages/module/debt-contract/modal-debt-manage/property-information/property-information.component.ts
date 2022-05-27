import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { trproperty } from 'src/app/model/trproperty';
import { TrpropertyService } from 'src/app/services/trproperty.service';
import Swal from 'sweetalert2';
import { ModalPropertyComponent } from './modal-property/modal-property.component';

@Component({
  selector: 'app-property-information',
  templateUrl: './property-information.component.html',
  styleUrls: ['./property-information.component.scss']
})
export class PropertyInformationComponent implements OnInit {
  @Input() data: any;
  @Output() result = new EventEmitter<any>();
  public userInfo = JSON.parse(localStorage.getItem("userInfo"));
  private ngUnsubscribe = new Subject();

  public propertyList: any;
  constructor(
    public dialog: MatDialog,
    private trPropertyService: TrpropertyService,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.getPropertyList();
    }
  }

  OnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  getPropertyList() {
    this.trPropertyService.findByDebt(this.data.debtCollectionNumber).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.propertyList = result.serviceResult.value;
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
    const dialogRef = this.dialog.open(ModalPropertyComponent, {
      data: obj,
      width: "500px"
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getPropertyList();
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
        this.trPropertyService.createOrUpdate(obj).subscribe(result => {
          if (result.serviceResult.status === "Success") {
            Swal.fire("Success !", "บันทึกสำเร็จ", "success");
            this.getPropertyList();
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
