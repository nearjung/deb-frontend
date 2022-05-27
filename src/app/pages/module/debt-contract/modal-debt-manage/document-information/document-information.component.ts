import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { trdocument } from 'src/app/model/trdocument';
import { SydocumenttypeService } from 'src/app/services/sydocumenttype.service';
import { TrdocumentService } from 'src/app/services/trdocument.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-document-information',
  templateUrl: './document-information.component.html',
  styleUrls: ['./document-information.component.scss']
})
export class DocumentInformationComponent implements OnInit {
  public documentTypeList: any;
  public documentList: any;
  @Input() data: any;
  public userInfo = JSON.parse(localStorage.getItem("userInfo"));
  private ngUnsubscribe = new Subject();

  constructor(
    private syDocumentTypeService: SydocumenttypeService,
    private trDocumentService: TrdocumentService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getDocument();
  }

  OnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  getDocument() {
    this.syDocumentTypeService.findAll().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.documentTypeList = result.serviceResult.value;

        // Get debt collection document.
        if (this.data?.debtCollectionNumber) {
          this.trDocumentService.findByDebt(this.data.debtCollectionNumber).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
            if (result.serviceResult.status === "Success") {
              for (let documentType of this.documentTypeList) {
                for (let document of result.serviceResult.value) {
                  if ((documentType.documentTypeId === document.documentTypeId) && (document.active === 'Y')) {
                    documentType.checked = true;
                    documentType.documentId = document.documentId;
                  }
                }
              }
            } else {
              Swal.fire("Error !", result.serviceResult.text, "error");
            }
          }, err => {
            console.error(err);
            Swal.fire("Error !", err.message, "error");
          });
        }
      } else {
        Swal.fire("Error !", result.serviceResult.text, "error");
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    });
  }

  onSave(documentTypeId: any, status: boolean, documentId: any) {
    let documentData = new trdocument();
    documentData.documentTypeId = documentTypeId;
    documentData.documentId = documentId;
    documentData.debtCollectionNumber = this.data.debtCollectionNumber;
    documentData.active = (status) ? 'Y' : 'N';
    documentData.createBy = this.userInfo.user.username;
    documentData.createDate = new Date();
    documentData.updateBy = this.userInfo.user.username;
    documentData.updateDate = new Date();

    this.trDocumentService.createOrUpdate(documentData).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.snackBar.open("บันทึกสำเร็จ !", "close");
        this.getDocument();
      } else {
        Swal.fire("Error !", result.serviceResult.text, "error");
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    });
  }

}
