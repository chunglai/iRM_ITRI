//import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CommonService } from '../shared/common.service';
import { LanguageService } from '../shared/service/language.service';

// @2024/01/29 Add for import APIs of Field Management 
import { apiForField } from '../shared/api/For_Field';

// @2024/01/29 Add for import interfaces of Field Management 
import { FieldList, Fields } from '../shared/interfaces/Field/For_queryFieldList';

// @2024/01/29 Add for import local files of Field Management 
import { localFieldList } from '../shared/local-files/Field/For_queryFieldList';

@Component({
  selector: 'app-field-management',
  templateUrl: './field-management.component.html',
  styleUrls: ['./field-management.component.scss']
})

export class FieldManagementComponent implements OnInit, OnDestroy {

  fieldList: FieldList = {} as FieldList; // @11/30 Add by yuchen
  ueNum: string = '0';                    // @11/30 Add by yuchen
  selectField!: Fields;                   // @11/30 Add by yuchen

  @ViewChild('createModal') createModal: any;
  createModalRef!: MatDialogRef<any>;

  refreshTimeout!: any;
  refreshTime: number = 5;

  createForm!: FormGroup;
  levelMap: Map<string, number> = new Map();

  p: number = 1;            // 當前頁數
  pageSize: number = 10;    // 每頁幾筆
  totalItems: number = 0;   // 總筆數
  nullList: string[] = [];  // 給頁籤套件使用
  formValidated = false;
  
  isLoading = true; // 加載狀態的標誌，初始設置為 true @12/28 Add for Progress Spinner

  // queryFieldList 用於管理 HTTP 的訂閱請求，'!' 確保在使用前已賦值。
  queryFieldList!: Subscription;  // @11/30 Add by yuchen

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private commonService: CommonService,
    public API_Field: apiForField,        // @2024/01/29 Add for import API of Field Management 
    
    public fieldList_LocalFiles: localFieldList, // @2024/01/29 Add for import Field List Local Files

