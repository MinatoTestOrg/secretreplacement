import { ApplicationUserService } from '../application-user.service';
import { ApplicationUserBase} from '../application-user.base.model';
import { Directive, EventEmitter, Input, Output, SecurityContext, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AppUtilBaseService } from '@baseapp/app-util.base.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ChangeLogsComponent } from '@libsrc/change-logs/change-logs.component'

import { ApplicationUserApiConstants } from '@baseapp/application-user/application-user/application-user.api-constants';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationPopupComponent } from '@libsrc/confirmation/confirmation-popup.component';
import { WorkflowConfirmationPopupComponent } from '@libsrc/confirmation/workflow-confirmation-popup.component';
import { FormControl, FormGroup, Validators, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { debounceTime, fromEvent, catchError, combineLatest, distinctUntilChanged, of, Observer, forkJoin, Subscription, map, Observable, Subject } from 'rxjs';
import { environment } from '@env/environment';
import { ActionItem } from '@libsrc/action-bar/action-bar.component';
import { AppConstants } from '@app/app-constants';
import { AppGlobalService } from '@baseapp/app-global.service';
import { AppBaseService } from '@baseapp/app.base.service';
import { WorkflowSimulatorComponent } from '@libsrc/workflow-simulator/workflow-simulator.component';
import { BreadcrumbService } from '@libsrc/breadcrumb/breadcrumb.service';
import { UploaderService } from '@baseapp/upload-attachment.service';
import { BaseAppConstants } from '@baseapp/app-constants.base';
import { WorkflowHistoryComponent } from '@libsrc/workflow-history/workflow-history.component';
import { CustomValidatorService } from '@libsrc/validators/customValidator.service';
import { AppLoaderService } from '@baseapp/app-loader.service';
import { BaseService } from '@baseapp/base.service';

@Directive(
{
	providers:[MessageService, ConfirmationService, DialogService]
}
)
export class ApplicationUserDetailBaseComponent{
	
	
	bsModalRef?: BsModalRef;
	isSearchFocused:boolean = false;
showBreadcrumb = AppConstants.showBreadcrumb;
	comments: string ='';
confirmationReference:any;
	id: any;
pid:any;
isMobile: boolean = AppConstants.isMobile;  
errorfields: any = {};           
backupData:any = {};
hiddenFields:any = {};
data:any = {};
formErrors:any = {};
inValidFields:any = {};
formFieldConfig:any = {};
securityJson:any = {
}
formConfig = {};     
actionButtons:ActionItem[] = [];  
wizardItems:any = [];
currentUserData:any;
selectedItems:any ={};
workflowType = "";
workFlowEnabled = false;
workFlowInitialState = "";
workFlowField = "";
workflowActions:any ={
    disableActions:[],
    enableActions:[],
    hideActions:[]
  };
  isFormValueChanged: boolean = false;
  mandatoryFields:any ={};
  validatorsRetained:any ={};
  isSaveResponseReceived:boolean = false;
  formSecurityConfig:any = {};
  enableReadOnly = AppConstants.enableReadOnly;
 showScrollSpy = AppConstants.showScrollSpy;
isRowSelected:boolean = true; 
isPrototype = environment.prototype;
isList = false;
detailPageIgnoreFields:any=[];
autoSuggestPageNo:number = 0;
complexAutoSuggestPageNo:number = 0
  fieldEditMode: any = {};
conditionalActions:any ={
  disableActions:[],
  hideActions:[]
}
actionBarConfig:any =[];
dateFormat: string = AppConstants.calDateFormat;
subscriptions: Subscription[] = [];
activeTabIndexes: any = {};
 showWorkflowSimulator:boolean = false;
roles:any ={};
timeFormatPrimeNG: string = AppConstants.timeFormatPrimeNG;
dateFormatPrimeNG: string = AppConstants.dateFormatPrimeNG ;
minFraction = AppConstants.minFraction;
maxFraction = AppConstants.maxFraction;
currency = AppConstants.currency;
currencyDisplay = AppConstants.currencyDisplay;
defaultLocale: string = AppConstants.defaultLocale; 
calculationError:any ={};
public validators:any ={};
public errorMessages:any = {};
 deletedAttachments:any ={};
fileErrorMessages:any ={}
inputText:any ='';
defaultActions= ['save','cancel','delete','refresh','back','changelog','workflowhistory','import','export','new'];
currentUserRolesMapping:any ={};
captionConfig: any = {};
 referenceData: any = {};
 displayDataDetails: any = {};
outputMappingFieldsConfig:any ={};
 formattedCaptionData:any = {};
 queryParams:any ={};
  showForm:boolean = true;
  filtersEmptyMsg:string = '';
  tableaccess: boolean = true;

	isChildPage:boolean = false;

	
	leftActionBarConfig : any = {
  "children" : [ {
    "visibility" : "show",
    "buttonStyle" : "curved",
    "icon" : {
      "type" : "icon",
      "icon" : {
        "label" : "fas fa-arrow-left",
        "value" : "fas fa-arrow-left"
      }
    },
    "confirmationText" : "confirm",
    "label" : "BACK",
    "type" : "button",
    "beforeAction" : "none",
    "outline" : false,
    "buttonType" : "icon_on_left",
    "showOn" : "both",
    "enableOnlyIfRecordSelected" : false,
    "buttonId" : "BackbuttonId0",
    "buttonEnabled" : "yes",
    "action" : "back",
    "confirmationTitle" : "confirmation",
    "fields" : [ ],
    "confirmationButtonText" : "yes",
    "cancelButtonText" : "no"
  }, {
    "outline" : false,
    "children" : [ {
      "visibility" : "show",
      "buttonStyle" : "curved",
      "confirmationText" : "confirm",
      "label" : "SAVE",
      "type" : "button",
      "visiblity" : "show",
      "beforeAction" : "none",
      "outline" : false,
      "buttonType" : "icon_on_left",
      "showOn" : "both",
      "enableOnlyIfRecordSelected" : false,
      "buttonId" : "SavebuttonId0",
      "buttonEnabled" : "yes",
      "action" : "save",
      "confirmationTitle" : "confirmation",
      "conditionForButtonEnable" : "",
      "fields" : [ ],
      "confirmationButtonText" : "yes",
      "cancelButtonText" : "no"
    }, {
      "visibility" : "show",
      "buttonStyle" : "curved",
      "confirmationText" : "confirm",
      "label" : "CANCEL",
      "type" : "button",
      "visiblity" : "show",
      "beforeAction" : "none",
      "outline" : false,
      "buttonType" : "icon_on_left",
      "showOn" : "both",
      "enableOnlyIfRecordSelected" : false,
      "buttonId" : "CancelbuttonId1",
      "buttonEnabled" : "yes",
      "action" : "cancel",
      "confirmationTitle" : "confirmation",
      "conditionForButtonEnable" : "",
      "fields" : [ ],
      "confirmationButtonText" : "yes",
      "cancelButtonText" : "no"
    }, {
      "visibility" : "show",
      "buttonStyle" : "curved",
      "confirmationText" : "confirm",
      "label" : "CHANGELOG",
      "type" : "button",
      "visiblity" : "show",
      "beforeAction" : "none",
      "outline" : false,
      "buttonType" : "icon_on_left",
      "showOn" : "both",
      "enableOnlyIfRecordSelected" : false,
      "buttonId" : "ChangelogbuttonId2",
      "buttonEnabled" : "yes",
      "action" : "changelog",
      "confirmationTitle" : "confirmation",
      "conditionForButtonEnable" : "",
      "fields" : [ ],
      "confirmationButtonText" : "yes",
      "cancelButtonText" : "no"
    } ],
    "displayCount" : "2",
    "label" : "BUTTON_GROUP",
    "type" : "buttonGroup"
  } ],
  "type" : "actionBar"
}
	workflowActionBarConfig : any = {
  "outline" : false,
  "label" : "Workflow Action Bar",
  "type" : "workflowActionBar"
}
	detailCaptionBarConfig : any = {
  "children" : [ ],
  "type" : "captionBar"
}
	detailFormStructureConfig : any = {
  "children" : [ ]
}
	detailFormConfig : any = {
  "outline" : false,
  "disabledFieldsByLookup" : [ ],
  "children" : [ {
    "allowEditing" : "yes",
    "fieldName" : "email",
    "data" : "",
    "isPrimaryKey" : true,
    "label" : "EMAIL",
    "type" : "formField",
    "mandatory" : "yes",
    "field" : "email",
    "uiType" : "email",
    "name" : "email",
    "fieldType" : "string",
    "allowViewing" : "yes",
    "fieldId" : "email"
  }, {
    "allowEditing" : "yes",
    "fieldName" : "firstName",
    "data" : "",
    "isPrimaryKey" : false,
    "label" : "FIRST_NAME",
    "type" : "formField",
    "mandatory" : "yes",
    "field" : "firstName",
    "uiType" : "text",
    "name" : "firstName",
    "fieldType" : "string",
    "allowViewing" : "yes",
    "fieldId" : "firstName"
  }, {
    "allowEditing" : "yes",
    "fieldName" : "lastName",
    "data" : "",
    "isPrimaryKey" : false,
    "label" : "LAST_NAME",
    "type" : "formField",
    "mandatory" : "yes",
    "field" : "lastName",
    "uiType" : "text",
    "name" : "lastName",
    "fieldType" : "string",
    "allowViewing" : "yes",
    "fieldId" : "lastName"
  } ],
  "columns" : "2",
  "type" : "form",
  "actions" : {
    "read" : {
      "App Admin" : {
        "access" : "yes"
      }
    },
    "changelog" : {
      "App Admin" : {
        "access" : "yes"
      }
    },
    "update" : {
      "App Admin" : {
        "access" : "yes"
      }
    },
    "create" : {
      "App Admin" : {
        "access" : "yes"
      }
    },
    "delete" : {
      "App Admin" : {
        "access" : "yes"
      }
    }
  },
  "queryViewMapping" : { }
}
	pageViewTitle: string = 'APPLICATION_USER_DETAIL';
	
	public applicationUserService = inject(ApplicationUserService);
public appUtilBaseService = inject(AppUtilBaseService);
public translateService = inject(TranslateService);
public messageService = inject(MessageService);
public confirmationService = inject(ConfirmationService);
public dialogService = inject(DialogService);
public domSanitizer = inject(DomSanitizer);
public bsModalService = inject(BsModalService);
public activatedRoute = inject(ActivatedRoute);
public breadcrumbService = inject(BreadcrumbService);
public appBaseService = inject(AppBaseService);
public appLoaderService = inject(AppLoaderService);
public router = inject(Router);
public appGlobalService = inject(AppGlobalService);
public customValidatorService = inject(CustomValidatorService);
public uploaderService = inject(UploaderService);
public baseService = inject(BaseService);
public location = inject(Location);
		detailFormControls : UntypedFormGroup = new UntypedFormGroup({
	firstName: new UntypedFormControl('',[Validators.required]),
	email: new UntypedFormControl('',[Validators.required]),
	lastName: new UntypedFormControl('',[Validators.required]),
});


	
	configureEmptyValuestoNull(data:any){
           const value =  Object.keys(data).reduce((acc:any, key:string) => {acc[key] = data[key] === '' ||(Array.isArray(data[key]) && data[key].length == 0)? null : 
        data[key]; return acc; }, {})
        return value;
      }
	onWorkflowhistory() {
        const workflowHistory = this.dialogService.open(WorkflowHistoryComponent, {
          header: 'Workflow History',
          width: '60%',
          contentStyle: { "max-height": "500px", "overflow": "auto" },
          styleClass: "workflow-history",
          data: {
            id: this.id,
            workflowType: this.workflowType
          }
        });
      }
	bindData(data: any, ele: any, parentEle?: string, index?: number) {
        if (ele.fieldType == 'Date' && data) {
          if (ele.uiType == 'autosuggest') {
            data['displayField']  = this.appUtilBaseService.formatRawDatatoRedableFormat({},data['displayField'],ele?.displayFields[0]?.f_type)
          }
          else {
            const formattedDate = new Date(data);
            return formattedDate;
          }
        }
        else if (['imageCarousel', 'attachments'].includes(ele.uiType)) {
          const responseFiles = this.appUtilBaseService.createImagePreviewURL(data);
          return responseFiles;
        } 
          return data;
      }
	confirmationPopup(fields: []) : Observable<boolean>{
        return Observable.create((observer: Observer<boolean>) => {
          this.confirmationService.confirm({
            message: this.translateService.instant('COMPLEX_RECORD_SAVE_CONFIRMATION', { field: fields.toString() }),
            header: 'Confirmation',
            icon: 'pi pi-info-circle',
            accept: () => {
              fields.map((o) => $($(`.${o}_editSave-btn`)).trigger('click'));
               observer.next(true) 
               observer.complete();       
              },
            reject: () => {
              fields.map((o) => $($(`.${o}_editCancel-btn`)).trigger('click'));
              observer.next(true) 
               observer.complete(); 
            },
          });
        });
      }
	actionBarAction(btn: any) {
    const methodName: any = (`on` + btn.action.charAt(0).toUpperCase() + btn.action.slice(1));
    let action: Exclude<keyof ApplicationUserDetailBaseComponent, ' '> = methodName;
   const config = this.getButtonConfig(btn);
    if (btn.action === 'navigate_to_page' && btn.pageName?.url) {
      this.router.navigateByUrl(btn.pageName.url);
    }
else if(this.defaultActions.includes(btn.action) && typeof this[action] === "function"){
      this[action]();
    }
    else if (typeof this[action] === "function" && (btn.beforeAction ==='show_confirmation' || btn.beforeAction === 'get_additional_info')) {
      this.showConfirmationPopup(config,btn);
    }
    else if (typeof this[action] === "function"){
      this[action]();
    }
  }

  showConfirmationPopup(config: any, btn: any) {
     const methodName: any = (`on` + btn.action.charAt(0).toUpperCase() + btn.action.slice(1));
    let action: Exclude<keyof ApplicationUserDetailBaseComponent, ' '> = methodName;
    const confirmationReference = this.dialogService.open(ConfirmationPopupComponent, {
      header: config.confirmationTitle,
      width: '30%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      styleClass: "confirm-popup-modal",
      showHeader: true,
      closable: true,
      data: {
        config: config,
      }
    });
    confirmationReference.onClose.subscribe((result: any) => {
      if (result) {
        if (typeof this[action] === "function") {
          this[action](result);
        }
      }
    })
  }
	editFormula(config:any,fieldname:any){
         const fieldConfig = config[fieldname]
         if(fieldConfig.formulaMethod){
           let methodName: Exclude<keyof ApplicationUserDetailBaseComponent, ' '> = fieldConfig.formulaMethod
             if(typeof this[methodName] ==="function")
              this[methodName](this.detailFormControls.getRawValue());
         }
       }
	denormalize(backupData: any) {
    }
	createAutoSuggestFields(ele: any) {
        if (!this.selectedItems?.hasOwnProperty(ele)) {
          this.selectedItems[ele] = [];
        }
    
      }
	getWorkflowConfig(workflowInfo?:any) {
    const workFlowInfo:any = (this.id)? this.data?.workflowInfo:workflowInfo;
    const params = {
      workflowType: this.workflowType
    }
    if(environment.prototype && this.workFlowEnabled){
      this.appBaseService.getPrototypingworkflow(this.workflowType).subscribe((res:any)=>{
        this.securityJson = res.config;
        this.configureFormOnWorkflow(workFlowInfo);
      })
    }
  }
	loadActionbar(){
        
    }
	loadCaptionbarItems(){
        
    }
	disableDependantFields() {
        const detailFormControls = this.detailFormControls.getRawValue()
        for (const ele in this.formFieldConfig) {
          if (this.formFieldConfig[ele].uiType === 'autosuggest') {
            if (this.formFieldConfig[ele].mandatoryFilters) {
              this.disableInputFilters(ele, detailFormControls);
            }
            if (this.formFieldConfig[ele].filterOutputMapping) {
              this.formFieldConfig[ele].filterOutputMapping.forEach((f: any) => {
                this.detailFormControls.get(f.tableField)?.disable({ emitEvent: false });
              })
            }
            if (this.detailFormConfig.disabledFieldsByLookup && this.detailFormConfig.disabledFieldsByLookup.includes(this.formFieldConfig[ele].fieldName)) {
              this.detailFormControls.get(this.formFieldConfig[ele].fieldName)?.disable({ emitEvent: false });
            }
          }
          if(this.formFieldConfig[ele].fieldName =="sid"  || this.formFieldConfig[ele].fieldName=="createdBy" || this.formFieldConfig[ele].fieldName=="modifiedBy" || this.formFieldConfig[ele].fieldName =="createdDate" || this.formFieldConfig[ele].fieldName =="modifiedDate" ){
            this.disableSysGenFields(this.formFieldConfig[ele].fieldName);
          }
        }
      }
	// Reset the fields which is dependent on the passed element
      resetDependantFields(ele:string){
        const tobeCheckedFlds = this.filterFieldFromMandatoryFilters(ele);
        tobeCheckedFlds?.forEach((fieldName:string) => {
        this.detailFormControls.get(fieldName)?.reset(); 
      });
        
      }
	configureRequestData(data: any,ele: any,parentEle?: string,index?: number) {
        if (Array.isArray(ele)) {
          ele.map((ele: any) => {
      if (ele.uiType == 'autosuggest') {
              data[ele.name] = data[ele.name]?.[ele.parentField] || data[ele.name]?.['displayField'];       
            }
           if (ele.fieldType == 'Date' && data[ele.name]) {
              const formattedDate = new Date(data[ele.name]).getTime()
              if (ele.uiType == 'date') {
                const tempDate = new Date(data[ele.name]);
                const convertedDate = tempDate.getFullYear() + '-' + this.leftPad((tempDate.getMonth() + 1), 2) + '-' + this.leftPad(tempDate.getDate(), 2);
                data[ele.name] = convertedDate;
              }
              else {
                data[ele.name] = formattedDate;
              }
            }else if (ele.fieldType === 'Boolean') {
              if (
                data[ele.name] === null ||
                data[ele.name] === undefined ||
                data[ele.name] === ''
              ) {
                data[ele.name] = false;
              }
            }
                     
          });
        }
        return data;
      }
	openWorkflowSimilator() {
        const ref = this.dialogService.open(WorkflowSimulatorComponent, {
          header: 'Workflow Simulator',
          width: '350px',
          data: {
           statusFieldConfig: this.formFieldConfig[this.workFlowField],
            actorFieldConfig: Object.keys(this.securityJson).map((actor)=> {return{label:actor,value:actor}}),
            selectedValues: (this.data?.workflowInfo)? this.data?.workflowInfo[this.workflowType]:{userTypes:[],step:''}
          }
        });
        ref.onClose.subscribe((workflowInfo: any) => {
          if (workflowInfo) {
            this.reloadForm(workflowInfo);
          }
        });
      }
	deleteFiles(splittedData: any) {
       return of(splittedData);
  }
	initForm(){
       this.currentUserData= this.appGlobalService.getCurrentUserData();
        this.formFieldConfig= this.appUtilBaseService.getControlsFromFormConfig(this.detailFormConfig);
        this.actionBarConfig = this.appUtilBaseService.getActionsConfig(this.leftActionBarConfig.children);
        this.captionConfig = this.appUtilBaseService.getControlsFromFormConfig(this.detailCaptionBarConfig);
        this.appUtilBaseService.configureValidators(this.detailFormControls, this.formFieldConfig);
         this.wizardItems = this.appUtilBaseService.getWizardItemFromFormConfig(this.detailFormStructureConfig, this);
        this.getData();
    }
	getDisabled(formControl: any, ele: string) {
      const parent = ele.split('?.')[0];
      if (formControl.controls[parent] instanceof FormGroup){
        return formControl.get(ele)?.disabled
      }
      else
        return formControl.controls[parent].disabled;
    }
	initWorkflow() {
    if (this.workFlowInitialState && this.workFlowEnabled && this.workFlowField) {
      this.detailFormConfig?.children?.forEach((ele: any) => {
        if (ele?.field === this.workFlowField && ele?.multipleValues) {
          this.detailFormControls.get(this.workFlowField)?.patchValue([this.workFlowInitialState], { emitEvent: false });
          this.backupData[this.workFlowField] = [this.workFlowInitialState];
        }
        else {
          if (ele?.field === this.workFlowField && !ele?.multipleValues) {
            this.detailFormControls.get(this.workFlowField)?.patchValue(this.workFlowInitialState, { emitEvent: false });
            this.backupData[this.workFlowField] = this.workFlowInitialState;
          }
        }
      })
      this.activatedRoute.queryParams.subscribe((params: any) => {
        if (!environment.prototype && !params['id']) {
        const currentUserData= this.appGlobalService.getCurrentUserData();
          const state = this.workFlowInitialState ? this.workFlowInitialState.replace(/ /g, "_").toLowerCase() : '';
         this.appBaseService.getUserRoles().subscribe((response:any)=>{
            this.currentUserRolesMapping = response;
            const actors = this.getRoleShortName(currentUserData.userRoles) || [];
            const workflowInfo = { actors: actors, step: state }
             this.getWorkflowConfig(workflowInfo);
          })
        }
      });
    }
  }

 getRoleShortName(currentUserData:any){
    const tmData:any =[];
    currentUserData.map((o:string)=>{
      if(this.currentUserRolesMapping[o]){
        const d:string =  this.currentUserRolesMapping[o] || '';
        tmData.push(d);
      }
    })
    return tmData;
  }

  camelize(str: string) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
        index === 0
          ? letter.toLowerCase()
          : letter.toUpperCase()
      )
      .replace(/\s+/g, '');
  }
	restrictBasedonRoles(roles: any) {
        if (roles?.includes('selected')) {
           if(this.currentUserData){
            const userDataKeys = Object.keys(this.currentUserData);
            return roles?.some((item: any) => userDataKeys.includes(item.toLowerCase()));
          }
          else{
            return false;
          }
        }
        else if (roles?.includes('all'))
          return true;
        else
          return true;
      }
	disableSysGenFields(field: any){
        this.detailFormControls.get(field)?.disable({ emitEvent: false });
      }
	manipulateOutputData(res: any): void {
        
      }
	allocateActions(label: string, result: boolean, action: string) {
        if (action === 'view') {
          if (result && this.conditionalActions.hideActions.includes(label))
            this.conditionalActions.hideActions?.splice(this.conditionalActions.hideActions?.indexOf(label), 1)
          else if (!result && !this.conditionalActions.hideActions.includes(label))
            this.conditionalActions.hideActions.push(label);
        }
        else if (action === 'edit') {
          if (result && this.conditionalActions.disableActions.includes(label))
            this.conditionalActions.disableActions.splice(this.conditionalActions.disableActions?.indexOf(label), 1);
          else if (!result && !this.conditionalActions.disableActions.includes(label))
            this.conditionalActions.disableActions.push(label);
        }
      }
	formatFormDataBeforeSave() {
        let data = this.detailFormControls.getRawValue();
        for (const ele in this.formFieldConfig) {
          const ec = this.formFieldConfig[ele];
          if (ec.columns && !ec.multipleValues) {
            data[ec.name] = this.configureRequestData(data[ec.name], ec.columns, ec.name)
          }
          else if (ec.columns && ec.multipleValues && data[ec.name]) {
            data[ec.name]?.map((o: any,index:number) => {
              const tempData = this.configureRequestData(data[ec.name][index], ec.columns, ec.name,index);
              data[ec.name][index] = tempData;
            })
          }
        }
        data = this.configureRequestData(data,this.detailFormConfig.children);
        return data;
      }
	formValueChanges() {
        this.detailFormControls.valueChanges.pipe(
          debounceTime(600),
          distinctUntilChanged(),
        )
          .subscribe(() => {
            this.updateAllowedActions();
            this.readOnlyBasedonRoles();
            this.disableDependantFields();
            this.isFormValueChanged = true;
          })
      }
	bindLookupFields(): void {
        for (const ele in this.formFieldConfig) {
          if (this.formFieldConfig[ele].uiType === 'autosuggest') {
              this.detailFormControls.get(this.formFieldConfig[ele].fieldName)?.valueChanges.subscribe((obj) => {
                this.data[ele] = obj;
                if (this.formFieldConfig[ele].filterOutputMapping.length > 0) {
                this.mapOutputMappingFields(ele, obj, 'filterOutputMapping',this.formFieldConfig[ele].transient);
                }
               if(this.detailFormControls.dirty && this.isFormValueChanged)
                  this.resetDependantFields(ele);
              })
          }
        }
      }
    
      mapOutputMappingFields(ele: any, obj: any, mappingobjName: string, transient?: boolean) {
        const lookupArray: any = [];
        this.formFieldConfig[ele][mappingobjName].map((filter: any) => {
          if (this.formFieldConfig[ele].multipleValues && obj) {
            obj?.map((o: any) => {
              const filterValue = o.value ? o.value[filter.lookupField] : o[filter.lookupField];
              lookupArray.push(filterValue);
            })
            this.detailFormControls?.get(filter.tableField)?.enable();
            this.detailFormControls?.get(filter.tableField)?.patchValue(lookupArray.toString());
            this.detailFormControls?.get(filter.tableField)?.disable();
          }
          else {
            if (obj) {
             if (!transient && !this.detailFormControls.dirty && !this.isFormValueChanged) {
                
                this.detailFormControls?.get(filter.tableField)?.disable();
              }
              else{
               const dpField = filter.displayField || filter.lookupField;
                const filterValue = obj.value ? obj.value[dpField] : obj[dpField]; 
                this.detailFormControls?.get(filter.tableField)?.enable();
                this.detailFormControls?.get(filter.tableField)?.patchValue(filterValue);
                this.detailFormControls?.get(filter.tableField)?.disable();
              }
            }
            else {
              this.detailFormControls?.get(filter.tableField)?.reset();
            }
          }
          this.disableDependantFields();
        })
      }
    
      getListofServicesTobeFired(): Observable<any[]> {
        return new Observable(observer => {
          const config = { ...this.captionConfig, ...this.formFieldConfig };
          let autosuggestConfig:any ={}
          const data = this.data;
          const tempUrl: any = [];
          const observables: Observable<any>[] = [];
    
          for (const property in config) {
            if (config[property].uiType !== 'autosuggest' || !data[property]) continue;
            if(config[property].uiType == 'autosuggest' && !config[property].parentField){
              this.data[property] = {'displayField':this.data[property]};
              continue;
            }
              tempUrl.push({
                serviceName: config[property].autoSuggestServiceName,
                url: config[property].lookupUrl,
                field: config[property].name
              });
          }
          tempUrl.filter((obj: { id: any; }, index: any, self: any[]) =>
            index === self.findIndex((o: { id: any; }) => o.id === obj.id)
          );
    
          tempUrl?.map((o: any) => {
            const urlObj = {
              url: o.url,
              searchText: '',
              colConfig: config[o.field],
              value: data,
              pageNo: 0
            };
            autosuggestConfig[o.field] = config[o.field];
            urlObj.url = this.appUtilBaseService.generateDynamicQueryParams(urlObj);
    
            const observable = this.baseService.get(urlObj).pipe(
              catchError((error: any) => {
                console.error('An error occurred:', error);
                return of(null); // Return a placeholder value if there's an error
              })
            );
    
            observables.push(observable);
          });
    
       if (observables.length > 0) {
            const sub = forkJoin(observables).subscribe((responses: any[]) => {
              responses.forEach((res: any, index: number) => {
                const property = Object.keys(autosuggestConfig)[index];
                const con = autosuggestConfig[property];
                this.referenceData[con.autoSuggestServiceName] = res; // Just to save the data
                if (!res || res.length <= 0) return; // Skip processing if there was an error
                const tempDisplay: any[] = [];
                const filteredResponse = res[0] || {};
                con.displayFields?.forEach((obj: any) => tempDisplay.push(filteredResponse[obj.name]));
                this.displayDataDetails[property] = tempDisplay.join('_');
                filteredResponse['displayField'] = tempDisplay.join('_');
                this.data[property] = filteredResponse;
              });
              observer.next(responses); // Emit the responses
              observer.complete(); // Complete the observable
            });
            // sub.unsubscribe();
            this.subscriptions.push(sub);
          }else {
            observer.next([]); // Emit an empty array if there are no observables
            observer.complete(); // Complete the observable
          }
        });
      }
	getUserRoles(){
          this.appBaseService.getRoles().subscribe((res:any)=>this.roles = res ||{});
       }
	onBeforeGetData(){
    
      }
	disableInputFilters(ele: any, detailFormControls: any) {
        let hasUnfilledValues: boolean = false;
        this.formFieldConfig[ele].filterInputMapping?.map((filter: { lookupField: string, tableField: string }) => {
          const fieldName = filter.tableField.split('.')[0];
          if (this.formFieldConfig[ele].mandatoryFilters.includes(filter.lookupField) && ele != filter.tableField &&
            (detailFormControls[fieldName] === null || detailFormControls[fieldName] === undefined || detailFormControls[fieldName] === '')) {
            hasUnfilledValues = true;
          }
        })
        hasUnfilledValues ? this.detailFormControls.get(this.formFieldConfig[ele].fieldName)?.disable({ emitEvent: false }) :
          this.detailFormControls.get(this.formFieldConfig[ele].fieldName)?.enable({ emitEvent: false });
      }
	initializeCaptionBar() {
    for (const captionItem of this.detailCaptionBarConfig.children) {
      if (this.data && captionItem) {
        this.formattedCaptionData[captionItem.field] = this.formatCaptionItems(captionItem, this.data);
      }
    }
  }


  formatCaptionItems(config: any, data: any) {
    if (Object.keys(data).length > 0) {
      const controls = this.detailFormControls.getRawValue();
      let value = '';
      if (typeof data[config.field] === 'object' && Object.keys(data[config.field]).length > 0) {
        value = data[config.field]['displayField'] || data[config.field];
      } else {
        value = controls[config.field] ? controls[config.field] : data[config.field];
      }
      if (value && config.uiType !='autosuggest') {
        return this.appUtilBaseService.formatRawDatatoRedableFormat(config, value);
      }
      else{
        return value;
      }
    }
    return '';
  }
	checkFilters(params: any): boolean {
        const missingProperties: string[] = [];
    
        this.detailFormConfig.queryViewMandatoryFilters.forEach((filter: string) => {
          if (!params.hasOwnProperty(filter) || params[filter] === undefined || params[filter] === '') {
            missingProperties.push(filter);
          }
        });
    
        if (missingProperties.length === 0) {
          this.filtersEmptyMsg = 'All mandatory properties are present'
          return true;
        } else {
          let missingParams = missingProperties.join(', ').replace(/,(?=[^,]*$)/, ', and');
          this.filtersEmptyMsg = `Unable to display any records. The query is missing mandatory parameters: ${missingParams}. Please ensure these parameters are provided for the view to display records.`;
          return false
        }
      }
	workflowActionBarAction(btn: any) {
    if(!btn.wfAction) {
      if(btn.action)
        this.actionBarAction(btn);
      return;
    }
    const methodName: any = (`onwf` + btn.wfAction.charAt(0).toUpperCase() + btn.wfAction.slice(1));
    let action: Exclude<keyof ApplicationUserDetailBaseComponent, ' '> = methodName;
    const finalArr: string[] = [];
    this.formErrors = {};
    this.inValidFields = {};
    this.mandatoryFields = this.formSecurityConfig?.mandatoryfields?.hasOwnProperty(btn.wfAction) ? this.formSecurityConfig.mandatoryfields[btn.wfAction] : {}
    if (Object.keys(this.mandatoryFields).length > 0)
      this.addValidations(this.mandatoryFields);

    if (!this.appUtilBaseService.validateNestedForms(this.detailFormControls, this.formErrors, finalArr, this.inValidFields,this.formFieldConfig)) {
      if (finalArr.length) {
        this.showMessage({ severity: 'error', summary: 'Error', detail: this.appUtilBaseService.createNotificationList(finalArr), sticky: true });
        if (Object.keys(this.mandatoryFields).length > 0)
          this.clearValidations(this.mandatoryFields);
      }
    }
  else {
      if (typeof this[action] === "function") {
         const actionLabel = this.translateService.instant(btn.label);
        this.confirmationReference= this.dialogService.open(WorkflowConfirmationPopupComponent, {
          header: 'Confirmation',
          width: '30%',
          contentStyle: { "max-height": "500px", "overflow": "auto" },
          styleClass: "confirm-popup-container",
          data: {
            confirmationMsg: `Do you want to ${actionLabel} the record ?`,
            isRequired: this.formSecurityConfig.comments?.hasOwnProperty(btn.wfAction) && this.formSecurityConfig.comments[btn.wfAction],
            action:btn.label
          }
        });

        this.confirmationReference.onClose.subscribe((result: any) => {
          if (Object.keys(this.mandatoryFields).length > 0)
            this.clearValidations(this.mandatoryFields);
          if (result?.accepted) {
            this.comments = result.comments;
           if(!(this.appUtilBaseService.isEqualIgnoreCase(this.detailFormControls.getRawValue(), this.backupData, this.appUtilBaseService.getIgnorableFields(this.detailFormControls.getRawValue(), this.backupData, this.detailPageIgnoreFields), true))) {
              this.isSaveResponseReceived = false;
              const isToastNotNeeded = true;
              this.onSave(isToastNotNeeded);
              let checkResponse = setInterval(() => {
                if (this.isSaveResponseReceived) {
                  this[action]();
                  clearInterval(checkResponse);
                }
              }, 1000);
            }
            else {
              this[action]();
            }
          }
        });
      }
    }
  }
