import { NgModule } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SharedModule } from '@app/shared/shared.module';
import { WidgetsBaseModule } from '@libbase/widgets.base.module';
import { ApplicationUserDetailComponent } from '@app/application-user/application-user/application-user-detail/application-user-detail.component';
import { ApplicationUserListComponent } from '@app/application-user/application-user/application-user-list/application-user-list.component';
import { CanDeactivateGuard } from '@baseapp/auth.can-deactivate-guard.service';

@NgModule({
  declarations: [
    ApplicationUserDetailComponent,
    ApplicationUserListComponent
  ],
  imports: [
    SharedModule,
    WidgetsBaseModule,
  ],
  exports: [
    SharedModule,
	WidgetsBaseModule,
    ApplicationUserDetailComponent,
    ApplicationUserListComponent
  ],
  providers: [
  	BsModalService,
	CanDeactivateGuard
  ],
  
})
export class ApplicationUserBaseModule { }