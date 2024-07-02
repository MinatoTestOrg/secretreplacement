import { Component, Directive, Renderer2, SecurityContext, ViewChild, inject } from '@angular/core';
import { AppConstants } from '@app/app-constants';
import { Subscription } from 'rxjs';
import { ClientMappingBase } from '../client-mapping.base.model';
import { environment } from '@env/environment';
// import { GridComponent } from '@libsrc/grid/grid.component';
import { FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { AppUtilBaseService } from '@baseapp/app-util.base.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AppGlobalService } from '@baseapp/app-global.service';
import { ClientMappingApiConstants } from '../client-mapping.api-constants';
import { ClientMappingBaseService } from '../client-mapping.base.service';
import { BaseService } from '@baseapp/base.service';
import { ClientDetailComponent } from '../client-detail/client-detail.component';
import { GridComponent } from '@baseapp/widgets/grid/grid.component';

@Directive({})



export class ClientMappingBaseComponent{
  errId: any;
	quickFilter: any;
  hiddenFields:any = {};
  quickFilterFieldConfig:any={}
	isSearchFocused:boolean = false;
  showBreadcrumb = AppConstants.showBreadcrumb;
	
showAdvancedSearch: boolean = false;
detPopupOpen : boolean = false;

tableSearchFieldConfig:any = {};
params: any;
isMobile: boolean = AppConstants.isMobile;
displayErrorDet: boolean = false;
displayImport: boolean = false;
popupOpen : boolean = false;

  
gridData: ClientMappingBase[] = [];
totalRecords: number = 0;
subscriptions: Subscription[] = [];
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
localStorageStateKey = "client-mapping";
showMenu: boolean = false;
conditionalActions:any ={
  disableActions:[],
  hideActions:[]
}
actionBarConfig:any =[];
updatedRecords:ClientMappingBase[] = [];
showPaginationOnTop = AppConstants.showPaginationonTop;
 showPaginationOnBottom = AppConstants.showPaginationonBottom;
 tableFieldConfig:any ={};
dateFormat: string = AppConstants.calDateFormat;
selectedRowId: any = '';
 showWorkflowSimulator:boolean = false;
 gridConfig: any = {};
  @ViewChild(GridComponent)
  private gridComponent: any = GridComponent;
separator = ".";
	isChildPage:boolean = false;
	detailDisplay:boolean = false;

	
	leftActionBarConfig : any = {
  "children" : [ ],
  "columns" : "2",
  "type" : "tableSearch",
  "showAdvancedSearch" : true
}
	quickFilterConfig : any = { }
	customRenderConfig : any = {
  "children" : [
    {
      "fieldName":"authenticationMode",
    render:(data: any, type: any, row: any, meta: any) => {return this.userContextCustomCheck(data,row);}
    },

    {
      "fieldName":"editbtn",
    render:(data: any, type: any, row: any, meta: any) => {return this.editRender(data,row);}
    }
     ]
}
tableConfig : any = {
  "recordSelection" : "none",
  "striped" : true,
  "rightFreezeFromColumn" : "0",
  "viewAs" : "list",
  "hoverStyle" : "box",
  "tableStyle" : "style_2",
  "type" : "grid",
  "showDetailPageAs" : "navigate_to_new_page",
  "leftFreezeUptoColumn" : "2",
  "pageLimit" : "50",
  "children" : [ {
    "label" : "FROM_APP",
    "data" : "",
    "field" : "producer",
    "type" : "gridColumn",
    "width" : "150px",
    "showOnMobile" : "true",
    "labelPosition" : "top",
    "fieldType" : "string",
    "multipleValues" : false,
    "fieldId" : "producer",
    "timeOnly" : false,
    "uiType" : "text",
    "name" : "producer",
    "fieldName" : "producer"
  },
  {
    "label" : "TO_APP",
    "data" : "",
    "field" : "consumer",
    "type" : "gridColumn",
    "width" : "150px",
    "showOnMobile" : "true",
    "labelPosition" : "top",
    "fieldType" : "string",
    "multipleValues" : false,
    "fieldId" : "consumer",
    "timeOnly" : false,
    "uiType" : "text",
    "name" : "consumer",
    "fieldName" : "consumer"
  },  
  {
    "label" : "SERVICE_ACCOUNT_MAIL",
    "data" : "",
    "field" : "saEmail",
    "type" : "gridColumn",
    "width" : "150px",
    "showOnMobile" : "true",
    "labelPosition" : "top",
    "fieldType" : "string",
    "multipleValues" : false,
    "fieldId" : "saEmail",
    "timeOnly" : false,
    "uiType" : "text",
    "name" : "saEmail",
    "fieldName" : "saEmail"
  },  
  {
    "label" : "USER_CONTEXT_REQUIRED",
    "data" : "",
    "field" : "authenticationMode",
    "type" : "gridColumn",
    "width" : "150px",
    "showOnMobile" : "true",
    "labelPosition" : "top",
    "fieldType" : "boolean",
    "multipleValues" : false,
    "fieldId" : "authenticationMode",
    "timeOnly" : false,
    "uiType" : "text",
    "name" : "authenticationMode",
    "skipSanitize" : true,
    "fieldName" : "authenticationMode"
  },
  {
    "label" : " ",
    "data" : "",
    "field" : "editbtn",
    "type" : "gridColumn",
    "width" : "10px",
    "showOnMobile" : "true",
    "labelPosition" : "top",
    "fieldType" : "boolean",
    "multipleValues" : false,
    "fieldId" : "editbtn",
    "timeOnly" : false,
    "uiType" : "text",
    "name" : "editbtn",
    "skipSanitize" : true,
    "fieldName" : "editbtn"
  }
],
  "sorting" : "single_column",
  "sortField" : "createdDate",
  "sortOrder" : "desc",
  "showSettingsIcon" : "false",
  "detailPageNavigation" : "click_of_the_row",
  "rowSpacing" : "medium",
  "rowHeight" : "medium"
}

	pageViewTitle: string = 'CLIENT_MAPPING';
  public showLoading = false;
	
		tableSearchControls : UntypedFormGroup = new UntypedFormGroup({
      producer: new UntypedFormControl('',[]),
      consumer: new UntypedFormControl('',[]),
      saEmail: new UntypedFormControl('',[]),
      authenticationMode: new UntypedFormControl('',[]),

});

	public clientMappingService = inject(ClientMappingBaseService);
public appUtilBaseService = inject(AppUtilBaseService);
public translateService = inject(TranslateService);
public messageService = inject(MessageService);
public confirmationService = inject(ConfirmationService);
public dialogService = inject(DialogService);
public domSanitizer = inject(DomSanitizer);
public activatedRoute = inject(ActivatedRoute);
public renderer2 = inject(Renderer2);
public router = inject(Router);
public appGlobalService = inject(AppGlobalService);
public baseService = inject(BaseService)
  filter: any;
  confirmationReference:any;
  displayMailEdit: boolean = false;
  currentRowId: any;
	
  editRender(data:any,row:any){
    return ` <i class="fas fa-edit" #mailediticon></i>`  
  }
  
	userContextCustomCheck(data:any,row:any){
    if (data =="USER"){
      return `<i class="fa fa-check" aria-hidden="true"></i>`;
    }
    else{
      return `<i class="fa-solid fa-x"></i>`;
    }
  }


	loadGridData() {
    let gridSubscription: any;
    if (environment.prototype) {
      gridSubscription = this.clientMappingService.getProtoTypingData().subscribe((data: any) => {
        this.gridData = [...this.gridData, ...data];
        this.isPageLoading = false;
      });
    }
    else {
      this.gridData = []
    }
}
	clearFilterValues() {
  this.tableSearchControls.reset();
  this.filter.advancedSearch = {};
  this.onRefresh();
}
	onRefresh(): void {
    const params = this.assignTableParams();
    setTimeout(() => {
      this.gridComponent.refreshGrid(params,false);
  }, 500);
  }

	onRowClickEvent(id: any,event?:any) {
    if (event.target.classList[0] =='editbtn' || event.target.classList[0] =='fas' )
    {
      this.confirmationReference= this.dialogService.open(ClientDetailComponent, {
        header: 'Client Service Mapping Detail',
        width: '30%',
        contentStyle: { "max-height": "500px", "overflow": "auto" },
        styleClass: "confirm-popup-container",
        data: {
          id: id,
          event: event
        }
      });
    }
    this.confirmationReference.onClose.subscribe((result: any) => {
      if (result === "saved") {
      this.onRefresh();
      }
    })
}

	clearAllFilters() {
  this.filter.globalSearch = '';
  this.clearFilterValues();
}

	actionBarAction(btn: any) {
    const methodName: any = (`on` + btn.action.charAt(0).toUpperCase() + btn.action.slice(1));
    let action: Exclude<keyof ClientMappingBaseComponent, ' '> = methodName;
    if (btn.action === 'navigate_to_page' && btn.pageName?.url) {
      this.router.navigateByUrl(btn.pageName.url);
    }
  }


clearFilters(){
  this.filter.globalSearch = '';
  this.isSearchFocused = false;
}


	getSearchData(searchFields: any, config: any) {
    const importStatuses = ["FILE_UPLOADED", "VALIDATION_TASK_CREATED", "VALIDATION_IS_IN_PROGRESS", "TEMPLATE_VALIDATED"];
        let searchData: any = {}
        for (const key in searchFields) {
            if (searchFields.hasOwnProperty(key) && searchFields[key]?.toString().length) {
                if (this.selectedItems.hasOwnProperty(key)) {
                    let lookupObj: any = [];
                    if (config[key].multiple) {
                        this.selectedItems[key].map((o: any) => lookupObj.push(o.id));
                    }
                    searchData[`${key}.id`] = config[key].multiple ? lookupObj : this.selectedItems[key][0].id;
                }
                else if (key == 'importStatus' && searchFields[key].includes("IN_PROGRESS")) {
                  const index = searchFields[key].indexOf("IN_PROGRESS");
                  if (index > -1) {
                    searchFields[key].splice(index, 1);
                  }
                  searchData[key] = [...searchFields[key], ...importStatuses];
                }
                else {
                    searchData[key] = searchFields[key];
                }
            }
        }
        return searchData;
    }

 assignTableParams() {
    const params: any = {};
    params.order = null;
    params.search = {};
    return params;
  }
 updateActions() {
        this.actionBarConfig = this.appUtilBaseService.getActionsConfig(this.leftActionBarConfig.children);
        this.actionBarConfig.forEach((actionConfig: any) => {
            if (actionConfig.visibility === 'conditional' && actionConfig.conditionForButtonVisiblity) {
                const conResult = this.appUtilBaseService.evaluvateCondition(actionConfig.conditionForButtonVisiblity?.query?.rules, actionConfig.conditionForButtonVisiblity?.query?.condition);
                this.validateActions(actionConfig.action, conResult, 'view');
            }
            if (actionConfig.buttonEnabled === 'conditional' && actionConfig.conditionForButtonEnable) {
                const conResult = this.appUtilBaseService.evaluvateCondition(actionConfig.conditionForButtonEnable?.query?.rules, actionConfig.conditionForButtonEnable?.query?.condition);
                this.validateActions(actionConfig.action, conResult, 'edit');
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

  getGridConfig() {
    const self = this
    return {
      data: this.gridData,
      columns: this.getColumns(),
      ajaxUrl: ClientMappingApiConstants.getDatatableData,
      select: false,
      colReorder: (String(this.tableConfig?.columnReorder)?.toLowerCase() === 'true'),
      detailPageNavigation: (this.tableConfig?.detailPageNavigation?.toLowerCase() == 'click_of_the_row' ? 'row_click' : (this.tableConfig?.detailPageNavigation?.toLowerCase() == 'click_on_navigate_icon' ? 'row_edit' : '')),
      toggleColumns: (String(this.tableConfig?.toggleColumns)?.toLowerCase() === 'true'),
      paging: false,
      scrollX: true,
      showSettingsIcon: false,
      scrollCollapse: true,
      pageLength: parseInt(String(this.tableConfig?.pageLimit)),
      deferRender: true,
      ordering: true,
      sortField: this.tableConfig.sortField,
      sortOrder: this.tableConfig.sortOrder,
      colResize: (String(this.tableConfig?.columnResize)?.toLowerCase() === 'true'),
      disableSelection: (this.tableConfig?.recordSelection?.toLowerCase() == 'none' ? true : false),
      recordSelection: (this.tableConfig?.recordSelection?.toLowerCase() == 'multiple_records' ? 'multi' : (this.tableConfig?.recordSelection?.toLowerCase() == 'single_record_only' ? 'single' : '')),
      bFilter: false,
      enterKeytoSearch: false,
      showGridlines:this.tableConfig.showGridlines,
      striped:this.tableConfig.striped,
      rowSpacing:this.tableConfig.rowSpacing,
      rowHeight:this.tableConfig.rowHeight,
      rowGrouping: jQuery.isEmptyObject(this.tableConfig?.groupOnColumn) ? '' : this.tableConfig?.groupOnColumn?.name,
      sortSeparator:this.separator,
      fixedColumns: {
        left: parseInt(String(this.tableConfig?.leftFreezeUptoColumn || '0') ),
        right: parseInt(String(this.tableConfig?.rightFreezeFromColumn || '0') )
      },
     isChildPage: this.isChildPage,
      parentId: false,
      uniqueIdentifier:this.tableConfig?.uniqueIdentifier|| null,
      onRowClick: (event: any, id: string) => {
        this.onRowClickEvent(id, event);

      },
    };

  }

  getColumns() {
   const json1 = this.tableConfig.children ||[];
    const json2 = this.customRenderConfig.children ||[];
    let merged = [];
    for (let i = 0; i < json1.length; i++) {
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

	onKeydown(event: any) {
  if (event.which === 13 || event.keyCode === 13) {
    // this.filter.globalSearch = this.globalSearch
   this.onRefresh();
  }
}
	clearGlobalSearch(){
  // this.filter.globalSearch = '';
  this.onRefresh();
}

    onInit() {
    this.setupCall();
    this.tableConfig.children = this.appUtilBaseService.formatTableConfig(this.tableConfig.children);
    this.tableFieldConfig = this.appUtilBaseService.formatTableFieldConfig(this.tableConfig.children);
    
    this.updateActions();
    this.gridConfig = this.getGridConfig();

    }

    setupCall(){
      if(!environment.prototype){
        this.clientMappingService.setupCall({}).subscribe((res: any) => {
          if(res){
            this.loadGridData();
          }     
        });
      }
      else{
        this.loadGridData();
      }

    }

	
     onDestroy() {
        this.subscriptions.forEach((subs: { unsubscribe: () => void; }) => subs.unsubscribe());
    }
     onAfterViewInit() {
    }

    getValue(formControl: FormGroup, ele: string) {
      const parent = ele.split('?.')[0];
      if (formControl.controls[parent] instanceof FormGroup) {
        const child = ele.split('?.')[1];
        return formControl.controls[parent].value[child];
      }
      else
        return formControl.controls[parent].value;
    }
  
}