addValidations(mandatoryFields:[]){
    mandatoryFields.forEach((controlName:string)=>{
      if(this.detailFormControls.controls[controlName].hasValidator(Validators.required)){
        if(!(this.validatorsRetained.hasOwnProperty(controlName))){
          this.validatorsRetained[controlName]= {}
        }
        this.validatorsRetained[controlName]['requiredValidator'] = true;
      }
      else{
        this.detailFormControls.controls[controlName].addValidators([Validators.required]);
        this.detailFormControls.controls[controlName].updateValueAndValidity({emitEvent:false});
      }
     })
  }
	onCancel(){
  this.messageService.clear();
  if (this.appUtilBaseService.isEqualIgnoreCase(this.backupData, this.detailFormControls.getRawValue(), this.appUtilBaseService.getIgnorableFields(this.detailFormControls.getRawValue(),this.backupData,this.detailPageIgnoreFields), true)) {
    this.showMessage({ severity: 'info', summary: '', detail: this.translateService.instant('NO_CHANGES_AVAILABLE_TO_CANCEL') });
  } else {
    this.confirmationService.confirm({
      message: this.translateService.instant('DISCARD_UNSAVED_CHANGES'),
      header: 'Confirmation',
      accept: () => {
        const patchData = this.appUtilBaseService.deepClone(this.backupData)
        this.detailFormControls.patchValue(patchData,{ emitEvent: false });
      },
      reject: () => {
      },
    });
  }

}
	formatRawData() {
        this.denormalize(this.data);
            // since this.data cannot be directly used for patch value, doing a deep copy
            // Deep copy converts date into string, so copy is performed before formatting
        let patchData = JSON.parse(JSON.stringify(this.data));
        this.selectedItems = [];
        for (const e in this.formFieldConfig) {
          const ec = this.formFieldConfig[e];
          if (ec.columns && !ec.multipleValues && this.data[ec.name]) {
            for (const e1 in this.data[ec.name]) {
               const ec1 = ec[e1];
              if(this.data[ec.name]){
              this.data[ec.name][ec1.name] = this.bindData(this.data[ec.name][ec1.name], ec1,ec.name);
              patchData[ec.name][ec1.name] = this.bindData(patchData[ec.name][ec1.name], ec1,ec.name);
              }
            }
          }
          else if (ec.columns && ec.multipleValues && this.data[ec.name]) {
            this.data[ec.name]?.map((o: any, index: number) => {
              for (const e1 in o) {
                const ec1 = ec[e1];
                if (this.data[ec.name]) {
                  this.data[ec.name][index][ec1.name] = this.bindData(this.data[ec.name][index][ec1.name], ec1,ec.name,index);
                  patchData[ec.name][index][ec1.name] = this.bindData(patchData[ec.name][index][ec1.name], ec1,ec.name,index);
                }
              }
            })
          }
          
            else if (!ec.columns && this.data[ec.name]) {
              this.data[ec.name] = this.bindData(this.data[ec.name], ec);
              patchData[ec.name] = this.bindData(patchData[ec.name], ec);
            }
          
        }
    
        // const patchData = JSON.parse(JSON.stringify(this.data));
          this.detailFormControls.patchValue(patchData, { emitEvent: true});
          //this.bindLookupOnInit();
         this.backupData = this.appUtilBaseService.deepClone(this.detailFormControls.getRawValue());
         this.initializeCaptionBar();
     }
	tabviewValidation(array: any, tabIndexes: any = {} , type:string) {
        array.children.map((o: any, index: number) => {
          if (o.type === type) {
            tabIndexes[o.tabName] =o;
          }
          if (o.children)
            this.tabviewValidation(o, tabIndexes,type);
        })
        return tabIndexes;
      }
	getValue(formControl: FormGroup, ele: string) {
        const parent = ele.split('?.')[0];
        if (formControl.controls[parent] instanceof FormGroup){
          const child = ele.split('?.')[1];
          return formControl.controls[parent].value[child];
        }
        else
          return formControl.controls[parent].value;
      }
	onUrlClick(event: any) {
          window.open(event.value, '_blank');
      }
	readOnlyBasedonRoles() {
        let rulesObj: any = {
          enableAccess: false,
          disableAcces: false,
          conditionalAccess: false
        };
        ['create', 'update'].map((o: string) => {
          const accessActions = this.detailFormConfig?.actions?.[o] || {};
          for (const property in accessActions) {
            if ((this.currentUserData?.userRoles ||[]).includes(property)) {
              if (accessActions[property]?.access === 'yes') {
                rulesObj.enableAccess = true;
              }
              else if (accessActions[property]?.access === 'no') {
                rulesObj.disableAccess = true;
              }
              else {
                const conditions = accessActions[property].conditions;
                const conResult = this.appUtilBaseService.evaluvateCondition(conditions?.rules, conditions?.condition, { ...this.data, ...this.detailFormControls.getRawValue() }, this.formFieldConfig);
                rulesObj.conditionalAccess = (conResult || rulesObj.conditionalAccess) ? true : false;
              }
            }
            else {
              rulesObj.disableAccess = true;
            }
          }
        });
    
        if ((!rulesObj.enableAccess && !rulesObj.conditionalAccess && rulesObj.disableAccess && !environment.prototype)) {
           this.tableaccess = false;
        }
        else {
          this.tableaccess = true;
        }
      }
	getData(){
  if (environment.prototype && this.id) {
    const params = {
      sid: this.id
    };
    this.applicationUserService.getProtoTypingDataById(params).subscribe((res: any) => {
      res = JSON.parse(JSON.stringify(res))
    for (let key in res) {
        if (this.formFieldConfig[key]?.fieldType =="Date") {
            res[key] = new Date(res[key]);
        }
      }
      this.data = res;
      this.backupData = res;
      this.detailFormControls.patchValue(this.backupData);
    });
    this.initializeCaptionBar();
  } else if (this.id) {
    const params = {
      sid: this.id
    };
        const dataSubscription = this.applicationUserService.getById(params).subscribe((res: ApplicationUserBase[]) => {
          this.data = res || {};
          this.getListofServicesTobeFired().subscribe((responses: any[]) => {
              this.formatRawData();
            });
        });
    this.subscriptions.push(dataSubscription);
  }
  else {
    this.setDefaultValues();
    this.backupData = this.appUtilBaseService.deepClone(this.detailFormControls.getRawValue());
  }
}
	onBack(){
	this.messageService.clear();
	if (this.appUtilBaseService.isEqualIgnoreCase(this.backupData, this.detailFormControls.getRawValue(), this.appUtilBaseService.getIgnorableFields(this.detailFormControls.getRawValue(),this.backupData,this.detailPageIgnoreFields), true)){			
     this.location.back();
	}else{
		this.confirmationService.confirm({
		    message:this.translateService.instant('DISCARD_UNSAVED_CHANGES'),
			header:'Confirmation',
			icon:'pipi-info-circle',
			accept:()=>{
              this.backupData = this.appUtilBaseService.deepClone(this.detailFormControls.getRawValue());				
              this.location.back();
			},
			reject:()=>{
			},
		});
	}
}
	generateRequestObj(data: any) {
        const props = Object.keys(data);
        let requestedObj: any = {};
        props.forEach((o: any) => {
          if (this.detailFormControls.controls[o] instanceof FormGroup && !this.formFieldConfig[o].multiple) {
            data[o] = this.configureEmptyValuestoNull(data[o])
          }
          else if (this.detailFormControls.controls[o] instanceof FormGroup && this.formFieldConfig[o].multiple) {
            data[o].map((k: any, index: number) => { data[o][index] = this.configureEmptyValuestoNull(data[o][index]) })
          }
        })
        requestedObj = this.configureEmptyValuestoNull(data);
        return requestedObj;
      }
	setDefaultValues() {
        for (const ele in this.formFieldConfig) {
          if (['Boolean'].includes(this.formFieldConfig[ele].fieldType)) {
            const defaultBooleanValues = this.formFieldConfig[ele].defaultVal ? this.formFieldConfig[ele].defaultVal : false;
            this.detailFormControls.controls[ele].patchValue(defaultBooleanValues, { emitEvent: true });
            this.backupData[ele] = defaultBooleanValues;
          } else if (this.formFieldConfig[ele].defaultVal && (this.formFieldConfig[ele].uiType === 'datetime' || this.formFieldConfig[ele].uiType === 'date')) {
            let defaultValue = (this.formFieldConfig[ele].defaultVal);
            if (typeof defaultValue == 'string') {
              if (defaultValue?.toLowerCase() == 'today') {
        //defaultValue = new Date(Date.now() + (new Date().getTimezoneOffset() * 60000)).getTime();
                   defaultValue = new Date(Date.now()).getTime();          
    } else if (defaultValue?.toLowerCase() == 'tomorrow') {
                defaultValue = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1).getTime()
              } else if (defaultValue?.toLowerCase() == 'start_of_month') {
                defaultValue = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime()
              } else if (defaultValue?.toLowerCase() == 'end_of_month') {
                defaultValue = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getTime()
              }
            }
            const formattedDate = new Date(defaultValue)
            this.detailFormControls.controls[ele].patchValue(formattedDate, { emitEvent: true });
            this.backupData[ele] = formattedDate;
          } else if (this.formFieldConfig[ele].defaultVal && (this.formFieldConfig[ele].uiType === 'select' || this.formFieldConfig[ele].uiType === 'checkboxgroup' || this.formFieldConfig[ele].uiType === 'radio')) {
            let defaultValue: any = (this.formFieldConfig[ele].defaultVal);
            let defaultLabel: any;
            if (typeof defaultValue == 'string') {
              defaultLabel = (defaultValue?.trim()?.replace(/ /g, "_"))?.toUpperCase()
            } else if (Array.isArray(defaultValue)) {
              defaultValue?.forEach((obj: any, index: any, a: any) => {
                a[index] = (obj?.trim()?.replace(/ /g, "_"))?.toUpperCase();
              })
              defaultLabel = defaultValue
            } else {
              defaultLabel = defaultValue
            }
            if (this.formFieldConfig[ele].multiple || this.formFieldConfig[ele].uiType === 'checkboxgroup' || Array.isArray(defaultValue)) {
              this.detailFormControls.controls[ele].patchValue(defaultLabel, { emitEvent: true });
              this.backupData[ele] = Object.assign([], defaultLabel);
            } else {
              this.detailFormControls.controls[ele]?.patchValue(defaultLabel, { emitEvent: true });
              this.backupData[ele] = defaultLabel;
            }
          }       else if(Array.isArray(this.formFieldConfig[ele].defaultVal) && (this.formFieldConfig[ele].uiType =='number' || this.formFieldConfig[ele].uiType =='currency')){
            let tempArr: any = [];
            (this.formFieldConfig[ele].defaultVal || [])?.map((o: any) => {
              tempArr.push({
                display:o,
                value:o
              });
            })
          }
    else if (this.formFieldConfig[ele].defaultVal) {
            const defaultValue = (this.formFieldConfig[ele].defaultVal);
            this.detailFormControls.controls[ele].patchValue(defaultValue, { emitEvent: true });
            this.backupData[ele] = defaultValue;
          }
        }
      }
	normalize(data:any){
        return data;
      }
	configureFormOnWorkflow(workflowDataForNewRec?:any) {
    const actions: any = this.workflowActionBarConfig?.children;
    let workflowInformation:any = {}
 if (this.id) {
workflowInformation.actors = this.data?.workflowInfo && this.data?.workflowInfo[this.workflowType]?.userTypes || [],
workflowInformation.step = this.data?.workflowInfo && this.data?.workflowInfo[this.workflowType]?.step || ''
}
else {
workflowInformation.actors = workflowDataForNewRec.actors || [];
workflowInformation.step = workflowDataForNewRec.step || '';
}
    this.formSecurityConfig = this.appUtilBaseService.getFormSecurityConfigFromSecurityJSON(this.securityJson, this.detailFormControls, actions, workflowInformation);
    console.log(this.formSecurityConfig)
    this.hiddenFields = this.formSecurityConfig.hidefields;

    for (const control in this.detailFormControls.getRawValue()) {
      if (this.formSecurityConfig.disableonlyfields.indexOf(control) > -1)
      // && !(this.formSecurityConfig.enableonlyfields.indexOf(control) > -1)) 
      {
        this.detailFormControls.controls[control].disable({ emitEvent: false });
      }
      if (this.formSecurityConfig.enableonlyfields.indexOf(control) > -1) {
        this.detailFormControls.controls[control].enable({ emitEvent: false });
      }
      if (this.formSecurityConfig.hidefields.indexOf(control) > -1 )
      // && !(this.formSecurityConfig.showfields.indexOf(control) > -1)) 
      {
        this.hiddenFields[control] = true;
      }
      if (this.formSecurityConfig.showfields.indexOf(control) > -1) {
        this.hiddenFields[control] = false;
      }
    }
    this.workflowActions = {
      disableActions: [...this.formSecurityConfig.disableonlyactions],
      enableActions: [...this.formSecurityConfig.enableonlyactions],
      hideActions: [...this.formSecurityConfig.hideactions],
      showActions: [...this.formSecurityConfig.showactions]
    }
  }
	getId(){
          this.activatedRoute.queryParams.subscribe((params: any) => { 
            this.id = params['id'];
            this.pid = params['pid'];
            this.queryParams = params;
          }); 
        }
	getButtonConfig(btn:any){
        return {
          action:btn.action,
          confirmationTitle:btn.confirmationTitle|| 'Confirmation',
          confirmationText:btn.confirmationText || 'Do you want to perform the action?',
          fields: btn.fields || {"children":[]},
             confirmButton:btn.confirmationButtonText,
          rejectButton:btn.cancelButtonText,
          values:this.detailFormControls.getRawValue()
        }
      }
	getInputParams() {
        return {}
      }
	enableChildOptions(){
	}
	tabValidation(array: any, tabIndexes: any = [] , type:string) {
        let modal:any ={
          tabName :'',
          tabIndex:[]
        }
        let key = Object.keys(array);
        key.map((tabkey:string)=>{
          modal['tabName'] = tabkey;
          array[tabkey].children.map((o: any, index: number) => {
            if (o.type === 'tab') {
             modal.tabIndex.push(o.tabName);
            }
            else{
            if (o.children)
              this.tabValidation(o, tabIndexes,type);
            }
          })
          tabIndexes.push({...modal});
          modal.tabIndex = [];
        })
         return tabIndexes;
       }
	checkColumnProperty(fieldName: string, table: string) {
        const columnConfig = this.formFieldConfig[table]?.columns?.find((item: any) => item.name == fieldName);
        return ((columnConfig.hidden) ? false : true);
      }
	updateAllowedActions() {
        for (const ele in this.formFieldConfig) {
          if (this.detailFormControls.controls[ele] instanceof FormGroup) {
            for (const childEle in this.formFieldConfig[ele])
              this.updateFields(this.formFieldConfig, ele, childEle);
          }
          else {
            if (this.formFieldConfig[ele].mapping) {
              const foreignkeyReference = this.appUtilBaseService.getControlsFromFormConfig(this.formFieldConfig[ele]);
              this.formFieldConfig[ele].mapping.map((fk: any) => {
                this.updateFields(foreignkeyReference, fk.fieldName, '',ele);
              })
            }
            else {
              this.updateFields(this.formFieldConfig, ele, '');
            }
          }
        }
    
        this.actionBarConfig?.forEach((action:any)=>{
          this.updateActions(action);
        })
      }
	onSave(isToastNotNeeded?: boolean, actionName?: string) {
    if (this.appUtilBaseService.isEqualIgnoreCase(this.detailFormControls.getRawValue(), this.backupData, this.appUtilBaseService.getIgnorableFields(this.detailFormControls.getRawValue(), this.backupData, this.detailPageIgnoreFields), true) && this.detailFormControls.status == 'VALID') {
      this.showMessage({ severity: 'info', summary: '', detail: this.translateService.instant('NO_CHANGES_AVAILABLE_TO_SAVE') });
      return;
    }
    if (this.checkValidations()) {
      const complexData = this.checkUnsavedComplexFields();
      if (complexData.hasUnSavedChanges) {

        complexData.fields.map((o: any) => $($('.' + o + '_editSave-btn')).trigger('click'));
      }
      let preFormattedData = this.formatFormDataBeforeSave();
      let data = this.normalize(preFormattedData)
      const method = this.id ? 'update' : 'create';
      data = { ...this.data, ...data };
      if (this.pid) {
        data.pid = this.pid;
      }
      if (this.id) {
        data.sid = this.id
      }

      const requestedObj = this.generateRequestObj(data);
      this.messageService.clear();
      const attachmentTypes = ['imageCarousel', 'attachments'];
      const attachmentFields = this.detailFormConfig?.children
        .filter((ele: any) => attachmentTypes.includes(ele.uiType))
        .map((item: any) => item.fieldName);
      const splittedData = this.appUtilBaseService.splitFileAndData(data, attachmentFields);

      if (Object.keys(splittedData.files).length > 0) {

        const saveSubscription = this.uploadAttachmentsandSaveData(requestedObj, splittedData, actionName).subscribe(res => {
          this.onAfterSave(res, data, method, isToastNotNeeded);
        }, err => { this.isSaveResponseReceived = true })
        this.subscriptions.push(saveSubscription);
      }
      else {
        const saveSubscription = this.applicationUserService[method](requestedObj, actionName).subscribe((res: ApplicationUserBase) => {
          this.onAfterSave(res, data, method, isToastNotNeeded);
        })
        this.subscriptions.push(saveSubscription);
      }
    }
  }
   
       onAfterSave(res: any, data: any, method: string, isToastNotNeeded?: boolean) {
   if(AppConstants.isSql){
      for(const property in this.data){
        if(this.formFieldConfig[property]?.uiType !='autosuggest'){
          this.data[property] = res[property];
        }
      } 
    }
    else{
      this.data = { ...data, ...res };
    }
    this.isFormValueChanged = false;
    this.detailFormControls.markAsPristine();
    this.formatRawData();
    this.isSaveResponseReceived = true;
    this.id = res.sid;
    this.tabErrorCount(true);
    if (method === 'create') {
      this.router.navigate(
        [],
        {
          queryParams: { id: this.id },
          relativeTo: this.activatedRoute,
          queryParamsHandling: 'merge',
          replaceUrl: true
        }).then(() => { this.onInit() });
        this.enableChildOptions();
    }
    if (!isToastNotNeeded) {
      this.showMessage({ severity: 'success', summary: '', detail: this.translateService.instant('RECORD_SAVED_SUCCESSFULLY') });
    }
  }

