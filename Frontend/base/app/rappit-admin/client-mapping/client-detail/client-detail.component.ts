import { Component, EventEmitter, Output, inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClientMappingBaseService } from '../client-mapping.base.service';
import { Subscription } from 'rxjs';
import { ClientMappingBase } from '../client-mapping.base.model';
import { AppConstants } from '@app/app-constants';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss']
})
export class ClientDetailComponent {

  public config = inject(DynamicDialogConfig);
  public DynamicDialogRef = inject(DynamicDialogRef);
  public ClientMappingService = inject(ClientMappingBaseService);
  public messageService = inject(MessageService)

  ClientMappingFormControls : UntypedFormGroup = new UntypedFormGroup({
    saEmail: new UntypedFormControl('',[Validators.required]),
    userContextRequired: new UntypedFormControl('',[]),
    producer: new UntypedFormControl('',[]),
    consumer: new UntypedFormControl('',[]),
  });
  id:any;
  rowEvent:any;
  subscriptions: Subscription[] = [];
  currentDefaultValues:any;

  ngOnInit() {
    this.id = this.config.data.id;
    this.rowEvent = this.config.data.event;
    this.getDefaultValues();
  }
  onDestroy() {
    this.subscriptions.forEach((subs: { unsubscribe: () => void; }) => subs.unsubscribe());
  }
  isValidEmail(email:string): boolean {
    const emailRegex = AppConstants.emailRegex;
    return emailRegex.test(email);
  }

  getDefaultValues(){
    if (environment.prototype && this.id) {
      const params = {
   sid: this.id
 };
 const getByIdSubscription = this.ClientMappingService.getProtoTypingDataById(params).subscribe((res: any) => {
   res = JSON.parse(JSON.stringify(res))
   this.setDefaultValues(res);

 });
 this.subscriptions.push(getByIdSubscription);
} else if (this.id) {
 const params = {
   sid: this.id
 };
 const dataSubscription = this.ClientMappingService.getById (params).subscribe((res: ClientMappingBase[]) => {
  console.log(res);
  this.setDefaultValues(res);
 });
 this.subscriptions.push(dataSubscription);
}
else {
 this.setDefaultValues({});
}

  }

  setDefaultValues(data:any){
    var uc = "No";
    if (data.authenticationMode == "USER"){
       uc = "Yes";
    }
    this.ClientMappingFormControls.patchValue({
      saEmail: data.saEmail,
      consumer: data.consumer,
      producer: data.producer,
      userContextRequired: uc,
    });
    this.currentDefaultValues=data;
  }
  cancel() {
    this.DynamicDialogRef.close();

  }
  updateValues(){
    let updateData= this.ClientMappingFormControls.value;
    if(environment.prototype){
      this.DynamicDialogRef.close("saved");
    }
    else if (this.isValidEmail(updateData.saEmail)){
   let updateparams ={
    saEmail: updateData.saEmail,
   }
    let params={
      ...this.currentDefaultValues,
      saEmail: updateparams.saEmail ?? updateData.saEmail
    };
    const updateSubscription = this.ClientMappingService.update(params).subscribe((res: any) => {
      if (res)
      console.log("Settings Updated")
    }); 
    this.subscriptions.push(updateSubscription);
    this.DynamicDialogRef.close("saved");
  }else{
    this.showMessage({ severity: 'error', summary: '', detail: "Email Invalid" });
  }
  }
  showMessage(config:any){
    this.messageService.clear();  
    this.messageService.add(config);
  }
}
