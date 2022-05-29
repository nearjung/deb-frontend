import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { discountRate, minimumPayment } from 'src/app/core/middleclass';
import { ModalService } from 'src/app/services/modal.service';
import { TrdebtcollectionService } from 'src/app/services/trdebtcollection.service';
import Swal from 'sweetalert2';
import { ModalTraceSettingComponent } from '../debt-contract/modal-trace-setting/modal-trace-setting.component';
import { ModalDocumentManageComponent } from './modal-document-manage/modal-document-manage.component';
import { ModalTraceWorkComponent } from './modal-trace-work/modal-trace-work.component';

@Component({
  selector: 'app-debt-trace',
  templateUrl: './debt-trace.component.html',
  styleUrls: ['./debt-trace.component.scss']
})
export class DebtTraceComponent implements OnInit {
  public debtList: any;
  public myDebtList: any;
  private ngUnsubscribe = new Subject();
  public checked: boolean = false;
  public btnTrace: boolean = false;

  public filter = [
    {
      value: 'contractNumber',
      name: 'เลขที่สัญญา'
    },
    {
      value: 'customerName',
      name: 'ชื่อผู้กู้'
    },
    {
      value: 'paymentAll',
      name: 'ยอดรวมทั้งสิ้น'
    },
    {
      value: 'minimumPayment',
      name: 'ยอดชำระขั้นต่ำ'
    },
    {
      value: 'discountRate',
      name: 'อัตราส่วนลด'
    }
  ]

  public sort: string;

  @Input() statusCode: any = null;

  constructor(
    private trDebtColectionService: TrdebtcollectionService,
    private routerActive: ActivatedRoute,
    public dialog: MatDialog,
    private modalService: ModalService
  ) {
  }

  ngOnInit(): void {
    this.getMyDebt();
    this.getDebtByStatus();
  }

  OnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  getMyDebt() {
    this.trDebtColectionService.findMyTrace(this.statusCode).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.myDebtList = result.serviceResult.value;
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
        }
      } else {
        Swal.fire("Error !", result.serviceResult.text, "error");
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    });
  }

  applyFilter(event) {

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

    this.check();
  }


  check() {

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

  sortFilter() {
    this.debtList.sort((a, b) => (a['' + this.sort + ''] > b['' + this.sort + '']) ? 1 : ((b['' + this.sort + ''] > a['' + this.sort + '']) ? -1 : 0))
  }

  async onDelete(debt: any) {
    const modal = await this.modalService.openModal("warning", "คำเตือน !", "คุณต้องการลบข้อมูลนี้หรือไม่ ?");
    console.log(modal);
    
  }
}
