import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from '../shared/common.service';
import { LanguageService } from '../shared/service/language.service';
import { Item } from '../shared/models/item';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

// import APIs of BS Management @2024/03/19 Add 
import { apiForBSMgmt } from '../shared/api/For_BS';

// 引入儲存各個資訊所需的 interfaces @2024/03/19 Add 
import { BSList, Basestation } from '../shared/interfaces/BS/For_queryBsList';

// 引入所需 Local Files @2024/03/19 Add 
import { localBSList } from '../shared/local-files/BS/For_queryBsList';

export interface ComponentLists {
  components: Components[];
}

export interface Components {
  id: string;
  bsId: string;
  bsName: string;
  name: string;
  ip: string;
  port: string;
  account: string;
  key: string;
  comtype: number;
  firm: string;
  modelname: string;
  status: number;
}

export interface SoftwareLists {
  uploadinfos: Uploadinfos[];
}

export interface Uploadinfos {
  id: string;
  firm: string;
  modelname: string;
  uploadtime: string;
  uploadtype: number;
  uploadversion: string;
  description: string;
  uploadinfo: string;
  uploadurl: string;
}

@Component({
  selector: 'app-bs-management',
  templateUrl: './bs-management.component.html',
  styleUrls: ['./bs-management.component.scss'],
})
export class BSManagementComponent implements OnInit {
  sessionId: string = '';
  softwareLists: SoftwareLists = {} as SoftwareLists;
  componentList: ComponentLists = {} as ComponentLists;
  @ViewChild('createBSModal') createBSModal: any;
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('provisionModal') provisionModal: any;
  @ViewChild('advancedModal') advancedModal: any;
  advancedModalRef!: MatDialogRef<any>;
  advancedForm!: FormGroup;
  afterAdvancedForm!: FormGroup;
  refreshTimeout!: any;
  isSettingAdvanced = true;
  createModalRef!: MatDialogRef<any>;
  deleteModalRef!: MatDialogRef<any>;
  provisionModalRef!: MatDialogRef<any>;
  createForm!: FormGroup;
  provisionForm!: FormGroup;
  selectSoftware!: Uploadinfos;
  selectBS!: Components;
  BSstatus: number=-1;
  nfTypeList: string[] = ['CU', 'DU', 'CU+DU'];
  file: any;
  typeMap: Map<number, string> = new Map();
  p: number = 1;            // 當前頁數
  pageSize: number = 10;    // 每頁幾筆
  totalItems: number = 0;   // 總筆數
  fileMsg: string = '';
  formValidated = false;
  searchForm!: FormGroup;
  afterSearchForm!: FormGroup;
  updateForm!: FormGroup;
  isSearch: boolean = false;
  querySoftwareScpt!: Subscription;
  querySWAdvanceSearchScpt!: Subscription;

  comtype: Item[] = [
    { displayName: 'CU', value: '1' },
    { displayName: `DU`, value: '2' },
    { displayName: `CU+DU+RU`, value: '3' }
  ];

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private  commonService: CommonService,
    public languageService: LanguageService,

    public  API_BS: apiForBSMgmt,           // @2024/03/19 Add for import API of BS Management
    
