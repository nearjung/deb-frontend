import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public page: string;
  public device: any;
  public userInfo = JSON.parse(localStorage.getItem("userInfo"));
  public sideMenu: any;

  constructor(
    public router: Router,
    private location: Location,
    private deviceService: DeviceDetectorService,
    ) { }

  ngOnInit(): void {
    this.sideMenu = [
      {
        name: 'แดชบอร์ด',
        icon: 'equalizer',
        pathLink: 'dashboard'
      },
      {
        name: 'รายชื่อลูกค้า',
        icon: 'groups',
        pathLink: 'customer-list'
      },
      {
        name: 'คอมมิชชัน',
        icon: 'assignment_turned_in',
        pathLink: 'commission'
      },
      {
        name: 'รายชื่อพนักงาน',
        icon: 'work',
        pathLink: 'employee-list'
      },
      {
        name: 'กำหนดเป้าหมายบริษัท',
        icon: 'flag',
        pathLink: 'business-target'
      },
      {
        name: 'แจ้งปัญหา',
        icon: 'report_problem',
        pathLink: 'comment-talk'
      }
    ]
  }

  
  logout() {

  }

  changeMenu(module: string, moduleName: string) {
    this.page = module;
    this.location.replaceState('/' + module);
  }

}