uploadAttachmentsandSaveData(data: any, splittedData: any,actionName?:string): Observable<any> {
    const subject$ = new Subject();

    const completeReq = (resData: any,) => {
      resData ? subject$.next(resData) : subject$.error(resData);
      subject$.complete();
    }
    if (!this.id) {
       const saveSubscription =  this.applicationUserService.create(splittedData.data,actionName).subscribe(
        createdData => {
          const data = { ...splittedData.data, ...createdData };
          splittedData.data = data;
          this.id = data.sid;
          if (splittedData.files) {
            this.updateData(splittedData).subscribe(
              updatedData => completeReq(updatedData),
              err => completeReq(null)
            );
          }
        },
        err => completeReq(null))
        this.subscriptions.push(saveSubscription);
    } else {
      const saveSubscription =  this.updateData(splittedData,actionName).subscribe(
        updatedOrg => completeReq(updatedOrg),
        err => completeReq(null)
      );
      this.subscriptions.push(saveSubscription);
    }

    return subject$.asObservable()
  }
  
  updateData(splittedData: any,actionName?:string) {
    const subject$ = new Subject();    
      const updateSubscription = this.deleteFiles(splittedData).subscribe((responseData: any) => {
        this.saveFiles(responseData).subscribe((dataToUpdate: any) => {
          dataToUpdate.data.sid = this.id;
          this.applicationUserService.update(dataToUpdate.data,actionName).subscribe(
            res => {
              subject$.next(res);
              subject$.complete();
            },
            err => {
              subject$.error(null);
              subject$.complete();
            }
          )
        })
      });
    this.subscriptions.push(updateSubscription);
    return subject$.asObservable()
  }

