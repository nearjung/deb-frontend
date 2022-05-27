import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { msrelationship } from 'src/app/model/msrelationship';
import { MsrelationshipService } from 'src/app/services/msrelationship.service';
import { MsrelationshiptypeService } from 'src/app/services/msrelationshiptype.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-relation-manage',
  templateUrl: './modal-relation-manage.component.html',
  styleUrls: ['./modal-relation-manage.component.scss']
})
export class ModalRelationManageComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public relationship = new msrelationship();
  public relationshipTypeList: any;
  public userInfo = JSON.parse(localStorage.getItem("userInfo"));

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalRelationManageComponent>,
    private msRelationshipService: MsrelationshipService,
    private msrelationshiptypeService: MsrelationshiptypeService
  ) { }

  ngOnInit(): void {
    this.getRelationshipType();
    if (this.data?.info && this.data?.mode === "update") {
      this.relationship = this.data?.info;
    }
  }

  OnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  onSave() {
    if (!this.relationship.createdBy) {
      this.relationship.createdBy = this.userInfo.user.username;
      this.relationship.createDate = new Date();
    }
    this.relationship.relationshipManual = this.data?.info.idcard;
    this.relationship.updateDate = new Date();
    this.relationship.updatedBy = this.userInfo.user.username;

    this.msRelationshipService.createOrUpdate(this.relationship).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        Swal.fire("Success !", "บันทึกสำเร็จ", "success");
        this.onClose();
      } else {
        Swal.fire("Error !", result.serviceResult.text, 'error');
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    });
  }

  getRelationshipType() {
    this.msrelationshiptypeService.findAll().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.relationshipTypeList = result.serviceResult.value;
      } else {
        Swal.fire("Error !", result.serviceResult.text, 'error');
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    });
  }

  onClear() {
    this.relationship = new msrelationship();
  }

  onClose() {
    this.dialogRef.close(true);
  }
}
