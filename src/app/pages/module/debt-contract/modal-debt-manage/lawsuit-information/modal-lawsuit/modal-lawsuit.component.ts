import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { trlawsuit } from 'src/app/model/trlawsuit';
import { trproperty } from 'src/app/model/trproperty';
import { SypropertytypeService } from 'src/app/services/sypropertytype.service';
import { TrlawsuitService } from 'src/app/services/trlawsuit.service';
import { TrpropertyService } from 'src/app/services/trproperty.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-lawsuit',
  templateUrl: './modal-lawsuit.component.html',
  styleUrls: ['./modal-lawsuit.component.scss']
})
export class ModallawsuitComponent implements OnInit {
  public typeList: any;
  private ngUnsubscribe = new Subject();
  public userInfo = JSON.parse(localStorage.getItem("userInfo"));

  public lawsuit = new trlawsuit();
  public propertyList: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private syPropertyTypeService: SypropertytypeService,
    public dialogRef: MatDialogRef<ModallawsuitComponent>,
    private trPropertyService: TrpropertyService,
    private trlawsuitService: TrlawsuitService
  ) { }

  ngOnInit(): void {
    this.getType();

    if (this.data) {
      this.lawsuit = this.data;
    }
  }

  OnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  getType() {
    this.syPropertyTypeService.findAll().subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.typeList = result.serviceResult.value;
      } else {
        Swal.fire("Error !", result.serviceResult.text, "error");
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    });
  }

  onClear() {
    this.lawsuit = new trlawsuit();
  }

  onClose() {
    this.dialogRef.close(true);
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

  onSave() {
    if (!this.lawsuit.createdBy) {
      this.lawsuit.createdBy = this.userInfo.user.username;
      this.lawsuit.createDate = new Date();
    }
    this.lawsuit.updateDate = new Date();
    this.lawsuit.updatedBy = this.userInfo.user.username;
    this.lawsuit.debtCollectionNumber = this.data.debtCollectionNumber;
    this.lawsuit.active = 'Y';

    this.trlawsuitService.createOrUpdate(this.lawsuit).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        Swal.fire("Success !", "บันทึกสำเร็จ", "success");
        this.onClose();
      } else {
        Swal.fire("Error !", result.serviceResult.text, "error");
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    });
  }
  
}