saveFiles(splittedData: any) {
    const files: any = {};
    const existingfiles: any = {}
    Object.keys(splittedData.files).forEach(key => {
      splittedData.files[key].map((o: any) => {
        if (!o.id) {
          if (!files.hasOwnProperty(key)) {
            files[key] = [];
          }
          files[key].push(o);
        }
        else {
          if (!existingfiles.hasOwnProperty(key)) {
            existingfiles[key] = [];
          }
          existingfiles[key].push(o);
        }
      })
    })
    if (files && Object.values(files).filter((item: any) => (item || [])?.length).length) {
      return new Observable(observer => {
        this.uploaderService.saveAddedFiles(files, this.id, this.detailFormControls).subscribe((res: any) => {
          res.dataToResend = this.mergeExistingFiles(res.dataToResend, existingfiles);
          let fData: any = this.getFiles(res.dataToResend);
          const finalData = { data: { ...splittedData.data, ...fData } };
          if (res.error) {
            let errResponse = res.error;
            const errorArr: any = [];
            Object.keys(res.error).forEach((key) => {
              if (errResponse && errResponse[key]?.error?.MESSAGE) {
                errorArr.push(errResponse[key]?.error?.MESSAGE);
              } else {
                errorArr.push("Failed to upload " + key);
              }
            })
            if (errorArr.length > 0)
              this.showMessage({ severity: 'error', summary: 'Error', detail: this.appUtilBaseService.createNotificationList(errorArr) });
          }
          observer.next(finalData);
          observer.complete();
        }, (err: any) => {
          observer.error(err);
        });
      });
    }
    if (existingfiles && Object.values(existingfiles).filter((item: any) => (item || [])?.length).length) {
      let fData: any = this.getFiles(existingfiles);
      splittedData.data = { ...splittedData.data, ...fData };
      return of(splittedData);
    }
    else {
      return of(splittedData)
    }
  }


  getFiles(responseData:any){
    let fData:any = {}
    for (const key in responseData) {
      if (responseData[key] instanceof Array) {
        const tempArr = responseData[key].flat();
        fData[key] = (tempArr.filter((n: any, i: any) => tempArr.indexOf(n) === i)).filter(Boolean);
      } else {
        fData[key] = [responseData[key]];
      }
      fData[key]= this.appUtilBaseService.removeImagePreviewProperties(fData[key]);
    }
    return fData;
  }


  mergeExistingFiles(newobj: any, oldobj: any) {
    let data: any = {};
    [oldobj, newobj].map((obj: any) => {
      for (let prop in obj) {
        if (!data.hasOwnProperty(prop)) {
          data[prop] = [];
        }
        data[prop].push(...obj[prop].flat(4));
      }
    })
    return data;
  }
	onWizardClick(event: any) {
        this.wizardItems.forEach((item: any) => {
          delete item.styleClass;
        });
        event.item.styleClass = 'wizard-active';
        let el: any = $("#section" + event.item.id);
        if (el?.length) {
    
          $('.main-content').animate({
            scrollTop: el.offset().top
          }, 100);
        }
      }
	mapIndexedFields() {
        for (const ele in this.formFieldConfig) {
          const config = this.formFieldConfig[ele];
          if (config.uiType == 'autosuggest' && config.filterOutputMapping.length > 0) {
            config.filterOutputMapping.map((fieldsMap: any) => {
              if (fieldsMap.displayField) {
                this.outputMappingFieldsConfig[fieldsMap.tableField] = {
                  ['serviveName']: config.autoSuggestServiceName,
                  ['referenceField']: fieldsMap.lookupField
                }
              }
            })
          }
        }
      }
	addRequiredValidator(ele: any, fieldName: string, foreignkeyReference?: any,foreignKey?:string) {
        const fieldConfig = foreignkeyReference ? foreignkeyReference :this.formFieldConfig;
        const field = foreignKey ? foreignKey: fieldName;
        const conResult = this.appUtilBaseService.evaluvateCondition(ele.query?.rules, ele.query?.condition, this.detailFormControls.getRawValue(), fieldConfig);
        if (conResult ) {
          this.detailFormControls.controls[fieldName].addValidators([Validators.required]);
        }
        else {
          this.detailFormControls.controls[fieldName].removeValidators([Validators.required]);
        }
        this.detailFormControls.controls[fieldName].updateValueAndValidity({ emitEvent: false });
        this.formFieldConfig[field].isRequired =(conResult)? true:false;
    
      }
	onMultiDataFractionCheck(item:any,config:any){
        if (config?.uiType?.toLowerCase() == 'number' && config?.isDouble) {
          const dec = item.value.split('.')[1]
          const len = (dec && (dec.length > config.minFractionDigits) && (dec.length < config.maxFractionDigits)) ? dec.length :
            (dec && dec.length > config.maxFractionDigits) ? config.maxFractionDigits : config.minFractionDigits;
          let value = Number(item.value).toFixed(len);
          item.value = value;
          item.display = value;
    
        }
      }
	getTabIndex(tabName:string){
        return 0;
      }
	scrolltoTop() {
        const tracker = (<HTMLInputElement>document.getElementsByClassName('main-content')[0])
        let windowYOffsetObservable = fromEvent(tracker, 'scroll').pipe(map(() => {
          return Math.round(tracker.scrollTop);
        }));
        const headerHeight: any = $('#header-container').outerHeight(true);
        const titleBarheight: any = $('#title-bar').outerHeight(true);
    
        windowYOffsetObservable.subscribe((scrollPos: number) => {
          if (scrollPos >= titleBarheight) {
            $('.wizard-container .p-tieredmenu').animate({
              top: headerHeight, marginTop: '10px'
            }, 0);
          }
          else {
            $('.wizard-container .p-tieredmenu').animate({
              top: headerHeight + titleBarheight
            }, 0);
          }
        })
      }
	// filter the fields which are using the passed element as mandatory field
      filterFieldFromMandatoryFilters(element:string) {
        const matchingFieldNames = [];
        for (const fieldKey in this.formFieldConfig) {
            if (Object.prototype.hasOwnProperty.call(this.formFieldConfig, fieldKey)) {
                const field = this.formFieldConfig[fieldKey];
                if (field && field.mandatoryFilters && field.mandatoryFilters.includes(element)) {
                    matchingFieldNames.push(field.fieldName);
                }
            }
        }
        return matchingFieldNames.length ? matchingFieldNames : null; // Return null if no matching field names found
    }
	updateActions(actionConfig:any){
        if(actionConfig.visibility === 'conditional' && actionConfig.conditionForButtonVisiblity){
          this.restrictEditandView(actionConfig.conditionForButtonVisiblity,'view',actionConfig.action,true,'','',actionConfig.buttonId);
        }
        if(actionConfig.buttonEnabled === 'conditional' && actionConfig.conditionForButtonEnable){
          this.restrictEditandView(actionConfig.conditionForButtonEnable,'edit',actionConfig.action,true,'','',actionConfig.buttonId);
        }
      }
	tabErrorCount(aftersave:boolean){ 
        const tabViews = this.tabviewValidation(this.detailFormStructureConfig ,[], 'tabView');
        const tabviewStructue = this.tabValidation(tabViews, [],'tab');
        tabviewStructue.forEach((parentele:any) => {
              parentele.tabIndex.map((ele:any,index:number)=>{
              const tabID =  ele+"_id"
              const tabLabelID =  ele+"_label_id"
               let er = (<HTMLInputElement>document.getElementById(tabID))?.querySelectorAll(".error")||[];
              if(er.length>0 && this.activeTabIndexes[parentele.tabName] !=index && !aftersave){
                  document.getElementById(tabLabelID)?.classList.add("taberror");
                  this.errorfields[ele] = true;
              }
              else{
                document.getElementById('tabIDS')?.classList.remove("taberror")
                this.errorfields[ele] = false;
              } 
            })
          });
      }
	reloadForm(workflowInfo: any) {
        this.data.workflowInfo ={
              [this.workflowType]:workflowInfo
            };
      
    const wfData ={
    actors:workflowInfo.userTypes,
    step:workflowInfo.step
    }
           const methodName: any = "configureFormOnWorkflow";
            let action: Exclude<keyof ApplicationUserDetailBaseComponent, ' '> = methodName;
            if (typeof this[action] === "function") {
              this[action](wfData);
              this.updateAllowedActions();
              this.formValueChanges();
            }
      }
	leftPad(num:number, length:number) {
        var result = '' + num;
        while (result.length < length) {
          result = '0' + result;
        }
        return result;
      }
	addValidatorsForMultiValues() {
        for (const property in this.formFieldConfig) {
          if (this.formFieldConfig[property].multipleValues && (this.formFieldConfig[property].uiType == 'number')) {
            if(this.formFieldConfig[property].isDouble){
              this.validators[property] = [this.customValidatorService.ValidateDouble,this.customValidatorService.minValueValidator(this.formFieldConfig[property]),this.customValidatorService.maxValueValidator(this.formFieldConfig[property]),this.customValidatorService.validatePattern(this.formFieldConfig[property])];
            }
            else{
              this.validators[property] = [this.customValidatorService.validateNumber, this.customValidatorService.minValueValidator(this.formFieldConfig[property]), this.customValidatorService.maxValueValidator(this.formFieldConfig[property]),this.customValidatorService.validatePattern(this.formFieldConfig[property])]
            }
          }
          else if (this.formFieldConfig[property].multipleValues && this.formFieldConfig[property].uiType == 'string') {
            this.validators[property] = [this.customValidatorService.minLengthValidator(this.formFieldConfig[property]), this.customValidatorService.maxLengthValidator(this.formFieldConfig[property])]
          }
          else if (this.formFieldConfig[property].multipleValues && this.formFieldConfig[property].uiType == 'currency') {
            this.validators[property] = [this.customValidatorService.ValidateDouble, this.customValidatorService.minValueValidator(this.formFieldConfig[property]), this.customValidatorService.maxValueValidator(this.formFieldConfig[property])]
          }
        }
    this.errorMessages = {
          'minValue': this.translateService.instant('MIN_VALUE'),
          'maxValue': this.translateService.instant('MAX_VALUE'),
          'minLength': this.translateService.instant('MIN_LENGTH'),
          'maxLength': this.translateService.instant('MAX_LENGTH'),
          'invalid': this.translateService.instant('INVALID'),
          'pattern': this.translateService.instant('PATTERN'),
        }
      }
	checkValidations(): boolean {
        const finalArr: string[] = [];
        this.formErrors = {};
        this.inValidFields = {};
        if (!this.appUtilBaseService.validateNestedForms(this.detailFormControls, this.formErrors, finalArr, this.inValidFields,this.formFieldConfig)) {
          if (finalArr.length) {
            this.showMessage({ severity: 'error', summary: 'Error', detail: this.appUtilBaseService.createNotificationList(finalArr), sticky: true });
          }
          return false;
        }
        if(this.detailFormConfig.children) {
          let multComp = this.detailFormConfig.children.filter((ele: any) => ele.multipleValues && ele.columns);
          if(multComp.length) {
            let mulFormErrors: string[] = [];
            multComp.forEach((config: any) => {
              let colnames = config.columns.filter((col: any) => col.name !== 'jid').map((col: any) => col.name);
              let values = this.detailFormControls.value[config.field];
              values = values.filter((row: any) => {
                return Object.keys(row) && Object.keys(row).find(key => colnames.includes(key));
              });
              this.detailFormControls.get(config.field)?.patchValue(values);
              mulFormErrors = [...mulFormErrors, ...this.appUtilBaseService.validateMultipleComp(this.detailFormControls.value, config)];          
            });
            if(mulFormErrors.length) {
              this.showMessage({ severity: 'error', summary: 'Error', detail: this.appUtilBaseService.createNotificationList(mulFormErrors), sticky: true });
              return false;
            }
          }
        }
        return true;
      }
	updateFields(formFieldConfig: any, ele: string, childEle: string, foreignKey?:string) {
        const fieldConfig = (childEle) ? formFieldConfig[ele][childEle] : formFieldConfig[ele];
        if (fieldConfig?.allowViewing === 'no') {
          if (childEle) {
            if (!this.hiddenFields[formFieldConfig[ele].name])
              this.hiddenFields[formFieldConfig[ele].name] = {};
            this.hiddenFields[formFieldConfig[ele].name][fieldConfig.name] = true;
          }
          else
            this.hiddenFields[formFieldConfig[ele].name] = true;
        }
        else if (fieldConfig?.viewConditionally && fieldConfig?.allowViewing === 'conditional') {
          this.restrictEditandView(fieldConfig.viewConditionally, 'view', fieldConfig.name,false,foreignKey,fieldConfig)
        }
        if (fieldConfig?.allowEditing === 'no'|| (fieldConfig?.isPrimaryKey && this.id)) {
          if (childEle)
            this.detailFormControls.get(`${[formFieldConfig[ele].name]}.${fieldConfig.name}`)?.disable({ emitEvent: false });
          else{
            this.detailFormControls.get(fieldConfig.name)?.disable({ emitEvent: false });
            if(foreignKey)
            this.detailFormControls.get(foreignKey)?.disable({ emitEvent: false });
          }
        }
        else if (formFieldConfig[ele]?.editConditionally && formFieldConfig[ele]?.allowEditing === 'conditional') {
          this.restrictEditandView(fieldConfig.editConditionally, 'edit', fieldConfig.name,false,foreignKey,fieldConfig);
        }
        if (formFieldConfig[ele]?.mandatory === 'conditional' && formFieldConfig[ele]?.conditionalMandatory) {
          this.addRequiredValidator(fieldConfig.conditionalMandatory, fieldConfig.name, fieldConfig,foreignKey);
          if (foreignKey) {
            let hasMandatory: boolean = false;
            this.formFieldConfig[foreignKey]?.childFields?.forEach((o: any) => {
              if (this.detailFormControls.controls[o].hasValidator(Validators.required)) {
                hasMandatory = true;
              }
            })
            if (hasMandatory) {
              this.detailFormControls.controls[foreignKey].addValidators([Validators.required]);
            }
            else if (this.detailFormControls.controls[foreignKey].hasValidator(Validators.required)) {
              this.detailFormControls.controls[foreignKey].removeValidators([Validators.required]);
            }
          }
        }
      }
	clearValidations(mandatoryFields: []) {
    mandatoryFields.forEach((controlName: string) => {
      if (!(this.validatorsRetained[controlName] && this.validatorsRetained[controlName]['requiredValidator'])) {
        this.detailFormControls.controls[controlName].removeValidators(Validators.required);
        this.detailFormControls.controls[controlName].updateValueAndValidity({emitEvent:false});
      }

    })
  }
	checkUnsavedComplexFields():any {
        const newRows:any = []
        let hasUnSavedChanges:boolean = false;
        const data = this.detailFormControls.getRawValue();
        const fields:any =[];
        const complexTable = (Object.keys(this.formFieldConfig)).filter(key=> this.formFieldConfig[key].columns && this.formFieldConfig[key].multipleValues)
           if(complexTable.length> 0){ 
             complexTable.map((field)=>{
              data[field]?.map((e: any) => {
                if(e.isNewRow || this.fieldEditMode[field]){
                  hasUnSavedChanges = true;
                  fields.push(field);
                }
                  newRows.push(e);
              })
             })
           }
           return {
            newRows:newRows,
            fields:[...new Set(fields)],
            hasUnSavedChanges:hasUnSavedChanges
          }
        }
	canDeactivate(): Observable<boolean> | boolean {
    if(this.appUtilBaseService.isEqualIgnoreCase(this.detailFormControls.getRawValue(), this.backupData,this.appUtilBaseService.getIgnorableFields(this.detailFormControls.getRawValue(),this.backupData,this.detailPageIgnoreFields),true)){
           return true;
         }
        else{
          return Observable.create((observer: Observer<boolean>) => {
            this.confirmationService.confirm({
              message: this.translateService.instant('DISCARD_UNSAVED_CHANGES'),
              header: 'Confirmation',
              icon: 'pi pi-info-circle',
              accept: () => {
                observer.next(true);
                observer.complete();
              },
              reject: () => {
                observer.complete();
              },
            });
          });
        }
      }
	restrictEditandView(ele: any, action: string, fieldName: string, fromActionBar?: boolean,foreignKey?:string,foreignkeyReference?:any,buttonId?:any) {
        const config = foreignkeyReference?foreignkeyReference :this.formFieldConfig;
        const conResult = this.appUtilBaseService.evaluvateCondition(ele?.query?.rules, ele?.query?.condition, { ...this.data, ...this.detailFormControls.getRawValue() }, config);
        if (fromActionBar) {
          this.allocateActions(buttonId, conResult, action)
        } else {
          if (action == 'view') {
            this.hiddenFields[fieldName] = conResult ? false : true;
          }
          else if (action == 'edit') {
            conResult ? this.detailFormControls.get(fieldName)?.enable({ emitEvent: false }) :
              this.detailFormControls.get(fieldName)?.disable({ emitEvent: false });
            if (foreignKey) {
              let allKeysenabled: boolean = true;
              this.formFieldConfig[foreignKey]?.childFields?.forEach((o: any) => {
                if (this.detailFormControls.get(o)?.disabled) {
                  allKeysenabled = false;
                }
              })
              conResult && allKeysenabled ? this.detailFormControls.get(foreignKey)?.enable({ emitEvent: false }) :
                this.detailFormControls.get(foreignKey)?.disable({ emitEvent: false });
            }
            
          }
        }
      }
	calculateFormula(){
	
}
	getDateTimeFields() {
    return ['createdDate','modifiedDate','syncTime'];
  }

  getDateFields() {
    return [];
  }
  
  
  getTranslatableFields() {
    return [];
  }
  
  
  getEmailFields(){
  	return ['email'];
  }
  

  /**
  * Ignore fields from displaying in the changelog details
  */
  getIgnoreFields() {
    return ['sid', 'pid'];
  }
  
  
 onChangelog() {
    const initialState: ModalOptions = {
      initialState: {
        class: 'modal-xl',
        changelogConfig: {
          dateFields: this.getDateFields(),
          dateTimeFields: this.getDateTimeFields(),
          ignoreFields: this.getIgnoreFields(),
          translatableFields:this.getTranslatableFields(),
          emailFields:this.getEmailFields(),
           config :this.formFieldConfig,
          filters: [{
            label: 'BASIC_DETAIL'
          }],
          entityId : this.data.sid,
          entityName : 'ApplicationUser',
          fieldName : null,
          fromModifiedDate : new Date().getTime(),
          useModifiedDate: true,
          translations: {}
        },
        keyboard: true
        
      }
    };
    this.bsModalRef = this.bsModalService.show(ChangeLogsComponent, Object.assign(initialState, { class: 'modal-xl modal-changelog' }));
    this.bsModalRef.content.closeBtnName = 'Close';
  }
	getStatusFromJson(json:any) {
        const labelsSet = new Set();
        for (const roleKey in json.config) {
          const role = json.config[roleKey];
          Object.keys(role).forEach(status => labelsSet.add(status));
        }
        
        // Create status objects from unique labels
        const statuses = Array.from(labelsSet).map(label => ({ label, value: label }));
        return statuses;
      }
	waitForResponse() {
    if (environment.prototype) {
      this.getWorkflowConfig();
    }
      }
	initFormValidations(){
        this.detailFormControls.enable({ emitEvent: false });
        this.hiddenFields = {};
        this.updateAllowedActions();
        this.formValueChanges();
        this.disableDependantFields();
        this.addValidatorsForMinMaxDateValidation();
      }
    
    addValidatorsForMinMaxDateValidation() {
        for (const property in this.formFieldConfig) {
          if ((this.formFieldConfig[property]?.uiType?.toLowerCase() == 'datetime' || this.formFieldConfig[property]?.uiType?.toLowerCase() == 'date') && (this.formFieldConfig[property]?.minDate || this.formFieldConfig[property]?.maxDate)) {
            if (this.formFieldConfig[property]?.minDate) {
              this.detailFormControls.controls[property].addValidators(this.customValidatorService.dateValidator('min', this.formFieldConfig[property]))
            }
            if (this.formFieldConfig[property]?.maxDate) {
              this.detailFormControls.controls[property].addValidators(this.customValidatorService.dateValidator('max', this.formFieldConfig[property]))
            }
          }
        }
      }
    
    showMessage(config:any){
        this.messageService.clear();
        this.messageService.add(config);
    }

    onInit() {
		
		this.waitForResponse();
this.initWorkflow();
		
this.getId();   
this.initForm();
this.calculateFormula();
this.initFormValidations();
this.activeTabIndexes = this.appUtilBaseService.generateDynamicTabViewProps(this.detailFormStructureConfig);
this.showWorkflowSimulator = Boolean(this.isPrototype && this.workFlowEnabled);
this.getUserRoles();
this.bindLookupFields();
this.addValidatorsForMinMaxDateValidation();
this.addValidatorsForMultiValues();
this.readOnlyBasedonRoles();
this.mapIndexedFields();

    }
	
     onDestroy() {
		
    }
     onAfterViewInit() {
		
		 this.scrolltoTop();
    }
    
    onChanges(changes:any) {
		
	}
}
