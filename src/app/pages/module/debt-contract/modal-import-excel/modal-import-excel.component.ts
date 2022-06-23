import { Component, OnInit } from '@angular/core';
import { trdebtcollection } from 'src/app/model/trdebtcollection';
import { TrdebtcollectionService } from 'src/app/services/trdebtcollection.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { excelColumn } from '../../../../core/middleclass';

@Component({
  selector: 'app-modal-import-excel',
  templateUrl: './modal-import-excel.component.html',
  styleUrls: ['./modal-import-excel.component.scss']
})
export class ModalImportExcelComponent implements OnInit {
  public jsonData: any;
  public fileData: any;
  public loadingStatus: string;
  public dataList: any;

  constructor(
    private trdebtcollectionService: TrdebtcollectionService
  ) { }

  ngOnInit(): void {
  }


  trackFile(e: any) {
    const file = e.target.files[0];
    if (file.type.includes(".sheet")) {
      this.onSetJson(e);
    } else {
      Swal.fire("Error !", "รองรับไฟล์ .xlsx เท่านั้น !", 'error');
    }
  }

  onSetJson(ev: any) {
    this.loadingStatus = "กำลังอัพโหลดไฟล์";
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      this.jsonData = jsonData;
      let bkCnt = 0;
      let bpCnt = 0;
      this.dataList = [];

      for (let bk of jsonData['DATA บข']) {
        let columnList = Object.getOwnPropertyNames(bk);

        for (let column of columnList) {
          for (let ex of excelColumn) {
            if (column == ex.before) {
              bk[ex.after] = bk[column];
              delete bk[column];
            }
          }
        }

        let data = new trdebtcollection();
        data = bk;
        this.dataList.push(data);

        bkCnt = bkCnt + 1;
        if (bkCnt === +jsonData['DATA บข'].length && bpCnt === +jsonData['DATA บภ'].length) {
          this.onSave();
        }
      }

      for (let bp of jsonData['DATA บภ']) {
        let columnList = Object.getOwnPropertyNames(bp);

        for (let column of columnList) {
          for (let ex of excelColumn) {
            if (column == ex.before) {
              bp[ex.after] = bp[column];
              delete bp[column];
            }
          }
        }

        let data = new trdebtcollection();
        data = bp;
        this.dataList.push(data);

        bpCnt = bpCnt + 1;
        if (bkCnt === +jsonData['DATA บข'].length && bpCnt === +jsonData['DATA บภ'].length) {
          this.onSave();
        }
      }



    }
    reader.readAsBinaryString(file);
  }

  onSave() {
    this.trdebtcollectionService.importFromExcel(this.dataList).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        console.log("Success");
        this.loadingStatus = "สำเร็จ";
      } else {
        this.loadingStatus = "ล้มเหลว";
      }
    }, err => {
      console.error(err);
    })
  }

}
