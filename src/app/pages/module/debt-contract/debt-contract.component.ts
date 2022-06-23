import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as dayjs from 'dayjs';
import { Subject, takeUntil } from 'rxjs';
import { discountRate, minimumPayment } from 'src/app/core/middleclass';
import { trdebtcollection } from 'src/app/model/trdebtcollection';
import { MsdebtstatusService } from 'src/app/services/msdebtstatus.service';
import { TrdebtcollectionService } from 'src/app/services/trdebtcollection.service';
import Swal from 'sweetalert2';
import { ModalDebtManageComponent } from './modal-debt-manage/modal-debt-manage.component';
import { ModalTraceSettingComponent } from './modal-trace-setting/modal-trace-setting.component';
import { debounce } from 'lodash';
import { ModalImportExcelComponent } from './modal-import-excel/modal-import-excel.component';

@Component({
  selector: 'app-debt-contract',
  templateUrl: './debt-contract.component.html',
  styleUrls: ['./debt-contract.component.scss']
})
export class DebtContractComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public debtList: any;
  public debtListMock: any;
  public checked: boolean = false;
  public btnCreate: boolean = true;

  public userInfo = JSON.parse(localStorage.getItem("userInfo"));
  public userRole = this.userInfo?.userRole.map(x => x.roleId).join(",");

  public debtStatusList: any;
  public filter = {
    searchTxt: '',
    debtStatus: '',
    startDate: dayjs(new Date().setDate(new Date().getDate() - 7)).format("YYYY-MM-DD"),
    endDate: dayjs(new Date().setDate(new Date().getDate() + 1)).format("YYYY-MM-DD")
  }

  constructor(
    private trDebtColectionService: TrdebtcollectionService,
    public dialog: MatDialog,
    private msDebtStatusService: MsdebtstatusService
  ) {
    this.searchTxt = debounce(this.searchTxt, 1000);
  }

  ngOnInit(): void {
    this.getDebtList();
    this.getDebtStatus();
  }

  OnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  getDebtStatus() {
    this.msDebtStatusService.findAll().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.debtStatusList = result.serviceResult.value;
      }
    })
  }

  getDebtList(status: string = '') {
    let startDate = dayjs(this.filter.startDate).format("YYYY-MM-DD");
    let endDate = dayjs(this.filter.endDate).format("YYYY-MM-DD");
    this.trDebtColectionService.findByStatus(status, '', startDate, endDate, this.filter.searchTxt).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.debtList = result.serviceResult.value;
        for (let debt of this.debtList) {
          debt.minimumPayment = minimumPayment(+debt.principle, +debt.breakInterest, +debt.fee);
          debt.paymentAll = minimumPayment(+debt.principle, +debt.breakInterest, +debt.fee, "totalPayment");
          debt.discountRate = discountRate(debt.paymentAll, debt.minimumPayment);
          debt.followDate = dayjs(debt.followDate).add(543, 'year').format("DD/MM/YYYY");
          debt.paymentDate = dayjs(debt.paymentDate).add(543, 'year').format("DD/MM/YYYY");
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

  searchTxt() {
    this.getDebtList(this.filter.debtStatus);
  }

  openManageModal(data: any = null) {
    const dialogRef = this.dialog.open(ModalDebtManageComponent, {
      data: data,
      width: "100%",
      height: "95%",
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getDebtList();
    });
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
      this.getDebtList();
    });
  }

  checkAll() {
    let checked = !this.checked;

    if (checked) {
      for (let debt of this.debtList) {
        debt.checked = true;
      }
    } else {
      for (let debt of this.debtList) {
        debt.checked = false;
      }
    }

    this.check();
  }

  check(dataList: any = null) {
    let data = (dataList) ? dataList : this.debtList;
    let checkList = data.filter(x => x.checked === true);
    this.btnCreate = (checkList.length > 0) ? false : true;
  }

  sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("debtContact");
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

  openImportExcel() {
    const dialogRef = this.dialog.open(ModalImportExcelComponent, {
      width: "500px",
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getDebtList();
    });
  }

}
