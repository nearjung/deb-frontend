import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Location } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { TrdebtcollectionService } from 'src/app/services/trdebtcollection.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index-page',
  templateUrl: './index-page.component.html',
  styleUrls: ['./index-page.component.scss']
})
export class IndexPageComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public page: string;
  public device: any;
  public userInfo = JSON.parse(localStorage.getItem("userInfo"));
  public userRole = this.userInfo?.userRole.map(x => x.roleId).join(",");
  public sideMenu: any;

  constructor(
    public router: Router,
    private location: Location,
    private deviceService: DeviceDetectorService,
    private routerActive: ActivatedRoute,
  ) {
    this.page = this.routerActive.params['value']['page'];
    if (!this.userInfo) {
      this.router.navigate(['login']);
    }
  }


  ngOnInit(): void {
    if (this.userInfo) {
      this.userMenu();
    }
  }

  OnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  userMenu() {
    if (this.userRole.includes("1")) {
      this.sideMenu = [
        {
          name: 'แดชบอร์ด',
          icon: 'equalizer',
          pathLink: './'
        }, {
          name: 'รายการสัญญา',
          icon: 'description',
          pathLink: 'debt'
        }, {
          name: 'รายการสัญญา D2U',
          icon: 'content_paste_search',
          pathLink: 'debtTrace'
        }, {
          name: 'รายการสัญญาอายัด',
          icon: 'content_paste_search',
          pathLink: 'freezeTrace'
        }, {
          name: 'รายการสัญญายึดทรัพย์',
          icon: 'content_paste_search',
          pathLink: 'sequeststerTrace'
        }, {
          name: 'รายชื่อบุคคล',
          icon: 'groups',
          pathLink: 'person'
        }, {
          name: 'จัดการ User',
          icon: 'manage_accounts',
          pathLink: 'user'
        }, {
          name: 'ตั้งค่าคอมมิชชัน',
          icon: 'attach_money',
          pathLink: 'commission'
        }, {
          name: 'ตั้งค่าเป้าหมาย',
          icon: 'flag',
          pathLink: 'target'
        }, {
          name: 'Export Data',
          icon: 'storage',
          pathLink: 'export'
        },
      ]
    }

  }


  logout() {
    localStorage.clear();
    this.router.navigate(["./login"]);
  }

  changeMenu(module: string, moduleName: string) {
    this.page = module;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    // this.location.replaceState('/' + module);
    this.router.navigate(['./' + module]);
  }

}
