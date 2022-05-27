import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-debt-manage',
  templateUrl: './modal-debt-manage.component.html',
  styleUrls: ['./modal-debt-manage.component.scss']
})
export class ModalDebtManageComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    // console.log(this.data);
  }

  getResult(value: any) {
    this.data = value;
  }
}
