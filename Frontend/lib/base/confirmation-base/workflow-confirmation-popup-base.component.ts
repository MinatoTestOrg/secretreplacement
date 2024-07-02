
import { Directive, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Directive({ providers: [MessageService] })
export class WorkflowConfirmationPopupBaseComponent {
  comments: string = "";
  inValid: boolean = false;

  public DynamicDialogRef = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public messageService = inject(MessageService);
  public dataConfig: any


  onInit(): void {
    this.dataConfig = this.config.data.config;
  }

  result: any = {
    comments: '',
    accepted: false
  }

  submit() {
    this.result.accepted = true;
    this.result.comments = this.comments;
    if (this.config.data.isRequired && !this.comments) {
      this.inValid = true;
      this.messageService.clear();
      const config = {
        severity: 'error', summary: '', detail: 'comment is required'
      }

      this.messageService.add(config);
      return;
    }
    this.DynamicDialogRef.close(this.result);
  }

  cancel() {
    this.result.accepted = false;
    this.DynamicDialogRef.close(this.result);
  }
}
