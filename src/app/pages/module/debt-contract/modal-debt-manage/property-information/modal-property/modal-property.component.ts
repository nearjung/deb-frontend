import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { sypropertytype } from 'src/app/model/sypropertytype';
import { trproperty } from 'src/app/model/trproperty';
import { SypropertytypeService } from 'src/app/services/sypropertytype.service';
import { TrpropertyService } from 'src/app/services/trproperty.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-property',
  templateUrl: './modal-property.component.html',
  styleUrls: ['./modal-property.component.scss']
})
export class ModalPropertyComponent implements OnInit {
  public typeList: any;
  private ngUnsubscribe = new Subject();
  public userInfo = JSON.parse(localStorage.getItem("userInfo"));

  public property = new trproperty();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private syPropertyTypeService: SypropertytypeService,
    public dialogRef: MatDialogRef<ModalPropertyComponent>,
    private trPropertyService: TrpropertyService,
  ) { }

  ngOnInit(): void {
    this.getType();

    if (this.data) {
      this.property = this.data;
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
    this.property = new trproperty();
  }

  onClose() {
    this.dialogRef.close(true);
  }

  onSave() {
    if (!this.property.createdBy) {
      this.property.createdBy = this.userInfo.user.username;
      this.property.createDate = new Date();
    }
    this.property.updateDate = new Date();
    this.property.updatedBy = this.userInfo.user.username;
    this.property.debtCollectionNumber = this.data.debtCollectionNumber;
    this.property.active = 'Y';

    this.trPropertyService.createOrUpdate(this.property).subscribe(result => {
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