    //private http: HttpClient,
    private fb: FormBuilder,
    public languageService: LanguageService
  ) {
    this.levelMap.set('Deploy MaaS', 1);
    this.levelMap.set('Register VM on MaaS', 2);
    this.levelMap.set('Commission VM', 3);
    this.levelMap.set('Deploy Machines', 4);
    this.levelMap.set('Set Environment for k8s', 5);
    this.levelMap.set('Create k8s clusters', 6);
    this.levelMap.set('Deploy Node-Agent on each node', 7);
    this.levelMap.set('Deploy IMS', 8);
    this.levelMap.set('Running', 9);
    this.levelMap.set('Failed Deployment', 10);
  }

  sessionId: string = ''; // 宣告 sessionId 屬於字串型態
  /**
   * 當 Component 初始化完成後執行的 Lifecycle Hook。
   * 主要用於設定 Component 的初始狀態，包括預設的 Log 類型、sessionId、以及設定路由參數相關的應對處理。
   */
  ngOnInit(): void {
    this.sessionId = this.commonService.getSessionId();
    // Field Summary
    this.getQueryFieldList();
  }

  // 銷毀 Component 時的清理工作
  ngOnDestroy() {
    clearTimeout( this.refreshTimeout );

    // 如存在對 FieldSummaryInfo 的 API 請求訂閱，則取消訂閱以避免內存洩漏
    if ( this.queryFieldList ) this.queryFieldList.unsubscribe();
  }

  // @2024/01/29 Update by yuchen
  getQueryFieldList() {
    console.log('getQueryFieldList() - Start');
    this.isLoading = true;        // 開始加載數據時設置為 true @12/28 Add for Progress Spinner 

    clearTimeout( this.refreshTimeout );
  
    if ( this.commonService.isLocal ) {

      // 本地模式使用本地數據
      this.fieldList = this.fieldList_LocalFiles.fieldList;
      this.FieldListDeal();
      this.isLoading = false;     // 數據加載完成，設置為 false @12/28 Add for Progress Spinner
      
    } else {

      // 使用 API_Field 中的 queryFieldList() 發起 HTTP GET 請求
      this.API_Field.queryFieldList().subscribe({
        next: (res) => {

          console.log('getQueryFieldList:', res);
          this.fieldList = res;
          this.FieldListDeal();

        },
        error: (error) => {

          console.error('Error fetching field info:', error);
          this.isLoading = false; // 發生錯誤時也要設置為 false @12/28 Add for Progress Spinner

        },
        complete: () => {

          console.log('Field info fetch completed');
          this.isLoading = false; // 加載完成 @12/28 Add for Progress Spinner

        }
      });
    }
  }

  // @11/30 Add by yuchen
  FieldListDeal() {

    // 輸出檢查點
    console.log('Field list length:', this.fieldList.fields?.length);

    // 計算 fields 數組中元素的數量，即場域的總數
    //this.totalItems = this.fieldList.fields.length;
    this.totalItems = this.fieldList.fields?.length || 0;  // 使用可選鏈和空值合併運算符來避免 undefined 或 null
    console.log('Total items:', this.totalItems);
    
    // 定義一個空陣列，長度等於場域的總數
    this.nullList = new Array( this.totalItems );
  
    // 使用 setTimeout 設定一個定時刷新
    this.refreshTimeout = window.setTimeout(() => {
      if (this.p === 1) {
        console.log(`page[${this.p}] ===> refresh.`);
        //this.getQueryFieldList();  // 取得場域訊息函數
      } else {
        console.log(`page[${this.p}] ===> no refresh.`);
      }
    }, 100); // timeout: 100 ms
  }
  
  // @12/05 Update by yuchen
  viewFieldDetail(fields: Fields) {
    this.selectField = fields;
    console.log("View Detail of the field id:", this.selectField.id, "and the field name: ", this.selectField.name);
    this.router.navigate(['/main/field-mgr/info', this.selectField.id, this.selectField.name]);
  }
  
  
  // @12/01 Update by yuchen
  viewFieldAlarm(fields: Fields) {
    this.selectField = fields;
    console.log("Selected alarm field name: ", this.selectField.name);
    this.router.navigate(['/main/fault-mgr', this.selectField.name, 'All']);
  }

  @ViewChild('deleteField_ConfirmWindow') deleteField_ConfirmWindow: any;
  deleteField_ConfirmWindowRef!: MatDialogRef<any>;

  // @2024/01/29 Update by yuchen
  // 根據用戶的選擇開啟刪除場域的對話框
  openDeleteField_ConfirmWindow( fields: Fields ) {
    this.selectField = fields;
    console.log( "Deleted field name: ", this.selectField.name );

    // 開啟刪除確認模態框
    this.deleteField_ConfirmWindowRef = this.dialog.open( this.deleteField_ConfirmWindow, { id: 'deleteField_ConfirmWindow' } );

    // 訂閱視窗關閉後的事件
    this.deleteField_ConfirmWindowRef.afterClosed().subscribe( confirm => {});
  }

  // @2024/01/29 Add by yuchen
  confirmDeleteField(){
    // 顯示加載指示器
    this.isLoading = true;

    // 如果是 Local 環境，則設置標誌並返回
    if ( this.commonService.isLocal ) {
      console.log('Remove field in local environment.');

      // 處理 Local 環境下的場域刪除邏輯 ( Local 依據 name 控制刪除 )
      this.deleteFieldInLocal( this.selectField.name );

      // 刷新場域列表或進行其他更新
      this.getQueryFieldList();
      this.isLoading = false;

    } else {
            
      // 調用 API 進行場域刪除
      this.API_Field.removeField( this.selectField.id ).subscribe({
        next: ( response ) => {
          // 處理場域刪除成功的邏輯
          console.log( 'Field removed successfully', response );

          // 刷新場域列表或進行其他更新
          this.getQueryFieldList();
          this.isLoading = false;
        },
        error: ( error ) => {
          console.error( 'Failed to remove field:', error );
          this.isLoading = false;
        },
        complete: () => {
          // 在任何情況下，完成後都需要停止加載指示器
          this.isLoading = false;
        }
      });   
    }
  }

  // @2024/01/29 Add by yuchen
  // 模擬在 Local 環境中刪除場域的函數 ( Local 依據 name 控制刪除 )
  deleteFieldInLocal( fieldName: string ) {

    console.log( "The delete field name:", fieldName )

    // 確保 fieldList_LocalFiles.fieldList.fields 是一個陣列
    if ( Array.isArray( this.fieldList_LocalFiles.fieldList.fields ) ) {
      // 從場域列表中過濾掉要刪除的場域
      this.fieldList_LocalFiles.fieldList.fields = this.fieldList_LocalFiles.fieldList.fields.filter( field => field.name !== fieldName  );
    } else {
      // 如果 fieldList_LocalFiles.fieldList.fields 不是陣列，可能需要初始化它或者拋出錯誤
      console.error('fieldList.fields 不是陣列或為 undefined');
    }
  }

  // @11/30 Add by yuchen
  openSnapshot(fields: Fields){
    this.selectField = fields;
  }

  pageChanged(page: number) {
    this.p = page;
  }

  openCreateModal() {
    this.formValidated = false;
    this.createForm = this.fb.group({
      'name': new FormControl('', [Validators.required]),
      'description': new FormControl(''),
      'imsEndpoint': new FormControl('', [Validators.required]),
      'firstNode': new FormControl(''),
      'image': new FormControl(''),
      'method': new FormControl('existing'),
      'oCloudId': new FormControl('', [Validators.required]),
    });
    this.createModalRef = this.dialog.open(this.createModal, { id: 'createModal' });
    this.createModalRef.afterClosed().subscribe(() => this.formValidated = false);
  }



  changeMethod(e: MatButtonToggleChange) {
    this.formValidated = false;
    this.createForm.controls['imsEndpoint'].setValue('');
    this.createForm.controls['firstNode'].setValue('');
    this.createForm.controls['image'].setValue('');
    this.createForm.controls['oCloudId'].setValue('');
    if (e.value === 'existing') {
      this.createForm.controls['imsEndpoint'].setValidators([Validators.required]);
      this.createForm.controls['firstNode'].setValidators(null);
      this.createForm.controls['image'].setValidators(null);
      this.createForm.controls['oCloudId'].setValidators([Validators.required]);
    } else {
      this.createForm.controls['imsEndpoint'].setValidators(null);
      this.createForm.controls['firstNode'].setValidators([Validators.required]);
      this.createForm.controls['image'].setValidators([Validators.required]);
      this.createForm.controls['oCloudId'].setValidators(null);
    }
    this.createForm.controls['imsEndpoint'].updateValueAndValidity();
    this.createForm.controls['firstNode'].updateValueAndValidity();
    this.createForm.controls['image'].updateValueAndValidity();
    this.createForm.controls['oCloudId'].updateValueAndValidity();
  }




  create() {
    this.formValidated = true;
    console.log(this.createForm);
    if (!this.createForm.valid) {
      return;
    }
    if (this.commonService.isLocal) {
      /* local file test */
      this.commonService.ocloudList.push({
        id: 'clould' + this.commonService.ocloudList.length,
        name: this.createForm.controls['name'].value,
        dmsCount: 4,
        nfCount: 5,
        imsEndpoint: 'http://10.172.61.37:5005/o2ims_infrastructureInventory/v1/',
        deployStatus: 'Deploy MaaS'
      })
      this.createModalRef.close();
      // this.getOcloudList();

    } else {
      const body: any = {
        name: this.createForm.controls['name'].value,
        description: this.createForm.controls['description'].value,
        sessionid: this.sessionId
      };
      if (this.createForm.controls['method'].value === 'existing') {
        body['imsEndpoint'] = this.createForm.controls['imsEndpoint'].value;
        body['oCloudId'] = this.createForm.controls['oCloudId'].value;
      } else {
        body['firstNode'] = this.createForm.controls['firstNode'].value;
        body['image'] = this.createForm.controls['image'].value;
      }
      this.commonService.createOcloud(body).subscribe(
        res => {
          console.log('createOcloud:');
          console.log(res);
          this.createModalRef.close();
          // this.getOcloudList();
        }
      );
    }
  }

}






export interface OCloudList {
  id: string;
  name: string;
  dmsCount: number;
  nfCount: number;
  imsEndpoint: string;
  deployStatus: string;
}