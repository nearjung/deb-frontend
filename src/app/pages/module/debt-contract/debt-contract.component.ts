import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { trdebtcollection } from 'src/app/model/trdebtcollection';
import { TrdebtcollectionService } from 'src/app/services/trdebtcollection.service';
import Swal from 'sweetalert2';
import { ModalDebtManageComponent } from './modal-debt-manage/modal-debt-manage.component';
import { ModalTraceSettingComponent } from './modal-trace-setting/modal-trace-setting.component';

@Component({
  selector: 'app-debt-contract',
  templateUrl: './debt-contract.component.html',
  styleUrls: ['./debt-contract.component.scss']
})
export class DebtContractComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public debtList: any;
  public checked: boolean = false;
  public btnCreate: boolean = true;

  public userInfo = JSON.parse(localStorage.getItem("userInfo"));
  public userRole = this.userInfo?.userRole.map(x => x.roleId).join(",");

  constructor(
    private trDebtColectionService: TrdebtcollectionService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getDebtList();
  }

  OnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  getDebtList() {
    this.trDebtColectionService.findAll().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.debtList = result.serviceResult.value;
      } else {
        Swal.fire("Error !", result.serviceResult.text, "error");
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    });
  }

  applyFilter(event: any) {
    // console.log(event);
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
}
