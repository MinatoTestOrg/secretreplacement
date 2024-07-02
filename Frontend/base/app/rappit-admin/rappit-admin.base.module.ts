import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api';

import { CanDeactivateGuard } from '@baseapp/auth.can-deactivate-guard.service';
import { RappitAdminRoutingBaseModule } from './rappit-admin-routing.base.module';
import { ClientMappingComponent } from '@app/rappit-admin/client-mapping/client-mapping.component';
import { DataTablesModule } from 'angular-datatables';
import { ClientDetailComponent } from './client-mapping/client-detail/client-detail.component';
import { WidgetsBaseModule } from '@baseapp/widgets/widgets.base.module';
// import { WidgetsBaseModule } from '@libbase/widgets.base.module';


@NgModule({
  declarations: [
    ClientMappingComponent,
    ClientDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    WidgetsBaseModule,
    RappitAdminRoutingBaseModule,
    DataTablesModule
  ],
  exports:[SharedModule,
    WidgetsBaseModule,
    ClientMappingComponent,
    ClientDetailComponent],
  providers:[
    CanDeactivateGuard]

})
export class RappitAdminBaseModule { }
