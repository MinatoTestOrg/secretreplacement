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
import { FormControl, FormGroup, Validators, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ElementRef, Renderer2, ViewChild } from '@angular/core';
import { debounceTime, fromEvent, catchError, combineLatest, distinctUntilChanged, of, Observer, Subscription, map, Observable, Subject } from 'rxjs';
import { environment } from '@env/environment';
import { Filter } from '@baseapp/vs-models/filter.model';
import { AppConstants } from '@app/app-constants';
import { AppGlobalService } from '@baseapp/app-global.service';
import { GridComponent } from '@libsrc/grid/grid.component';
import { Location } from '@angular/common';
import { BaseService } from '@baseapp/base.service';

@Directive(
{
	providers:[MessageService, ConfirmationService, DialogService]
}
)
export class ApplicationUserListBaseComponent{
	
	
	quickFilter: any;
hiddenFields:any = {};
quickFilterFieldConfig:any={}
	  selectedValues: any[] = [];
  filter: Filter = {
    globalSearch: '',
    advancedSearch: {},
    sortField: null,
    sortOrder: null,
    quickFilter: {}
  };
params: any;
isMobile: boolean = AppConstants.isMobile;

  gridData: ApplicationUserBase[] = [];
  totalRecords: number = 0;
  subscriptions: Subscription[] = [];
 multiSortMeta:any =[];
 selectedColumns:any =[];
subHeader: any;
  autoSuggest: any;
  query: any;

rightFreezeColums:any;
total:number =0;
inValidFields:any = {};
selectedItems:any ={};
scrollTop:number =0;
isRowSelected: boolean = false;
isPrototype = environment.prototype;
  workFlowEnabled = false;
isList = true;
isPageLoading:boolean = false;
autoSuggestPageNo:number = 0;
complexAutoSuggestPageNo:number = 0
localStorageStateKey = "application-user-list";
showMenu: boolean = false;
conditionalActions:any ={
  disableActions:[],
  hideActions:[]
}
actionBarConfig:any =[];
first: number =0;
rows: number = 0;
updatedRecords:ApplicationUserBase[] = [];
showPaginationOnTop = AppConstants.showPaginationonTop;
 showPaginationOnBottom = AppConstants.showPaginationonBottom;
 tableFieldConfig:any ={};
dateFormat: string = AppConstants.calDateFormat;
selectedRowId: any = '';
 showWorkflowSimulator:boolean = false;
 gridConfig: any = {};
  @ViewChild(GridComponent)
  public gridComponent: any = GridComponent;
separator = "__";
timeFormatPrimeNG: string = AppConstants.timeFormatPrimeNG;
dateFormatPrimeNG: string = AppConstants.dateFormatPrimeNG ;
minFraction = AppConstants.minFraction;
maxFraction = AppConstants.maxFraction;
currency = AppConstants.currency;
currencyDisplay = AppConstants.currencyDisplay;
 responseData:any =[];
defaultActions= ['save','cancel','delete','refresh','back','changelog','workflowhistory','import','export','new'];
queryViewList:boolean = false; // dynamic Variable has to be updated here
showonFilter:boolean = false;
selectedRows:any =[];
@Input() filters:any ={};
@Input() componentId:string ='';
@Input() mapData:any ={};
priorGridParams:any;
queryViewFiltersApplied: boolean = false;
 gridEmptyMsg: string = '';
	bsModalRef?: BsModalRef;
	isSearchFocused:boolean = false;
showBreadcrumb = AppConstants.showBreadcrumb;
	
showAdvancedSearch: boolean = false;

tableSearchFieldConfig:any = {};
@ViewChild('toggleButton')
  toggleButton!: ElementRef;
  @ViewChild('menu')
  menu!: ElementRef;
 filtersApplied:boolean = false;

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
    "visibility" : "show",
    "buttonStyle" : "curved",
    "confirmationText" : "confirm",
    "label" : "NEW",
    "type" : "button",
    "beforeAction" : "none",
    "outline" : false,
    "buttonType" : "icon_on_left",
    "showOn" : "both",
    "enableOnlyIfRecordSelected" : false,
    "buttonId" : "NewbuttonId1",
    "buttonEnabled" : "yes",
    "action" : "new",
    "confirmationTitle" : "confirmation",
    "fields" : [ ],
    "confirmationButtonText" : "yes",
    "cancelButtonText" : "no"
  }, {
    "visibility" : "show",
    "buttonStyle" : "curved",
    "icon" : {
      "type" : "icon",
      "icon" : {
        "label" : "fas fa-trash-alt",
        "value" : "fas fa-trash-alt"
      },
      "iconColor" : "#000000",
      "iconSize" : "13px"
    },
    "confirmationText" : "confirm",
    "label" : "DELETE",
    "type" : "button",
    "beforeAction" : "none",
    "outline" : false,
    "buttonType" : "icon_only",
    "showOn" : "both",
    "enableOnlyIfRecordSelected" : false,
    "buttonId" : "DeletebuttonId2",
    "buttonEnabled" : "yes",
    "action" : "delete",
    "confirmationTitle" : "confirmation",
    "fields" : [ ],
    "confirmationButtonText" : "yes",
    "cancelButtonText" : "no"
  }, {
    "visibility" : "show",
    "buttonStyle" : "curved",
    "icon" : {
      "type" : "icon",
      "icon" : {
        "label" : "fas fa-sync",
        "value" : "fas fa-sync"
      },
      "iconColor" : "#000000",
      "iconSize" : "13px"
    },
    "confirmationText" : "confirm",
    "label" : "REFRESH",
    "type" : "button",
    "beforeAction" : "none",
    "outline" : false,
    "buttonType" : "icon_only",
    "showOn" : "both",
    "enableOnlyIfRecordSelected" : false,
    "buttonId" : "RefreshbuttonId3",
    "buttonEnabled" : "yes",
    "action" : "refresh",
    "confirmationTitle" : "confirmation",
    "fields" : [ ],
    "confirmationButtonText" : "yes",
    "cancelButtonText" : "no"
  } ],
  "type" : "actionBar"
}
	rightActionBarConfig : any = {
  "type" : "actionBar"
}
	tableSearchConfig : any = {
  "outline" : false,
  "disabledFieldsByLookup" : [ ],
  "children" : [ {
    "fieldName" : "email",
    "data" : "",
    "field" : "email",
    "name" : "email",
    "uiType" : "email",
    "isPrimaryKey" : true,
    "label" : "EMAIL",
    "type" : "searchField",
    "fieldType" : "string",
    "fieldId" : "email"
  }, {
    "fieldName" : "firstName",
    "data" : "",
    "field" : "firstName",
    "name" : "firstName",
    "uiType" : "text",
    "isPrimaryKey" : false,
    "label" : "FIRST_NAME",
    "type" : "searchField",
    "fieldType" : "string",
    "fieldId" : "firstName"
  }, {
    "fieldName" : "lastName",
    "data" : "",
    "field" : "lastName",
    "name" : "lastName",
    "uiType" : "text",
    "isPrimaryKey" : false,
    "label" : "LAST_NAME",
    "type" : "searchField",
    "fieldType" : "string",
    "fieldId" : "lastName"
  } ],
  "columns" : "1",
  "type" : "tableSearch",
  "showAdvancedSearch" : true,
  "queryViewMapping" : { }
}
	quickFilterConfig : any = {
  "outline" : false,
  "disabledFieldsByLookup" : [ ],
  "children" : [ ],
  "type" : "quickFilter",
  "queryViewMapping" : { }
}
	customRenderConfig : any = {
  "children" : [
     ]
}
	tableConfig : any = {
  "striped" : true,
  "recordSelection" : "multiple_records",
  "rightFreezeFromColumn" : "0",
  "inlineEditing" : false,
  "viewAs" : "list",
  "hoverStyle" : "box",
  "tableStyle" : "style_2",
  "columnReorder" : false,
  "type" : "grid",
  "showDetailPageAs" : "navigate_to_new_page",
  "rowGroup" : "yes",
  "outline" : false,
  "pageLimit" : "50",
  "leftFreezeUptoColumn" : "0",
  "rememberLastTableSettings" : false,
  "columnResize" : false,
  "children" : [ {
    "fieldName" : "email",
    "data" : "",
    "formatDisplay" : false,
    "showOnMobile" : false,
    "isPrimaryKey" : true,
    "label" : "EMAIL",
    "type" : "gridColumn",
    "showLabel" : false,
    "field" : "email",
    "labelPosition" : "top",
    "name" : "email",
    "uiType" : "email",
    "fieldType" : "string",
    "fieldId" : "email"
  }, {
    "fieldName" : "firstName",
    "data" : "",
    "formatDisplay" : false,
    "showOnMobile" : false,
    "isPrimaryKey" : false,
    "label" : "FIRST_NAME",
    "type" : "gridColumn",
    "showLabel" : false,
    "field" : "firstName",
    "labelPosition" : "top",
    "name" : "firstName",
    "uiType" : "text",
    "fieldType" : "string",
    "fieldId" : "firstName"
  }, {
    "fieldName" : "lastName",
    "data" : "",
    "formatDisplay" : false,
    "showOnMobile" : false,
    "isPrimaryKey" : false,
    "label" : "LAST_NAME",
    "type" : "gridColumn",
    "showLabel" : false,
    "field" : "lastName",
    "labelPosition" : "top",
    "name" : "lastName",
    "uiType" : "text",
    "fieldType" : "string",
    "fieldId" : "lastName"
  } ],
  "toggleColumns" : false,
  "showGridlines" : false,
  "sortOrder" : "asc",
  "sorting" : "single_column",
  "detailPageNavigation" : "click_of_the_row",
  "rowSpacing" : "medium",
  "rowHeight" : "medium"
}
	pageViewTitle: string = 'APPLICATION_USER_LIST';
	
	public applicationUserService = inject(ApplicationUserService);
