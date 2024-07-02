import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientMappingComponent } from '@app/rappit-admin/client-mapping/client-mapping.component';
import { CanDeactivateGuard } from '@baseapp/auth.can-deactivate-guard.service';

export const routes: Routes = [

  {
       path: 'client',
       component: ClientMappingComponent,
       canDeactivate: [CanDeactivateGuard],
       data: {
            label: "CLIENT_MAPPING",
            breadcrumb: "CLIENT_MAPPING",
            roles: [
                 "Development Administrator"
            ]
       }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RappitAdminRoutingBaseModule { }
