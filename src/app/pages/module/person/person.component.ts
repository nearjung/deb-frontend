import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { mscustomer } from 'src/app/model/mscustomer';
import { MscustomerService } from 'src/app/services/mscustomer.service';
import Swal from 'sweetalert2';
import { ModalPersonManageComponent } from './modal-person-manage/modal-person-manage.component';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {
  public customerList: any;
  public userInfo = JSON.parse(localStorage.getItem("userInfo"));

  constructor(
    public dialog: MatDialog,
    private msCustomerService: MscustomerService
  ) { }

  ngOnInit(): void {
    this.getCustomer();
  }

  getCustomer() {
    this.msCustomerService.findAll().subscribe(result => {
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

  openManageModal(data: any = null) {
    const dialogRef = this.dialog.open(ModalPersonManageComponent, {
      data: data,
      width: "100%",
      height: "95%",
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  applyFilter(event: any) {

  }

  deletePerson(obj: any) {
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
        let data: mscustomer = obj;
        data.active = "N";
        data.updatedBy = this.userInfo.user.username;
        data.updateDate = new Date();
        this.msCustomerService.createOrUpdate(data).subscribe(result => {
          if (result.serviceResult.status === "Success") {
            Swal.fire("Success !", "บันทึกสำเร็จ !", "success");
            this.getCustomer();
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