public appUtilBaseService = inject(AppUtilBaseService);
public translateService = inject(TranslateService);
public messageService = inject(MessageService);
public confirmationService = inject(ConfirmationService);
public dialogService = inject(DialogService);
public domSanitizer = inject(DomSanitizer);
public bsModalService = inject(BsModalService);
public activatedRoute = inject(ActivatedRoute);
public renderer2 = inject(Renderer2);
public router = inject(Router);
public appGlobalService = inject(AppGlobalService);
public baseService = inject(BaseService);
public location = inject(Location);
		tableSearchControls : UntypedFormGroup = new UntypedFormGroup({
	lastName: new UntypedFormControl('',[]),
	firstName: new UntypedFormControl('',[]),
	email: new UntypedFormControl('',[]),
});

		quickFilterControls : UntypedFormGroup = new UntypedFormGroup({
});


	
	getDisabled(formControl: FormGroup, ele: string) {
  const parent = ele.split('?.')[0];
  if (formControl.controls[parent] instanceof FormGroup){
    return formControl.get(ele)?.disabled
  }
  else
    return formControl.controls[parent].disabled;
}
	initFilterForm() {
    this.quickFilterFieldConfig = this.appUtilBaseService.getControlsFromFormConfig(this.quickFilterConfig);
    this.addCustomFilters();    
for (const key in this.quickFilterFieldConfig) {
      if (this.quickFilterFieldConfig.hasOwnProperty(key)) {
        if (this.quickFilterFieldConfig[key].mandatory == 'yes') {
          this.quickFilterControls.get(key)?.disable();
        }
      }
    }
   this.filterSearch();
  }
	getSearchData(searchFields?: any, config?: any) {
    let searchData: any = {}
   if(this.filters[this.componentId]?.length > 0){
      this.filters[this.componentId]?.forEach((keys:any)=>{
        if(this.mapData[keys.tableField])
          searchData[keys.lookupField] = this.mapData[keys.tableField]
      })
    }
    if (searchFields) {
      for (const key in searchFields) {
        if (searchFields.hasOwnProperty(key) && searchFields[key]?.toString().length) {
          if (config[key].uiType == 'autosuggest') {
            let lookupObj: any = [];
            if (config[key].multiple) {
              searchFields[key]?.map((o: any) => lookupObj.push(o.sid));
            }
            const rField = this.tableSearchFieldConfig[key].parentField || "";
            searchData[key] = searchFields[key][rField];
          }
          else {
            searchData[key] = searchFields[key];
          }
        }
      }
    }
   
    return searchData;
  }
	clearAllFilters() {
  this.filter.globalSearch = '';
  this.clearFilterValues();
}
	getInputParams() {
    return {}
  }
	onNew() {
	const value: any = "parentId";
	let property: Exclude<keyof ApplicationUserListBaseComponent, ''> = value;
	if (this.isChildPage && this[property]) {
		const methodName: any = "onNewChild";
		let action: Exclude<keyof ApplicationUserListBaseComponent, ''> = methodName;
		if (typeof this[action] == "function") {
			this[action]();
		}
	}
	else {
	    if (!this.tableConfig.detailPage?.url) return;
		this.router.navigateByUrl(this.tableConfig.detailPage?.url);
	}
}
	onDelete() {
    if (this.selectedValues.length > 0) {
      let requestedParams: any = { ids: this.selectedValues.toString() }
      this.confirmationService.confirm({
        message: this.translateService.instant('DELETE_CONFIRMATION_MESSAGE'),
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          const deleteSubscription = this.applicationUserService.delete(requestedParams).subscribe((res: any) => {
            this.showToastMessage({ severity: 'success', summary: '', detail: this.translateService.instant('RECORDS_DELETED_SUCCESSFULLY') });
            requestedParams = {};
            this.selectedValues = [];
            this.isRowSelected = false;
            this.actionButtonEnableDisable();
            this.onRefresh(true);

          });
          this.subscriptions.push(deleteSubscription);
        },
        reject: () => {
          
        },
      });
    }

  }
	loadGridData() {
    let gridSubscription: any;
    if (environment.prototype && this.tableConfig.children?.length > 0) {
      gridSubscription = this.applicationUserService.getProtoTypingData().subscribe((data: any) => {
        this.gridData = [...this.gridData, ...data];
        this.isPageLoading = false;
      });
    }
    else {
      this.gridData = []
    }
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
	enableChildOptions(){
	}
	// closeAdvancedSearchPopup() {
  //   this.renderer2.listen('window', 'click', (e: Event) => {
  //     let clickedInside = this.menu?.nativeElement.contains(e.target);
  //     if(e.target !== this.toggleButton?.nativeElement&& !clickedInside &&this.showAdvancedSearch){
  //       this.showAdvancedSearch = false;
  //     }
  //   );
  // }
clearFilters(){
  this.filter.globalSearch = '';
  this.isSearchFocused = false;
}

focus(){
  this.isSearchFocused = !this.isSearchFocused;
}
	toShowRecords(params?: any) {
    this.showonFilter = this.queryViewList ? true : false;
    const mandatoryFilters = this.checkMandatoryFilters();
    let searchDataValues = Object.keys(params?.search || {});
    const missingFilters = mandatoryFilters.filter(filter => !searchDataValues.includes(filter));
    if (this.queryViewList && mandatoryFilters.length > 0) {
      if (searchDataValues.length === 0) {
        this.queryViewFiltersApplied = false; // No search data provided, so hide records
      } else {
        if (missingFilters.length === 0) {
          this.queryViewFiltersApplied = true; // All mandatory filters are present in searchData
        } else {
          this.queryViewFiltersApplied = false; // Some mandatory filters are missing in searchData
          console.log("Mandatory filters missing in searchData:", missingFilters);
          // Optionally, you can handle this case or display a message to the user.
        }
      }
    } else if (this.queryViewList && mandatoryFilters.length <= 0) {
      this.queryViewFiltersApplied = true;
    }
    // Check if priorGridParams.search and params.search are equal
    if (this.priorGridParams && this.priorGridParams.search && params && params.search) {
      const priorSearch = JSON.stringify(this.priorGridParams.search);
      const currentSearch = JSON.stringify(params.search);
      if (priorSearch === currentSearch) {
        // If priorGridParams.search and params.search are equal, set queryViewFiltersApplied to false
        this.queryViewFiltersApplied = false;
      }
    }

    if (!this.queryViewFiltersApplied && this.showonFilter) {
      let missingParams = missingFilters.join(', ').replace(/,(?=[^,]*$)/, ', and');
      this.gridEmptyMsg = `Unable to display any records. The query is missing mandatory parameters:     ${missingParams}. Please ensure these parameters are provided for the view to display records.`;
      console.log("Mandatory fields without user interaction:", missingFilters);
    }
    else {
      this.gridEmptyMsg = 'No Data Available'
    }
    this.gridConfig['emptyTableMsg'] =  this.gridEmptyMsg;
  }
	initSearchForm(){
  this.tableSearchFieldConfig= this.appUtilBaseService.getControlsFromFormConfig(this.tableSearchConfig)
}
	filterSearch() {
    this.quickFilterControls.valueChanges.subscribe((value) => {
 if(!(this.appUtilBaseService.isEqualIgnoreCase(value,this.filter.quickFilter, [],true))){
      for (let control of this.quickFilterConfig.children) {
       // if (control.uiType === 'autosuggest' && AppConstants.isSql) {
         // control.mapping?.map((o: any, index: number) => {
         //   if (o.isApplicable && !this.hiddenFields[o.childField] && value[control.fieldName] && value[control.fieldName][o.parentField]) {
           //   this.quickFilterControls.get([o.childField])?.patchValue(value[control.fieldName][o.parentField], { emitEvent: false });
           // }
         // })
       // }
      }
      let filterVals = { ... this.quickFilterControls.value };
      let hasDates = this.quickFilterConfig.children.filter((e: any) => e.fieldType.toLowerCase() == "date" || e.fieldType.toLowerCase() == "datetime");
       if (hasDates.length > 0) {
        let val:any = {};
        hasDates.forEach((f: any) => {
          let field = f.name;
          let dateVal = value[field];
          if (!dateVal) delete filterVals[field];
          if (dateVal && Array.isArray(dateVal)) {
            if(this.quickFilterFieldConfig[field].uiType ==='date'){
              const tempDate1 = new Date(dateVal[0]);
              const tempDate2 = new Date(dateVal[1]);
              const convertedDate1 = tempDate1.getFullYear() + '-' + this.leftPad((tempDate1.getMonth() + 1), 2) + '-' + this.leftPad(tempDate1.getDate(), 2);
              const convertedDate2 = tempDate2.getFullYear() + '-' + this.leftPad((tempDate2.getMonth() + 1), 2) + '-' + this.leftPad(tempDate2.getDate(), 2);
              val = { lLimit: convertedDate1 ? new Date(convertedDate1).getTime() : null, uLimit: dateVal[1] ? new Date(convertedDate2).getTime() : null, type: "Date" };
            }
            else{
              val = { lLimit: new Date(dateVal[0]).getTime(), uLimit: dateVal[1] ? new Date(dateVal[1]).getTime(): dateVal[1], type: "Date" }          
            }
            filterVals[field] = val;
            if (dateVal[0] == null && dateVal[1] == null) {
              delete filterVals[field];
            }
          }

          if (dateVal && typeof dateVal == 'object' && !Array.isArray(dateVal)) {
              if (this.quickFilterFieldConfig[field].uiType === 'date') {
                const tempDate1 = typeof dateVal?.min == 'undefined' ? dateVal : dateVal?.min ? new Date(dateVal?.min) : null;
                const tempDate2 = typeof dateVal?.max == 'undefined' ? dateVal : dateVal?.max ? new Date(dateVal?.max) : null;
                const convertedDate1 = tempDate1 ? tempDate1.getFullYear() + '-' + this.leftPad((tempDate1.getMonth() + 1), 2) + '-' + this.leftPad(tempDate1.getDate(), 2) : null;
                const convertedDate2 = tempDate2 ? tempDate2.getFullYear() + '-' + this.leftPad((tempDate2.getMonth() + 1), 2) + '-' + this.leftPad(tempDate2.getDate(), 2) : null;
                val = { lLimit: convertedDate1 ? new Date(convertedDate1).getTime() : null, uLimit: convertedDate2 ? new Date(convertedDate2).getTime() : null, type: "Date" };
              } else {
                val = { lLimit: new Date(dateVal?.min).getTime(), uLimit: dateVal?.max ? new Date(dateVal?.max).getTime() : null, type: "Date" }
              }
              if (val?.lLimit || val?.uLimit) {
                filterVals[field] = val;
              }
              if (!val?.lLimit && !val?.uLimit) {
                delete filterVals[field];
              }
            }
        });
      }
      let hasNumbers = this.quickFilterConfig.children.filter((e: any) => e.fieldType.toLowerCase() == "number" || e.fieldType.toLowerCase() == "double");
      if (hasNumbers.length > 0) {
        hasNumbers.forEach((f: any) => {
          let field = f.name;
          let numberValue = value[field];
          if (numberValue && !Array.isArray(numberValue) && typeof numberValue == 'object') {
            filterVals[field] = {
              lLimit: numberValue.min, uLimit: numberValue.max, type: "Number"
            }
            if (numberValue.min == null && numberValue.max == null) {
              delete filterVals[field];
            }
          }
        });
      }
      this.filter.quickFilter = filterVals;
      this.onRefresh();
}
    });
  }
	shouldRefresh(previousValue: any, currentValue: any): boolean {
    // Check if any of the changed fields match the filter fields
    const filterFields = this.filters[this.componentId]?.map((filter: any) => filter.tableField);
    return filterFields.some((field:any) => {
      const previousFieldValue = previousValue[field];
      const currentFieldValue = currentValue[field];
      // Check if the field has changed
      return JSON.stringify(previousFieldValue) !== JSON.stringify(currentFieldValue);
    });
  }
	actionBarAction(btn: any) {
    const methodName: any = (`on` + btn.action.charAt(0).toUpperCase() + btn.action.slice(1));
    let action: Exclude<keyof ApplicationUserListBaseComponent, ' '> = methodName;
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
    let action: Exclude<keyof ApplicationUserListBaseComponent, ' '> = methodName;
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
	addCustomFilters(){}
	onBeforeRefresh(params:any){
    return params;
  }
	onKeydown(event: any) {
  if (event.which === 13 || event.keyCode === 13) {
    // this.filter.globalSearch = this.globalSearch
   this.onRefresh();
  }
}
	checkMandatoryFilters() {
    const mandatoryFields: string[] = [];
    Object.keys(this.quickFilterControls.controls).forEach(key => {
      const control = this.quickFilterControls.get(key);
      if (control && control.validator && control.validator(control)) {
        const errors = control.validator(control);
        if (errors && errors.required) {
          mandatoryFields.push(key);
        }
      }
    });

    this.filters[this.componentId]?.forEach((obj: any) => {
      if (!mandatoryFields.includes(obj.lookupField)) {
        mandatoryFields.push(obj.lookupField);
      }
    });
    this.tableConfig.queryViewMandatoryFilters?.forEach((field: any) => {
      if (!mandatoryFields.includes(field)) {
        mandatoryFields.push(field);
      }
    });
    return mandatoryFields;
  }
	getGridConfig() {
    const self = this;
    this.tableConfig.tableStyle = this.appUtilBaseService.getTableView(this.tableConfig.tableStyle,this.tableConfig.rowSpacing,this.tableConfig.rowHeight)?.tableStyle;
    return {
      data: this.gridData,
      columns: this.getColumns(),
      ajaxUrl: ApplicationUserApiConstants.getDatatableData,
      select: true,
      colReorder: (String(this.tableConfig?.columnReorder)?.toLowerCase() === 'true'),
     detailPageNavigation: (this.tableConfig?.detailPageNavigation?.toLowerCase() == 'click_of_the_row' ? 'row_click' : (this.tableConfig?.detailPageNavigation?.toLowerCase() == 'click_on_navigate_icon' ? 'row_edit' : '')),
      toggleColumns: (String(this.tableConfig?.toggleColumns)?.toLowerCase() === 'true'),
      paging: !(String(this.tableConfig?.infiniteScroll)?.toLowerCase() === 'true'),
      scrollX: true,
      scrollCollapse: true,
      pageLength: parseInt(String(this.tableConfig?.pageLimit)),
      deferRender: true,
      ordering: true,
      sortField: this.tableConfig.sortField,
      sortOrder: this.tableConfig.sortOrder,
      colResize: (String(this.tableConfig?.columnResize)?.toLowerCase() === 'true'),
      disableSelection: ((this.tableConfig?.recordSelection?.toLowerCase() == 'multiple_records' || this.tableConfig?.recordSelection?.toLowerCase() == 'single_record_only') ? false : true),
      recordSelection: (this.tableConfig?.recordSelection?.toLowerCase() == 'multiple_records' ? 'multi' : (this.tableConfig?.recordSelection?.toLowerCase() == 'single_record_only' ? 'single' : '')),
      bFilter: false,
      enterKeytoSearch: false,
      showGridlines:this.tableConfig.showGridlines,
      striped:this.tableConfig.striped,
      rowSpacing:this.appUtilBaseService.getTableView(this.tableConfig.tableStyle,this.tableConfig.rowSpacing,this.tableConfig.rowHeight)?.rowSpacing,
      rowHeight:this.appUtilBaseService.getTableView(this.tableConfig.tableStyle,this.tableConfig.rowSpacing,this.tableConfig.rowHeight)?.rowHeight,
      sortSeparator:this.separator,
      rowGrouping: jQuery.isEmptyObject(this.tableConfig?.groupOnColumn) ? '' : this.tableConfig?.groupOnColumn?.name,
      rowGroupColumns: this.tableConfig?.rowGroupColumns,
      rowGroup: (String(this.tableConfig?.rowGroup)?.toLowerCase() === 'yes'),
      currentPageName:this.pageViewTitle,
      fixedColumns: {
        left: parseInt(String(this.tableConfig?.leftFreezeUptoColumn || '0') ),
        right: parseInt(String(this.tableConfig?.rightFreezeFromColumn || '0') )
      },
     isChildPage: this.isChildPage,
      parentId: this.getParentId(),
      uniqueIdentifier:this.tableConfig?.uniqueIdentifier|| null,
        defaultSearch:this.filters[this.componentId]?.length > 0 || this.queryViewList ? true : false,
      searchParams:this.getSearchData(),
       emptyTableMsg: this.gridEmptyMsg,
      onRowMenuClick: (option: any, row: any, data: any) => {
      },

      onRowSelect: (selectedRows: any, id: any) => {
        this.getSelectedvalues(selectedRows, id);
      },
      onRowDeselect: (selectedRows: any) => {
        this.getSelectedvalues(selectedRows, '');
      },
       onRowClick: (event: any, id: string,data:any) => {
        this.onUpdate(id, event,data);
      },
      drawCallback: (settings: any, apiScope: any) => {
        this.onDrawCallback(settings, apiScope);
      },
      onAfterServiceRequest: (data: any) => {
        this.onAfterServiceRequest(data)
      }
    };

  }

  onAfterServiceRequest(data: any) {
     this.clearSelectedValues();
    // Callback function for getting Datatable data 
    // console.log(data)
  }

  onDrawCallback(settings: any, apiScope: any) {
    // Callback function, which is called every time DataTables performs a draw
  }

  clearSelectedValues() {
    this.selectedValues = [];
    this.actionButtonEnableDisable();
  }

  getSelectedvalues(selectedRows: any, id: string) {
    let rawData: any = selectedRows?.data();
    // Filter out properties that are not functions
    this.selectedRows = []
    // Iterate through the properties of the response object
    for (const key in rawData) {
        // Check if the property is a numeric index (data objects)
        if (!isNaN(parseInt(key))) {
            // Add the data object to the array
            this.selectedRows.push(rawData[key]);
        }
    }

    this.selectedValues = [];
    rawData?.map((obj: any) => {
        this.selectedValues.push(obj.sid)
    })
    if (this.selectedValues.length > 0) {
        this.isRowSelected = true;
    } else if (this.selectedValues.length <= 0) {
        this.isRowSelected = false;
    }
    this.actionButtonEnableDisable();
}
	clearFilterValues() {
  this.tableSearchControls.reset();
  this.filter.advancedSearch = {};
  this.onRefresh();
  this.filtersApplied = false;
}
	manipulateOutputData(res: any): void {
    
  }
	updateActions() {
        this.actionBarConfig = this.appUtilBaseService.getActionsConfig(this.leftActionBarConfig.children) ||[];
        this.actionBarConfig?.forEach((actionConfig: any) => {
            if (actionConfig && actionConfig.visibility === 'conditional' && actionConfig.conditionForButtonVisiblity) {
                const conResult = this.appUtilBaseService.evaluvateCondition(actionConfig.conditionForButtonVisiblity?.query?.rules, actionConfig.conditionForButtonVisiblity?.query?.condition);
                this.validateActions(actionConfig.buttonId, conResult, 'view');
            }
            if (actionConfig && actionConfig.buttonEnabled === 'conditional' && actionConfig.conditionForButtonEnable) {
                const conResult = this.appUtilBaseService.evaluvateCondition(actionConfig.conditionForButtonEnable?.query?.rules, actionConfig.conditionForButtonEnable?.query?.condition);
                this.validateActions(actionConfig.buttonId, conResult, 'edit');
            }
        })
    }
    validateActions(label: string, result: boolean, action: string) {
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
  disablechildAction(pid?:any) {
      const value: any = "parentId";
      let property: Exclude<keyof ApplicationUserListBaseComponent, ' '> = value;
        const parentId = this[property] || pid;
        this.leftActionBarConfig?.children?.map((ele: any) => {
          if (ele?.action === 'new' && !parentId && this.isChildPage && ele.buttonEnabled != 'conditional') {
            ele.buttonEnabled = 'no';
          }
          else if (ele.action === 'new' && parentId && this.isChildPage && ele.buttonEnabled != 'conditional') {
            ele.buttonEnabled = 'yes';
          }
        })
      }
	onRefresh(fromDelete?:boolean): void {
    const fromDel = fromDelete || false;
    const params = this.assignTableParams();
    this.gridComponent.refreshGrid(params,fromDel);
    this.selectedValues =[];
  }
	getButtonConfig(btn:any){
    return {
      action:btn.action,
      confirmationTitle:btn.confirmationTitle|| 'Confirmation',
      confirmationText:btn.confirmationText || 'Do you want to perform the action?',
      fields: btn.fields || {"children":[]},
        confirmButton:btn.confirmationButtonText,
      rejectButton:btn.cancelButtonText,
      values:(this.responseData?.filter((o:any)=>o.sid == this.selectedValues[0]))[0]
    }
  }
	toggleAdvancedSearch() {
  this.showAdvancedSearch = !this.showAdvancedSearch;
}
	onUpdate(id: any, event?: any, data?: any) {
	if (this.tableConfig.detailPage?.url) {
      const value: any = "parentId";
       let property: Exclude<keyof ApplicationUserListBaseComponent, ''> = value;
       const methodName: any = "onUpdateChild";
       let action: Exclude<keyof ApplicationUserListBaseComponent, ''> = methodName;
       if (this.isChildPage && this[property]) {
	       if (typeof this[action] === "function") {
	        	this[action](id);
	         }
       }
       else {
       	this.router.navigateByUrl(this.tableConfig.detailPage.url + '?id=' + id)
       }
    }
}
	showInfoMessage(message: string) {
    // Display an info message
    this.messageService.add({severity:'info', summary:'Info', detail: message});
  }
	scrollFilterFieldsList(position: any, event: any) {
    if (position == 'right') {
      event.target.offsetParent?.children[1]?.scrollBy(200, 0)
    } else {
      event.target.offsetParent?.children[1]?.scrollBy(-200, 0)
    }
  }
	onBack(){
this.location.back();
}
	checkIfScrollbarVisible() {
    const element: any = document.getElementById(this.localStorageStateKey);
    if (element) {
      const isScrollable = element.scrollWidth > element.clientWidth;
      if (!isScrollable) { return false }
    }; 
    return true;
  }
	advancedSearch() {
    this.filter.advancedSearch = this.tableSearchControls.value;
    let hasDates = this.tableSearchConfig.children.filter((e: any) => e.fieldType.toLowerCase() == "date" || e.fieldType.toLowerCase() == "datetime");
    if (hasDates.length > 0) {
      hasDates.forEach((f: any) => {
        let val:any ={};
        let field = f.name;
        let value = this.filter.advancedSearch[field];
        if (value && Array.isArray(value)) {
            if(this.tableSearchFieldConfig[field].uiType ==='date'){
              const tempDate1 = new Date(value[0]);
              const tempDate2 = new Date(value[1]);
              const convertedDate1 = tempDate1.getFullYear() + '-' + this.leftPad((tempDate1.getMonth() + 1), 2) + '-' + this.leftPad(tempDate1.getDate(), 2);
              const convertedDate2 = tempDate2.getFullYear() + '-' + this.leftPad((tempDate2.getMonth() + 1), 2) + '-' + this.leftPad(tempDate2.getDate(), 2);
              val = { lLimit: convertedDate1 ? new Date(convertedDate1).getTime() : null, uLimit: value[1] ? new Date(convertedDate2).getTime() : null, type: "Date" };
            }
            else{
              val = { lLimit: new Date(value[0]).getTime(), uLimit: value[1] ? new Date(value[1]).getTime(): value[1], type: "Date" }          
            }
          
          this.filter.advancedSearch[field] = val;
          if (value[0] == null && value[1] == null) {
            delete this.filter.advancedSearch[field];
          }
        }

        if (value && typeof value == 'object' && !Array.isArray(value)) {
          if (this.tableSearchFieldConfig[field].uiType === 'date') {
            const tempDate1 = typeof value?.min == 'undefined' ? value : value?.min ? new Date(value?.min) : null;
            const tempDate2 = typeof value?.max == 'undefined' ? value : value?.max ? new Date(value?.max) : null;
            const convertedDate1 = tempDate1 ? tempDate1.getFullYear() + '-' + this.leftPad((tempDate1.getMonth() + 1), 2) + '-' + this.leftPad(tempDate1.getDate(), 2) : null;
            const convertedDate2 = tempDate2 ? tempDate2.getFullYear() + '-' + this.leftPad((tempDate2.getMonth() + 1), 2) + '-' + this.leftPad(tempDate2.getDate(), 2) : null;
            val = { lLimit: convertedDate1 ? new Date(convertedDate1).getTime() : null, uLimit: convertedDate2 ? new Date(convertedDate2).getTime() : null, type: "Date" };
          } else {
            val = { lLimit: new Date(value?.min).getTime(), uLimit: value?.max ? new Date(value?.max).getTime() : null, type: "Date" }
          }
          if (val?.lLimit || val?.uLimit) {
            this.filter.advancedSearch[field] = val;
          }
          if (!val?.lLimit && !val?.uLimit) {
            delete this.filter.advancedSearch[field];
          }
        }
      });
    }
    let hasNumbers = this.tableSearchConfig.children.filter((e: any) => e.fieldType.toLowerCase() == "number" || e.fieldType.toLowerCase() == "double");
    if (hasNumbers.length > 0) {
      hasNumbers.forEach((f: any) => {
        let field = f.name;
        let value = this.filter.advancedSearch[field];
        if (value && !Array.isArray(value) && typeof value == 'object') {
          this.filter.advancedSearch[field] = {
            lLimit: value.min, uLimit: value.max, type: "Number"
          }
          if (value.min == null && value.max == null) {
            delete this.filter.advancedSearch[field];
          }
        }
      });
    }
    this.onRefresh();
    this.toggleAdvancedSearch();
    this.filtersApplied = true;
  }
	actionButtonEnableDisable() {
    this.leftActionBarConfig?.children?.map((ele: any) => {
      if (ele?.action === 'delete' && ele.buttonEnabled != 'conditional') {
        if (this.selectedValues?.length > 0) {
          ele.buttonEnabled = 'yes';
        } else {
          ele.buttonEnabled = 'no';
        }
      }
    })
  }
  getColumns() {
   const json1 = this.tableConfig.children ||[];
    const json2 = this.customRenderConfig.children ||[];
    let merged = [];
    for (let i = 0; i < json1.length; i++) {
 if(json1[i].mapping?.length > 0){
        json1[i].orderable = false;
      }
      merged.push({
        ...json1[i],
        ...(json2.find((itmInner: any) => itmInner.fieldName === json1[i].fieldName))
      });
    }
    return merged;
  }
showToastMessage(config: object) {
    this.messageService.add(config);
  }
getParentId() {
  const value: any = "parentId";
  let property: Exclude<keyof ApplicationUserListBaseComponent, ' '> = value;
  if (this.isChildPage) {
    if (this[property]) {
      return this[property];
    } else {
      return false;
    }
  }
}
leftPad(num:number, length:number) {
    var result = '' + num;
    while (result.length < length) {
      result = '0' + result;
    }
    return result;
  }
	calculateFormula(){
	
}
	getDefaultSearchParams(){
    const searchData:any ={};
    if(this.filters[this.componentId]?.length > 0){
      this.filters[this.componentId].forEach((keys:any)=>{
        if(this.mapData[keys.tableField])
          searchData[keys.field] = this.mapData[keys.tableField]
      })
    }
    return searchData;
  }
	clearGlobalSearch(){
  this.filter.globalSearch = '';
  this.onRefresh();
}
	assignTableParams() {
    const params: any = {};
    this.filter.sortField = this.tableConfig.groupOnColumn ? this.tableConfig.groupOnColumn?.name : this.filter.sortField;
    const searchData = { ...this.getSearchData(this.filter.advancedSearch, this.tableSearchFieldConfig), ...this.getSearchData(this.filter.quickFilter, this.quickFilterFieldConfig) }
    if (this.filter.globalSearch)
      searchData['_global'] = this.filter.globalSearch;

    if (this.filter.sortField && this.filter.sortOrder) {
    let columnName:any = null;
    this.tableConfig.children.map((ele: any) => {
      if (ele.uiType === "autosuggest" && this.filter.sortField === ele.name) {
        columnName = (ele.name + "__value__" + ele.displayField);
      }
      else if(this.filter.sortField === ele.name){
        columnName = this.filter.sortField 
      }
      if(columnName){
        params.order = [{
          column: columnName,
          dir: this.filter.sortOrder
        }]
      }
      else{
        params.order = null;
      }
    })
  }
    else {
      params.order = null;
    }
    params.search = searchData;

    return params;
  }

    onInit() {
		
		this.initSearchForm();

		this.initFilterForm();
		   this.tableConfig.children = this.appUtilBaseService.formatTableConfig(this.tableConfig.children);
    this.tableFieldConfig = this.appUtilBaseService.formatTableFieldConfig(this.tableConfig.children);
    this.loadGridData();
    this.disablechildAction();
    this.updateActions();
    const params =  this.assignTableParams();
    this.toShowRecords(params);
    this.gridConfig = this.getGridConfig();
    this.selectedColumns = this.gridConfig.columns;
    this.actionButtonEnableDisable();
    }
	
     onDestroy() {
		
		
        this.subscriptions.forEach((subs: { unsubscribe: () => void; }) => subs.unsubscribe());
    }
     onAfterViewInit() {
		
    }
    
    onChanges(changes:any) {
		
		if (changes.mapData && changes.mapData.previousValue &&
      JSON.stringify(changes.mapData.previousValue) !== JSON.stringify(changes.mapData.currentValue)
        && this.shouldRefresh(changes.mapData.previousValue, changes.mapData.currentValue)) {
      console.log('data')
      // Parent form value has changed, update the grid
      this.onRefresh();
    }
  
	}
}
