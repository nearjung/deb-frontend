import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { SydocumenttypeService } from 'src/app/services/sydocumenttype.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-document-manage',
  templateUrl: './modal-document-manage.component.html',
  styleUrls: ['./modal-document-manage.component.scss']
})
export class ModalDocumentManageComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public documentList: any;

  constructor(
    private syDocumentTypeService: SydocumenttypeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

  ngOnInit(): void {
    this.getDocumentList();
  }

  OnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  getDocumentList() {
    this.syDocumentTypeService.findByStatus(this.data.statusCode).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.documentList = result.serviceResult.value;
      } else {
        Swal.fire("Error !", result.serviceResult.text, "error");
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    });
  }

  trackFile(e: any, data: any) {
    const file = e.target.files[0];
    if(file.type.includes("png") || file.type.includes("jpg") || file.type.includes("jpeg") || file.type.includes("pdf")) {
      data.document = file;
    } else {
      Swal.fire("Error !", "รองรับไฟล์ jpg, png, pdf เท่านั้น !", 'error');
    }
  }

  onSave(data: any) {
    console.log(data);
    
  }
}
