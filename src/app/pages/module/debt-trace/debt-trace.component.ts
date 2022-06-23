import { Component, Input, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import * as dayjs from 'dayjs';
import { Subject, takeUntil } from 'rxjs';
import { discountRate, minimumPayment } from 'src/app/core/middleclass';
import { trdebtcollection } from 'src/app/model/trdebtcollection';
import { ModalService } from 'src/app/services/modal.service';
import { SyuserService } from 'src/app/services/syuser.service';
import { TrdebtcollectionService } from 'src/app/services/trdebtcollection.service';
import Swal from 'sweetalert2';
import { ModalTraceSettingComponent } from '../debt-contract/modal-trace-setting/modal-trace-setting.component';
import { ModalDocumentManageComponent } from './modal-document-manage/modal-document-manage.component';
import { ModalTelephoneListComponent } from './modal-telephone-list/modal-telephone-list.component';
import { ModalTraceWorkComponent } from './modal-trace-work/modal-trace-work.component';

@Component({
  selector: 'app-debt-trace',
  templateUrl: './debt-trace.component.html',
  styleUrls: ['./debt-trace.component.scss']
})
export class DebtTraceComponent implements OnInit {
  public debtList: any;
  public debtListMock: any;
  public myDebtList: any;
  private ngUnsubscribe = new Subject();
  public checked: boolean = false;
  public btnTrace: boolean = false;
  public userInfo = JSON.parse(localStorage.getItem("userInfo"));
  public employee: string;


  public filter = {
    searchTxt: '',
    debtStatus: '',
    startDate: dayjs(new Date().setDate(new Date().getDate() - 7)).format("YYYY-MM-DD"),
    endDate: dayjs(new Date().setDate(new Date().getDate() + 1)).format("YYYY-MM-DD")
  }

  public sort: string;
  public userList: any;

  @Input() statusCode: any = null;

  constructor(
    private trDebtColectionService: TrdebtcollectionService,
    private routerActive: ActivatedRoute,
    public dialog: MatDialog,
    private modalService: ModalService,
    private syUserService: SyuserService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('th-TH');
  }

  ngOnInit(): void {
    this.getMyDebt();
    this.getDebtByStatus();
    this.getUser();
  }

  OnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  getUser() {
    this.syUserService.findAll().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.userList = result.serviceResult.value;
      }
    })
  }

  getMyDebt() {
    this.trDebtColectionService.findByStatus(this.statusCode, this.userInfo.user.username).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.myDebtList = result.serviceResult.value;
        for (let debt of this.myDebtList) {
          debt.minimumPayment = minimumPayment(+debt.principle, +debt.breakInterest, +debt.fee);
          debt.paymentAll = minimumPayment(+debt.principle, +debt.breakInterest, +debt.fee, "totalPayment");
          debt.discountRate = discountRate(debt.paymentAll, debt.minimumPayment);
          debt.followDate = dayjs(debt.followDate).add(543, 'year').format("DD/MM/YYYY");
        }
      } else {
        Swal.fire("Error !", result.serviceResult.text, "error");
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    });
  }

  getDebtByStatus() {
    this.trDebtColectionService.findByStatus(this.statusCode).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {

        this.debtList = result.serviceResult.value;
        for (let debt of this.debtList) {
          debt.minimumPayment = minimumPayment(+debt.principle, +debt.breakInterest, +debt.fee);
          debt.paymentAll = minimumPayment(+debt.principle, +debt.breakInterest, +debt.fee, "totalPayment");
          debt.discountRate = discountRate(debt.paymentAll, debt.minimumPayment);
          debt.followDateReal = debt.followDate;
          debt.followDate = dayjs(debt.followDate).add(543, 'year').format("DD/MM/YYYY");
        }

        this.debtListMock = JSON.parse(JSON.stringify(this.debtList));
      } else {
        Swal.fire("Error !", result.serviceResult.text, "error");
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    });
  }

  openManageModal(data: any = null) {
    const dialogRef = this.dialog.open(ModalTraceWorkComponent, {
      data: data,
      width: "700px",
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getMyDebt();
    });
  }

  openManageDocument(data: any = null) {
    const dialogRef = this.dialog.open(ModalDocumentManageComponent, {
      data: { statusCode: this.statusCode, data: data },
      width: "500px",
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getMyDebt();
    });
  }

  openTelephoneList(idcard: any = null) {
    const dialogRef = this.dialog.open(ModalTelephoneListComponent, {
      data: idcard,
      width: "500px"
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getMyDebt();
    });
  }

  checkAll() {
    let checked = !this.checked;

    if (checked) {
      for (let debt of this.debtList) {
        debt.checked = true;
      }
      this.btnTrace = true;
    } else {
      for (let debt of this.debtList) {
        debt.checked = false;
      }
      this.btnTrace = false;
    }
  }


  openManageTraceModal(data: any = null, mode: string) {
    const dialogRef = this.dialog.open(ModalTraceSettingComponent, {
      data: {
        mode: mode,
        data: data
      },
      width: "500px",
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.getDebtList();
    });
  }


  sortTable(n, tableId: string) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById(tableId);
    switching = true;
    dir = "asc";
    while (switching) {
      switching = false;
      rows = table.rows;
      for (i = 1; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount++;
      } else {
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }

  sortEmployee() {
    if (this.employee) {
      this.debtList = this.debtListMock.filter(x => x.traceBy === this.employee);
    } else {
      this.debtList = this.debtListMock;
    }
  }

  onReturn(debt: any) {
    Swal.fire({
      title: "แจ้งเตือน !",
      text: "คุณต้องการยกเลิกการติดตามสัญญานี้หรือไม่ ?",
      icon: "question",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
      showCancelButton: true
    }).then(btn => {
      if (btn.isConfirmed) {
        let data = new trdebtcollection();
        data = debt;
        data.traceBy = null;
        data.updatedBy = this.userInfo.user.username;
        data.updateDate = new Date();
        this.trDebtColectionService.createOrUpdate(debt).subscribe(result => {
          if (result.serviceResult.status === "Success") {
            Swal.fire("Success !", "บันทึกสำเร็จ !", "success");
          }
        })
      }
    })
  }

  onDelete(debt: any) {
    Swal.fire({
      title: "แจ้งเตือน !",
      text: "คุณต้องการลบข้อมูลนี้หรือไม่ ?",
      icon: "question",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
      showCancelButton: true
    }).then(btn => {
      if (btn.isConfirmed) {
        let data = new trdebtcollection();
        data = debt;
        data.traceBy = null;
        data.active = "N";
        data.updatedBy = this.userInfo.user.username;
        data.updateDate = new Date();
        this.trDebtColectionService.createOrUpdate(debt).subscribe(result => {
          if (result.serviceResult.status === "Success") {
            Swal.fire("Success !", "บันทึกสำเร็จ !", "success");
          }
        })
      }
    })
  }

  filterDate() {
    if (this.filter.startDate && this.filter.endDate) {
      this.debtList = this.debtListMock.filter(x => (dayjs(x.followDateReal).format("YYYYMMDD") >= dayjs(this.filter.startDate).format("YYYYMMDD")) && (dayjs(x.followDateReal).format("YYYYMMDD") <= dayjs(this.filter.endDate).format("YYYYMMDD")));
    }
  }

  searchFilter() {
    this.debtList = this.debtListMock.filter(x => x.companyContractNumber.includes(this.filter.searchTxt));

  }
}