    public  bsList_LocalFiles: localBSList, // @2024/03/19 Add for import BS List Local Files 

  ) {
    this.comtype.forEach((row) => this.typeMap.set(Number(row.value), row.displayName));
    this.createSearchForm();
    this.createAdvancedForm();
  }

  ngOnInit(): void {
    this.sessionId = this.commonService.getSessionId();
    this.afterSearchForm = _.cloneDeep(this.searchForm);

    this.getQueryBsList(); // @2024/03/19 Add for getting BS List
  }

  ngOnDestroy() {
    clearTimeout(this.refreshTimeout);
    if (this.querySoftwareScpt) this.querySoftwareScpt.unsubscribe();
    if (this.querySWAdvanceSearchScpt) this.querySWAdvanceSearchScpt.unsubscribe();
  }



  bsList: BSList = {} as BSList;   // @2024/03/19 Add
  isGetQueryBsListLoading = false; // 用於表示加載 BS List 的 flag，初始設置為 false @2024/03/19 Add for Progress Spinner

  // @2024/03/19 Add
  // Get the BS List in the O1 System
  getQueryBsList() {
    console.log( 'getQueryBsList() - Start' );       // getQueryBsList() 啟動 
    console.log( 'Start fetching info of Bs List' ); // 開始獲取 BS List 資訊
    clearTimeout( this.refreshTimeout );

    this.isGetQueryBsListLoading = true; // 開始顯示 Spinner 表載入 BS List 數據中

    // 檢查是否為 local 環境
    if ( this.commonService.isLocal ) { 

      // For testing with local files
      console.log( 'Start fetching BS List in Local' ); // 開始獲取 Local BS List 資訊

      // 模擬從 Local files 獲取數據並初始化 selected 屬性
      this.bsList = this.bsList_LocalFiles.bsList_local;
      this.queryBsListDeal();
      console.log( 'BS List in Local:', this.bsList );
      
      this.isGetQueryBsListLoading = false; // 加載完成，隱藏 spinner

    } else {
      console.log('Start fetching BS List from API'); // 開始獲取 BS List 資訊

      // Use API_BS's queryBsList() to make an HTTP GET request
      this.API_BS.queryBsList().subscribe({
        next: ( res: BSList ) => {

          this.bsList = res;
          this.queryBsListDeal();
          console.log( '基站列表資訊\n( BS List ):', this.bsList ); // 取得的 BS List 資訊 ( Obtained BS List information )
          
          this.isGetQueryBsListLoading = false; // 取得後隱藏 spinner
        },
        error: ( error ) => {
          console.error( '獲取基站列表資訊出錯:', error );
          console.error( 'Error fetching - BS List:', error );
          this.isGetQueryBsListLoading = false; // 出錯時也應隱藏 spinner
        },
        complete: () => {
          console.log('基站列表資訊獲取完成');
          console.log( 'BS List - fetch completed' );
        }
      });
    }

    console.log( 'getQueryBsList() - End' ); // getQueryBsList() end
  }

  queryBsListDeal() {
    this.totalItems = this.bsList.basestation.length;
  }



  createSearchForm() {
    const nowTime = this.commonService.getNowTime();
    this.searchForm = this.fb.group({
      'firm': new FormControl(''),
      'model': new FormControl(''),
      'uploadtype': new FormControl('All'),
      'version': new FormControl(''),
      'fileName': new FormControl(''),
    });
  }
  openCreateModal() {
    this.formValidated = false;
    this.createForm = this.fb.group({
      'name': new FormControl('', [Validators.required]),
      'ip': new FormControl('', [Validators.required]),
      'mac': new FormControl('', [Validators.required]),
      'comtype': new FormControl('', [Validators.required]),
      'port': new FormControl('', [Validators.required]),
      'account': new FormControl('', [Validators.required]),
      'key': new FormControl('', [Validators.required]),
      'firm': new FormControl('', [Validators.required]),
      'modelname': new FormControl('', [Validators.required]),
      'sessionid': this.sessionId
    });
    this.createModalRef = this.dialog.open(this.createBSModal, { id: 'createBSModal' });
    this.createModalRef.afterClosed().subscribe(() => {
      this.fileMsg = '';
      this.formValidated = false;
    });
  }

  fileChange(e: any) {
    // console.log(e);
    this.fileMsg = '';
    let passFile = null;
    const files = e.target.files;
    if ('0' in files) {
      if (files[0].name.indexOf('.zip') >= 0 || files[0].name.indexOf('.tar') >= 0) {
        passFile = files[0];
      } else {
        this.fileMsg = '格式只允許[file].zip 和.tar';
      }
    }
    if (passFile === null) {
      this.file = null;
      this.provisionForm.controls['fileName'].setValue('');
    } else {
      this.file = files[0];
      this.provisionForm.controls['fileName'].setValue(files[0].name);
    }
    // console.log(files);
  }
  

  create() {
    this.formValidated = true;
    if (!this.createForm.valid) {
      return;
    }
    if (this.commonService.isLocal) {
      /* local file test */
      this.commonService.componentList.components.push(
        {
          id: "0f03212c522b4c86abda",
          bsId: "8e427f7c5ff34326a380",
          bsName: "itri_10.0.2.10",
          name: "itri_10.0.2.10",
          ip: "10.0.2.10",
          port: "830",
          account: "k200",
          key: "k200123",
          comtype: 2,
          firm: "ITRI",
          modelname: "v2.0",
          status: 1
        }
      );
      this.createModalRef.close();

    } else {
      const body = this.createForm.value;
      if (this.createForm.controls['uploadtype'].value === 'CU') {
        body['uploadtype'] = 1;
      } else if (this.createForm.controls['uploadtype'].value === 'DU') {
        body['uploadtype'] = 2;
      } else if (this.createForm.controls['uploadtype'].value === 'CU+DU+RU') {
        body['uploadtype'] = 3;
      } else {
        body['uploadtype'] = 0;
      }
      body['sessionid'] = this.sessionId;
      this.commonService.createBsComponent(body).subscribe(
        res => {
          console.log('createBsComponent:');
          console.log(res);
          this.createModalRef.close();
        }
      );
    }
  }

  openDeleteModal( BS: Basestation ) {
    this.deleteModalRef = this.dialog.open(this.deleteModal, { id: 'deleteModal' });
  }

  openProvisionModal(BSList: Components) {
    this.formValidated = false;
    this.provisionForm = this.fb.group({
      'fileName': new FormControl('', [Validators.required])
    });
    this.selectBS = BSList;
    this.provisionModalRef = this.dialog.open(this.provisionModal, { id: 'provisionModal' });
    this.provisionModalRef.afterClosed().subscribe(() => {
      this.fileMsg = '';
      this.formValidated = false;
    });
  }

  delete() {
    if (this.commonService.isLocal) {
      /* local file test */
      for (let i = 0; i < this.commonService.componentList.components.length; i++) {
        if (this.selectBS.id === this.commonService.componentList.components[i].id) {
          this.commonService.componentList.components.splice(i, 1);
          break;
        }
      }
      this.deleteModalRef.close();
    } else {
      this.commonService.deleteSoftware(this.selectBS.id).subscribe(
        res => {
          this.deleteModalRef.close();
        }
      );
    }
  }
  changeType(e: MatButtonToggleChange) {
    this.formValidated = false;
    if (e.value === 'imageUrl') {
      this.updateForm.controls['imageUrl'].setValidators([Validators.required]);
      this.updateForm.controls['fileName'].setValidators(null);
      this.updateForm.controls['fileName'].setValue('');
    } else {
      this.updateForm.controls['imageUrl'].setValidators(null);
      this.updateForm.controls['imageUrl'].setValue('');
      this.updateForm.controls['fileName'].setValidators([Validators.required]);
    }
    this.updateForm.controls['imageUrl'].updateValueAndValidity();
    this.updateForm.controls['fileName'].updateValueAndValidity();
  }

  createAdvancedForm() {
    this.advancedForm = this.fb.group({
      'firm': new FormControl(''),
      'model': new FormControl(''),
      'uploadtype': new FormControl(''),
      'version': new FormControl(''),
      'from': new FormControl(''),
      'to': new FormControl(''),
      'fileName': new FormControl('')
    });
  }
  openAdvancedModal() {
    const orgAdvancedForm = _.cloneDeep(this.advancedForm);
    this.advancedForm.controls['firm'].setValue(this.searchForm.controls['firm'].value);
    this.advancedForm.controls['model'].setValue(this.searchForm.controls['model'].value);
    this.advancedForm.controls['uploadtype'].setValue(this.searchForm.controls['uploadtype'].value);
    this.advancedForm.controls['fileName'].setValue(this.searchForm.controls['fileName'].value);
    this.advancedModalRef = this.dialog.open(this.advancedModal, { id: 'faultAdvancedModal' });
    this.advancedModalRef.afterClosed().subscribe((result) => {
      if (result === 'OK') {
        this.isSettingAdvanced = true;
        this.isSearch = true;
        this.searchForm.controls['firm'].setValue(this.advancedForm.controls['firm'].value);
        this.searchForm.controls['model'].setValue(this.advancedForm.controls['model'].value);
        this.searchForm.controls['uploadtype'].setValue(this.advancedForm.controls['uploadtype'].value);
        this.searchForm.controls['fileName'].setValue(this.advancedForm.controls['fileName'].value);
        this.afterAdvancedForm = _.cloneDeep(this.advancedForm);
        this.afterSearchForm = _.cloneDeep(this.advancedForm);
        this.p = 1;
        this.getFMAdvanceSearch();
      } else {
        this.advancedForm = orgAdvancedForm;
      }
    });
  }

  getFMAdvanceSearch() {
    const firm = this.afterAdvancedForm.controls['firm'].value;
    const model = encodeURIComponent(this.afterAdvancedForm.controls['model'].value);
    const uploadtype = this.afterAdvancedForm.controls['uploadtype'].value;
    const start = this.commonService.dealPostDate(this.afterAdvancedForm.controls['from'].value);
    const end = this.commonService.dealPostDate(this.afterAdvancedForm.controls['to'].value);
    const fileName = this.afterAdvancedForm.controls['fileName'].value;
    const offset = (this.p - 1) * this.pageSize;
    console.log('getFMAdvanceSearch:');
    console.log(`firm=${firm}, model=${model}, start=${start}, end=${end}, fileName=${fileName}, offset=${offset}`);
    console.log(`uploadtype=${uploadtype}`);
    clearTimeout(this.refreshTimeout);
    if (this.commonService.isLocal) {
      /* local file test */
      this.softwareLists = this.commonService.softwareLists;
      console.log(this.softwareLists);
      this.queryBsListDeal();
    } else {
      const firm = this.afterAdvancedForm.controls['firm'].value;
      const model = encodeURIComponent(this.afterAdvancedForm.controls['model'].value);
      const fileName = this.afterAdvancedForm.controls['fileName'].value;
      const uploadtype = this.afterAdvancedForm.controls['uploadtype'].value;
      const start = this.commonService.dealPostDate(this.afterAdvancedForm.controls['from'].value);
      const end = this.commonService.dealPostDate(this.afterAdvancedForm.controls['to'].value);
      const offset = (this.p - 1) * this.pageSize;
      const limit = 10;
      if (this.querySWAdvanceSearchScpt) this.querySWAdvanceSearchScpt.unsubscribe();
      this.querySWAdvanceSearchScpt = this.commonService.querySoftwareAdvanceSearch(firm, model, fileName, start, end, offset, limit).subscribe(
        res => {
          console.log('getFMAdvanceSearch:');
          console.log(res);
          const str = JSON.stringify(res);//convert array to string
          this.softwareLists = JSON.parse(str);
        }
      );
     }
  }

  typeText(type: number): string {
    return this.typeMap.get(type) as string;
  }

  pageChanged(page: number) {
    this.p = page;
  }

  search() {
  }

  debug() {
    const body = this.createForm.value;
    if (this.createForm.controls['uploadtype'].value === 'CU') {
      body['uploadtype'] = 1;
    } else if (this.createForm.controls['uploadtype'].value === 'DU') {
      body['uploadtype'] = 2;
    } else if (this.createForm.controls['uploadtype'].value === 'CU+DU') {
      body['uploadtype'] = 3;
    } else {
      body['uploadtype'] = 0;
    }
    body['sessionid'] = this.sessionId;
    console.log(body);
  }

  viewPage( BS: Basestation ) {
    this.router.navigate( ['/main/bs-mgr/info', BS.id, BS.fieldName] );
  }

  clearSetting() {
    this.isSearch = false;
    this.createSearchForm();
    this.createAdvancedForm();
    this.afterSearchForm = _.cloneDeep(this.searchForm);
  }

}
