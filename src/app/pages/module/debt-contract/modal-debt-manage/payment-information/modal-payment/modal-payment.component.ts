import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileUploader } from 'ng2-file-upload';
import { Subject } from 'rxjs';
import { sypropertytype } from 'src/app/model/sypropertytype';
import { trpayment } from 'src/app/model/trpayment';
import { SypropertytypeService } from 'src/app/services/sypropertytype.service';
import { TrpaymentService } from 'src/app/services/trpayment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-payment',
  templateUrl: './modal-payment.component.html',
  styleUrls: ['./modal-payment.component.scss']
})
export class ModalPaymentComponent implements OnInit {
  public typeList: any;
  private ngUnsubscribe = new Subject();
  public userInfo = JSON.parse(localStorage.getItem("userInfo"));
  public URL = 'path_to_api';
  public uploader: FileUploader = new FileUploader({
    url: this.URL,
    itemAlias: 'image'
  });
  public payment = new trpayment();
  public filesName: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private syPropertyTypeService: SypropertytypeService,
    public dialogRef: MatDialogRef<ModalPaymentComponent>,
    private trpaymentService: TrpaymentService,
  ) { }

  ngOnInit(): void {
    this.getType();
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onCompleteItem = (item: any, status: any) => {
      console.log('Uploaded File Details:', item);
    };

    if (this.data) {
      this.payment = this.data;
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
    this.payment = new trpayment();
  }

  onClose() {
    this.dialogRef.close(true);
  }

  onSave() {
    if (!this.payment.createdBy) {
      this.payment.createdBy = this.userInfo.user.username;
      this.payment.createDate = new Date();
    }
    this.payment.updateDate = new Date();
    this.payment.updatedBy = this.userInfo.user.username;
    this.payment.debtCollectionNumber = this.data.debtCollectionNumber;
    this.payment.active = 'Y';

    this.trpaymentService.createOrUpdate(this.payment).subscribe(result => {
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

  onFileSelected(event: any) {
    let inputNode: any = event.target.files[0];
    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.payment.attachmentFile = e.target.result;

        this.filesName = inputNode.name;
      };
      reader.readAsDataURL(inputNode);
    }
  }
}
