import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload';
import { IndexPageRoutingModule } from './index-page-routing.module';
import { IndexPageComponent } from './index-page.component';
import { MaterialModule } from 'src/app/app-material.module';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { DebtContractComponent } from '../debt-contract/debt-contract.component';
import { PersonComponent } from '../person/person.component';
import { CommissionComponent } from '../commission/commission.component';
import { TargetManageComponent } from '../target-manage/target-manage.component';
import { ExportDataComponent } from '../export-data/export-data.component';
import { ModalDebtManageComponent } from '../debt-contract/modal-debt-manage/modal-debt-manage.component';
import { CustomerInformationComponent } from '../debt-contract/modal-debt-manage/customer-information/customer-information.component';
import { DebtInformationComponent } from '../debt-contract/modal-debt-manage/debt-information/debt-information.component';
import { DiscountInformationComponent } from '../debt-contract/modal-debt-manage/discount-information/discount-information.component';
import { DocumentInformationComponent } from '../debt-contract/modal-debt-manage/document-information/document-information.component';
import { LawsuitInformationComponent } from '../debt-contract/modal-debt-manage/lawsuit-information/lawsuit-information.component';
import { PaymentInformationComponent } from '../debt-contract/modal-debt-manage/payment-information/payment-information.component';
import { PropertyInformationComponent } from '../debt-contract/modal-debt-manage/property-information/property-information.component';
import { UserManageComponent } from '../user-manage/user-manage.component';
import { FormsModule } from '@angular/forms';
import { ModalPersonManageComponent } from '../person/modal-person-manage/modal-person-manage.component';
import { ModalRelationManageComponent } from '../person/modal-relation-manage/modal-relation-manage.component';
import { ModalCustomerRelationComponent } from '../debt-contract/modal-debt-manage/customer-information/modal-customer-relation/modal-customer-relation.component';
import { ModalPropertyComponent } from '../debt-contract/modal-debt-manage/property-information/modal-property/modal-property.component';
import { ModallawsuitComponent } from '../debt-contract/modal-debt-manage/lawsuit-information/modal-lawsuit/modal-lawsuit.component';
import { ModalPaymentComponent } from '../debt-contract/modal-debt-manage/payment-information/modal-payment/modal-payment.component';
import { FileSelectDirective } from 'ng2-file-upload';
import { ModalTraceSettingComponent } from '../debt-contract/modal-trace-setting/modal-trace-setting.component';
import { DebtTraceComponent } from '../debt-trace/debt-trace.component';
import { ModalTraceWorkComponent } from '../debt-trace/modal-trace-work/modal-trace-work.component';
import { ModalTraceFormComponent } from '../debt-trace/modal-trace-work/modal-trace-form/modal-trace-form.component';
import { ModalDocumentManageComponent } from '../debt-trace/modal-document-manage/modal-document-manage.component';
import { ModalWorkplaceComponent } from '../person/modal-workplace/modal-workplace.component';
import { ModalTelephoneListComponent } from '../debt-trace/modal-telephone-list/modal-telephone-list.component';
import { ModalImportExcelComponent } from '../debt-contract/modal-import-excel/modal-import-excel.component';


@NgModule({
  declarations: [
    IndexPageComponent,
    DashboardComponent,
    DebtContractComponent,
    PersonComponent,
    UserManageComponent,
    CommissionComponent,
    TargetManageComponent,
    ExportDataComponent,
    ModalDebtManageComponent,
    CustomerInformationComponent,
    DebtInformationComponent,
    DiscountInformationComponent,
    DocumentInformationComponent,
    LawsuitInformationComponent,
    PaymentInformationComponent,
    PropertyInformationComponent,
    ModalPersonManageComponent,
    ModalRelationManageComponent,
    ModalCustomerRelationComponent,
    ModalPropertyComponent,
    ModallawsuitComponent,
    ModalPaymentComponent,
    ModalTraceSettingComponent,
    DebtTraceComponent,
    ModalTraceWorkComponent,
    ModalTraceFormComponent,
    ModalDocumentManageComponent,
    ModalWorkplaceComponent,
    ModalTelephoneListComponent,
    ModalImportExcelComponent
  ],
  imports: [
    CommonModule,
    IndexPageRoutingModule,
    MaterialModule,
    FormsModule,
    FileUploadModule,
  ]
})
export class IndexPageModule { }
