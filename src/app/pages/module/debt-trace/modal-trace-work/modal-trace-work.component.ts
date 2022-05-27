import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { TrfollowService } from 'src/app/services/trfollow.service';
import Swal from 'sweetalert2';
import { ModalTraceFormComponent } from './modal-trace-form/modal-trace-form.component';

@Component({
  selector: 'app-modal-trace-work',
  templateUrl: './modal-trace-work.component.html',
  styleUrls: ['./modal-trace-work.component.scss']
})
export class ModalTraceWorkComponent implements OnInit {
  public followList: any;
  private ngUnsubscribe = new Subject();
  public followListLength: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private trfollowService: TrfollowService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getTrace();
  }

  OnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  onManageTraceForm(data: any = null) {
    const dialogRef = this.dialog.open(ModalTraceFormComponent, {
      data: (data) ? data : this.data,
      width: "600px",
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getTrace();
    });

  }

  getTrace() {
    this.trfollowService.findByDebt(this.data.debtCollectionNumber).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.followList = result.serviceResult.value;
        this.followListLength = this.followList?.length - 1;
      } else {
        Swal.fire("Error !", result.serviceResult.text, "error");
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    });
  }
}
