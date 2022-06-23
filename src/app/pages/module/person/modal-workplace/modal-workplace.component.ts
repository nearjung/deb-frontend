import { Component, Input, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { trworkplace } from 'src/app/model/trworkplace';
import { MsamphuresService } from 'src/app/services/msamphures.service';
import { MsdistrictsService } from 'src/app/services/msdistricts.service';
import { MsprovincesService } from 'src/app/services/msprovinces.service';
import { TrworkplaceService } from 'src/app/services/trworkplace.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-workplace',
  templateUrl: './modal-workplace.component.html',
  styleUrls: ['./modal-workplace.component.scss']
})
export class ModalWorkplaceComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  @Input() idcard: string;
  @Input() data: any;
  public userInfo = JSON.parse(localStorage.getItem("userInfo"));
  public trworkplace = new trworkplace();
  public provinceList: any;
  public amphureList: any;
  public districtList: any;
  public page: string = "list";
  public workPlaceList: any;

  constructor(
    private msProvinceService: MsprovincesService,
    private msAmphureService: MsamphuresService,
    private msDistrictService: MsdistrictsService,
    private trWorkplaceService: TrworkplaceService
  ) {
    this.getProvince();
  }

  ngOnInit(): void {
    if (this.data) {
      this.trworkplace = this.data;
    } else {
      this.trworkplace.idcard = this.idcard;
    }

    this.getWorkplace();
  }

  OnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  getWorkplace() {
    this.trWorkplaceService.findByIdCard(this.trworkplace.idcard).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.workPlaceList = result.serviceResult.value;
      }
    })
  }

  getProvince() {
    this.msProvinceService.findAll().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.provinceList = result.serviceResult.value;
      }
    }, err => {
      console.error(err);
    })
  }

  getAmphure(provinceId: string) {
    this.msAmphureService.findByProvinceId(provinceId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.amphureList = result.serviceResult.value;
      }
    })
  }

  getDistrict(amphureId: string) {
    this.msDistrictService.findByAmphureId(amphureId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        this.districtList = result.serviceResult.value;
      }
    })
  }

  onClear() {
    this.trworkplace = new trworkplace();
  }

  onDelete() {
    Swal.fire({
      title: "แจ้งเตือน !",
      text: "คุณต้องการลบข้อมูลนี้หรือไม่ ?",
      icon: "question",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
      showCancelButton: true
    }).then(btn => {
      if (btn.isConfirmed) {
        this.onSave("yes");
      }
    })
  }

  onSave(remove: string = "no") {
    this.trworkplace.active = (remove === 'yes') ? "N" : "Y";
    if (!this.trworkplace.createBy) {
      this.trworkplace.createBy = this.userInfo.user.username;
      this.trworkplace.createDate = new Date();
    }
    this.trworkplace.updateBy = this.userInfo.user.username;
    this.trworkplace.updateDate = new Date();
    this.trWorkplaceService.createOrUpdate(this.trworkplace).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        Swal.fire("Success !", "บันทึกสำเร็จ !", "success");
      } else {
        Swal.fire("Error !", result.serviceResult.text, "error");
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    })
  }
}
