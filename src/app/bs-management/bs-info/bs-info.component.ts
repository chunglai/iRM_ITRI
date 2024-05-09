import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SoftwareList } from '../../software-management/software-management.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as _ from 'lodash';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { SystemSummary } from 'src/app/dashboard/dashboard.component';
import { FaultMessages } from './../../fault-management/fault-management.component';
import { ChangeDetectorRef } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

// Services
import { CommonService } from '../../shared/common.service';
import { LanguageService } from '../../shared/service/language.service';
import { SpinnerService } from '../../shared/service/spinner.service';    // 用於控制顯示 Spinner @2024/04/17 Add

// import custom pipe modules 
import { ParsePositionPipe } from '../../shared/pipes/position-parser.pipe'; // @2024/04/14 Add

// import APIs of BS Management
import { apiForBSMgmt } from '../../shared/api/For_BS_Mgmt'; // @2024/03/25 Add

// 引入儲存各個資訊所需的 interfaces
import { BSInfo, Components, ExtensionInfo, Neighbor }  from '../../shared/interfaces/BS/For_queryBsInfo_BS';       // @2024/03/25 Add
import { ForUpdateBs, ExtensionInfo_ForUpdateBs }       from '../../shared/interfaces/BS/For_updateBs';             // @2024/04/14 Add
import { BSInfo_dist, Info_dist, Components_dist }      from '../../shared/interfaces/BS/For_queryBsInfo_dist_BS';  // @2024/03/25 Add
import { ForUpdateDistributedBs, Cellinfo_dist,
           ExtensionInfo_dist_ForUpdateDistributedBs }  from '../../shared/interfaces/BS/For_updateDistributedBs';  // @2024/05/08 Update
import { ForAddOrEditOrDeleteNeighborBs_allInOneBs }    from '../../shared/interfaces/BS/For_optimalBs';            // @2024/05/06 Add
import { ForUpdateDistributedBs_editNeighborBs, Neighborinfo } from '../../shared/interfaces/BS/For_updateDistributedBs_editNeighborBs'; // @2024/05/06 Add
    

import { CurrentBsFmList, FaultMessage } from '../../shared/interfaces/BS/For_queryCurrentBsFaultMessage'; // @2024/03/31 Add
import { NEList, NE, Sm  }               from '../../shared/interfaces/NE/For_queryBsComponentList';       // @2024/03/27 Add
import { NEInfo }                        from '../../shared/interfaces/NE/For_queryBsComponentInfo';       // @2024/03/29 Add

// 引入所需 Local Files
import { localBSInfo } from '../../shared/local-files/BS/For_queryBsInfo';          // @2024/03/25 Add
import { localNEList } from '../../shared/local-files/NE/For_queryBsComponentList'; // @2024/03/27 Add
import { localCurrentBsFmList } from '../../shared/local-files/BS/For_queryCurrentBsFaultMessage'; // @2024/03/31 Add

// @2024/05/03 Add
import { Location } from '@angular/common';  // 引入 Location 服務，用於控制瀏覽器的歷史記錄導航

// 2024/04/01 Add
// 搜尋基站告警用
interface bsCurrentFmParams {
  method: string;
  start: string;
  end: string;
  urgency?: string; // 可選

  offset: number;
  limit: number;
}

/**
 * @2024/05/08 Add
 * 枚舉：定義不同的 extension_info 參數表格名稱
 * @enum ExtensionInfoParamTableNames
 * @description
 *    - 此枚舉用於標識和訪問 extension_info 中的特定參數字段。
 *    - 提供一個清晰的參考點，以確保在代碼中使用的字段名與數據結構保持一致性。
 * 
 * @member {string} gNBCUFunction               - 指向 gNBCUFunction 相關的參數。
 * @member {string} NRCellCU                    - 指向 NRCellCU 相關的參數。
 * @member {string} peeParametersList_CU        - 指向 CU 層的 pee 參數列表。
 * @member {string} vnfParametersList_CU        - 指向 CU 層的 VNF 參數列表。
 * @member {string} EP_F1C_CU                   - 指向 CU 層的 F1C 端點。
 * @member {string} EP_F1U_CU                   - 指向 CU 層的 F1U 端點。
 * @member {string} EP_NgC                      - 指向 NgC 端點。
 * @member {string} EP_NgU                      - 指向 NgU 端點。
 * @member {string} peeParametersList_NRCellCU  - 指向 NRCellCU 層的 pee 參數列表。
 * @member {string} vnfParametersList_NRCellCU  - 指向 NRCellCU 層的 VNF 參數列表。
 * @member {string} s_NSSAI_leafList_NRCellCU   - 指向 NRCellCU 層的 S-NSSAI 葉列表。
 * @member {string} gNBDUFunction               - 指向 gNBDUFunction 相關的參數。
 * @member {string} NRCellDU                    - 指向 NRCellDU 相關的參數。
 * @member {string} peeParametersList_DU        - 指向 DU 層的 pee 參數列表。
 * @member {string} vnfParametersList_DU        - 指向 DU 層的 VNF 參數列表。
 * @member {string} EP_F1C_DU                   - 指向 DU 層的 F1C 端點。
 * @member {string} EP_F1U_DU                   - 指向 DU 層的 F1U 端點。
 * @member {string} NRSectorCarrier             - 指向 NR Sector Carrier 相關的參數。
 * @member {string} BWP                         - 指向 BWP (頻寬部分) 相關的參數。
 * @member {string} peeParametersList_NRSector  - 指向 NR Sector 層的 pee 參數列表。
 * @member {string} vnfParametersList_NRSector  - 指向 NR Sector 層的 VNF 參數列表。
 * @member {string} peeParametersList_NRCellDU  - 指向 NRCellDU 層的 pee 參數列表。
 * @member {string} vnfParametersList_NRCellDU  - 指向 NRCellDU 層的 VNF 參數列表。
 * @member {string} s_NSSAI_leafList_NRCellDU   - 指向 NRCellDU 層的 S-NSSAI 葉列表。
 * @member {string} NRSectorCarrierRef_NRCellDU - 指向 NRCellDU 層的 NR Sector Carrier 引用。
 * @member {string} bWPRef_leafList_NRCellDU    - 指向 NRCellDU 層的 BWP 引用葉列表。
 * @member {string} peeParametersList_BWP       - 指向 BWP 層的 pee 參數列表。
 * @member {string} vnfParametersList_BWP       - 指向 BWP 層的 VNF 參數列表。
 */
enum ExtensionInfoParamTableNames {
  gNBCUFunction = "gNBCUFunction",
  NRCellCU = "NRCellCU",
  peeParametersList_CU = "peeParametersList_CU",
  vnfParametersList_CU = "vnfParametersList_CU",
  EP_F1C_CU = "EP_F1C_CU",
  EP_F1U_CU = "EP_F1U_CU",
  EP_NgC = "EP_NgC",
  EP_NgU = "EP_NgU",
  peeParametersList_NRCellCU = "peeParametersList_NRCellCU",
  vnfParametersList_NRCellCU = "vnfParametersList_NRCellCU",
  s_NSSAI_leafList_NRCellCU = "s_NSSAI_leafList_NRCellCU",
  gNBDUFunction = "gNBDUFunction",
  NRCellDU = "NRCellDU",
  peeParametersList_DU = "peeParametersList_DU",
  vnfParametersList_DU = "vnfParametersList_DU",
  EP_F1C_DU = "EP_F1C_DU",
  EP_F1U_DU = "EP_F1U_DU",
  NRSectorCarrier = "NRSectorCarrier",
  BWP = "BWP",
  peeParametersList_NRSector = "peeParametersList_NRSector",
  vnfParametersList_NRSector = "vnfParametersList_NRSector",
  peeParametersList_NRCellDU = "peeParametersList_NRCellDU",
  vnfParametersList_NRCellDU = "vnfParametersList_NRCellDU",
  s_NSSAI_leafList_NRCellDU = "s_NSSAI_leafList_NRCellDU",
  NRSectorCarrierRef_NRCellDU = "NRSectorCarrierRef_NRCellDU",
  bWPRef_leafList_NRCellDU = "bWPRef_leafList_NRCellDU",
  peeParametersList_BWP = "peeParametersList_BWP",
  vnfParametersList_BWP = "vnfParametersList_BWP"
}

// @2024/05/08 Add
export interface ChartData {
  name: string; // category name
  series: { name: string; value: number }[];
}

@Component({
  selector: 'app-bs-info',
  templateUrl: './bs-info.component.html',
  styleUrls: ['./bs-info.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class BSInfoComponent implements OnInit {

  sessionId: string = '';   // sessionId 用於存儲當前會話 ID
  refreshTimeout!: any;     // refreshTimeout 用於存儲 setTimeout 的引用，方便之後清除
  refreshTime: number = 5;  // refreshTime 定義自動刷新的時間間隔（秒）
  formValidated = false;

  constructor(

    private         router: Router,
    private          route: ActivatedRoute,
    private             fb: FormBuilder,
    private         dialog: MatDialog,
    private          location: Location,      // @2024/05/03 Add
    public      commonService: CommonService,
    public    languageService: LanguageService,
    public     spinnerService: SpinnerService,
    private changeDetectorRef: ChangeDetectorRef,

    public  API_BS: apiForBSMgmt,           // @2024/03/25 Add for import API of BS Management
    public  bsInfo_LocalFiles: localBSInfo, // @2024/03/25 Add for import BS Info Local Files 
    public  currentBsFmList_LocalFiles: localCurrentBsFmList, // @2024/03/31 Add for import Current Current BS Fault Messages List
    public  neList_LocalFiles: localNEList,                   // @2024/03/27 Add neList_LocalFiles 用於從 Local 文件獲取 NE 列表數據
  
  ) {

    // 取得現在時間 @2024/04/01 Add
    const nowTime = this.commonService.getNowTime();
    console.log( "getNowTime: ", nowTime );
    
    // @2024/04/01 Add
    // 創建一個新的 Date 物件，代表當前時間
    const currentDate = new Date(`${nowTime.year}-${nowTime.month}-${nowTime.day} ${nowTime.hour}:${nowTime.minute}`);
    
    // @2024/04/01 Add
    // 創建一個新的 Date 物件，並將月份往回設置一個月
    const oneMonthAgoDate = new Date(currentDate);
    oneMonthAgoDate.setMonth(oneMonthAgoDate.getMonth() - 1);
    
    // 確保月份和日期是兩位數的格式，如 "02" 代表 2 月 @2024/04/01 Add
    const formattedMonth = ('0' + (oneMonthAgoDate.getMonth() + 1)).slice(-2);
    const formattedDay = ('0' + oneMonthAgoDate.getDate()).slice(-2);
    const formattedHour = ('0' + oneMonthAgoDate.getHours()).slice(-2);
    const formattedMinute = ('0' + oneMonthAgoDate.getMinutes()).slice(-2);

    // @2024/04/01 Add
    // 使用這些格式化後的值來更新 searchForm 控件的值
    this.alarmSearchForm = this.fb.group({
      'from': new FormControl( `${oneMonthAgoDate.getFullYear()}-${formattedMonth}-${formattedDay} ${formattedHour}:${formattedMinute}` ), 
      'to': new FormControl( `${nowTime.year}-${nowTime.month}-${nowTime.day} ${nowTime.hour}:${nowTime.minute}` ),
      'severity': new FormControl( 'All' )
    });

    // 建立搜尋表單 
    this.createAlarmSearchForm();
    //this.createBsBasicInfoEditForm(); // 用於編輯 BS 基本資訊用 @2024/04/14 Add

    Object.assign( this.multi ); // data goes here
  }

  // @2024/03/25 Add
  bsID:   string = '';      // 用於存儲當前選中的 BS ID
  bsName: string = '';      // 用於存儲當前選中的 BS 名稱
  bsType: string = '';      // 用於存儲當前選中的 BS 類型
  bsCellCount: string = ''; // 用於存儲當前選中的 BS Cell 數量

  /**
   * @2024/03/25 Update
   * 初始化組件時執行的操作
   * @method ngOnInit
   * @description
   * - 此方法在組件初始化時調用。
   * - 訂閱路由參數，取得基站相關資訊。
   * - 調用方法取得基站的告警資訊、網元列表和基站資訊。
   * - 執行圖表的更新。
   */
  ngOnInit(): void {

    //this.showLoadingSpinner();   // 顯示 Loading Spinner

    this.sessionId = this.commonService.getSessionId();

    this.route.params.subscribe(( params ) => {
      this.bsID = params['id'];
      this.bsName = params['name'];
      this.bsType = params['type'];
      //this.bsCellCount = params['cellCount'];
      console.log('bsId: ' + this.bsID + ', bsName: ' + this.bsName +
                     ', bsType: ' + this.bsType + ', bsCellCount: ' + ',\nsend from /main/bs-mgr');
      
      // 建立 alarmSearchForm 的深層複本 ( Deep Copy )，以保留原始表單狀態，供後續搜尋使用。
      this.afterAlarmSearchForm = _.cloneDeep( this.alarmSearchForm );

      // 初入該頁面就取得此 BS 資訊               
      this.getQueryBsInfo();

      // @2024/03/27 Add
      // 取得基站資訊後，取得網元列表資訊並進行座標位置或軟體版本顯示資訊的相關處理 
      this.getNEList(); 

      // 取得此基站告警資訊 @2024/04/01 Add
      this.getCurrentBsFmList();
    });
    
    this.updateChart(); // 初始載入時執行一次更新
  }

  /**
   * 在組件被銷毀前執行的清理操作
   * @method ngOnDestroy
   * @description
   * - 此方法在組件銷毀前調用，用於清理訂時器等資源，防止內存洩漏。
   */
  ngOnDestroy() {
    clearTimeout( this.refreshTimeout );
  }

  /**
   * 在視圖初始化之後執行的操作
   * @method ngAfterViewInit
   * @description
   * - 此方法在組件視圖及其子視圖初始化完成後調用。
   * - 設置 canvas 尺寸並繪製連接線。
   */
  ngAfterViewInit() {

    this.canvas.nativeElement.width  = 1000; // 增加 Canvas 的寬度
    this.canvas.nativeElement.height = 250;  // 增加 Canvas 的寬度

    this.drawConnectingLines();
  }

  /** @2024/05/03 Update
   *  返回使用者到前一頁
   *  @method back
   *  @description
   *    - 此方法用於導航返回上一個頁面。
   *    - 實際使用取決於 `location.back()` 或特定路由導航。
   */
  back() {
    this.location.back();
    //this.router.navigate( ['/main/bs-mgr'] ); // 返回 BS 主頁
  }

  /** @2024/04/17 Add
   *  顯示加載中的 Spinner
   *  @method showLoadingSpinner
   *  @description
   *    - 此方法觸發加載中的 Spinner 顯示，通常在數據加載或處理前調用。
   */
  showLoadingSpinner() {
    this.spinnerService.isLoading = true;
    this.spinnerService.show();
  }

  /** @2024/04/17 Add
   *  顯示處理中的 Spinner
   *  @method showProcessingSpinner
   *  @description
   *    - 此方法用於在進行數據處理時顯示 Spinner，以提供視覺反饋給使用者。
   */
  showProcessingSpinner() {
    this.spinnerService.isLoading = false;
    this.spinnerService.show();
  }

  /** @2024/04/17 Add
   *  隱藏 Spinner
   *  @method hideSpinner
   *  @description
   *    - 此方法用於隱藏 Spinner，通常在數據處理或加載完成後調用。
   */
  hideSpinner() {
    this.spinnerService.hide();
  }


// ↓ 編輯、調整與更新 BS 任何資訊時都會呼叫的 API，除了編輯一體式基站的鄰居基站資訊時不會呼叫 ↓

  /**
   * @2024/05/08 Update
   * 更新一體式基站的訊息
   * @method updateBs
   * @param {ForUpdateBs} submitData - 包含基站更新訊息的數據對象
   * @description
   *    - 此方法用於更新一體式基站的各項配置。
   *    - 如果是本地環境，只打印數據並模擬操作，不進行真實的 API 請求。
   *    - 如果是非本地環境，則實際發送 API 請求來更新基站。
   *    - 無論成功或失敗，均會隱藏處理中的 Spinner。
   *    - 更新成功後，關閉所有彈出視窗，刷新基站及相關資訊。
   */
  updateBs( submitData: ForUpdateBs ) {

    this.showProcessingSpinner(); // 顯示 Processing Spinner

    if ( this.commonService.isLocal ) {
      // 本地模式

      // 輸出本地測試環境的日誌
      console.log('本地測試環境，不進行更新操作。\nLocal testing environment, no update operation will be performed.');
      // 輸出要 POST 的資料
      console.log( "The POST for updateBs():", submitData ); 
      
      // // 模擬成功響應
      // setTimeout(() => {
      //   this.isModifySuccess = true;
      //   console.log('All-in-one BS Update successful...');
      //   this.dialog.closeAll();
      //   this.getQueryBsInfo();
      //   setTimeout(() => this.isModifySuccess = false, 4500);
      // }, 500); // 模擬非同步操作

      this.hideSpinner();  // 因為 Local 模式數據加載通常很快，所以立即隱藏 spinner

    } else {
      // 非本地模式，實際呼叫 API

      // 輸出要 POST 的資料
      console.log( "The POST for updateBs():", submitData );
      // 呼叫 API 更新一體式基站
      this.API_BS.updateBs( submitData ).subscribe({
        // 成功回調函數
        next: ( res ) => {

          // 輸出更新成功的日誌
          console.log( 'Update BS success', res );

          // 關閉所有彈出視窗
          //this.dialog.closeAll();

          // 刷新基站資訊
          this.getQueryBsInfo();

          // 刷新網元資訊
          //this.getNEList(); 

          // 刷新基站告警資訊
          //this.getCurrentBsFmList()

          // 如果編輯設定視窗有開啟，則等更新讀取完後，關閉新增或編輯設定視窗
          if ( this.BsBasicInfoEditWindowRef ) {
            this.BsBasicInfoEditWindowRef.close();
          }

          this.hideSpinner();  // 完成後隱藏 spinner
        },
        // 錯誤回調函數
        error: ( error ) => {
          // 輸出更新失敗的日誌
          console.error( 'Update BS fail', error );
          this.hideSpinner();  // 出錯時隱藏 spinner
        },
        complete: () => {
          console.log( 'Update BS Success' );
          this.hideSpinner();  // 完成後隱藏 spinner
        }
      });
    }
  }

  /**
   * @2024/05/08 Update
   * 更新分佈式基站的訊息
   * @method updateDistributedBs
   * @param {ForUpdateDistributedBs} submitData - 包含分佈式基站更新訊息的數據對象
   * @description
   * - 此方法用於更新分佈式基站的各項配置。
   * - 如果是本地環境，只打印數據並模擬操作，不進行真實的 API 請求。
   * - 如果是非本地環境，則實際發送 API 請求來更新基站。
   * - 無論成功或失敗，均會隱藏處理中的 Spinner。
   * - 更新成功後，關閉所有彈出視窗，刷新基站及相關資訊。
   */
  updateDistributedBs( submitData: ForUpdateDistributedBs ) {

    this.showProcessingSpinner(); // 顯示 Processing Spinner

    if ( this.commonService.isLocal ) {
      // 本地模式

      // 輸出本地測試環境的日誌
      console.log('本地測試環境，不進行更新操作。\nLocal testing environment, no update operation will be performed.');
      // 輸出要 POST 的資料
      console.log("The POST for updateDistributedBs():", submitData); 

      // 模擬成功響應
      // setTimeout(() => {
      //   this.isModifyError = true; 
      //   console.log('Disaggregated BS: [CU] + [DU] + [RU] Update error...');
      //   this.dialog.closeAll();
      //   this.getQueryBsInfo();
      //   setTimeout(() => this.isModifyError = false, 4500);
      // }, 500); // 模擬非同步操作

      this.hideSpinner();  // 因為 Local 模式數據加載通常很快，所以立即隱藏 spinner

    } else {
      // 非本地模式，實際呼叫 API

      // 輸出要 POST 的資料
      console.log( "The POST for updateDistributedBs():", submitData );
      // 呼叫 API 更新分布式基站
      this.API_BS.updateDistributedBs( submitData ).subscribe({
        // 成功回調函數
        next: ( res ) => {

          // 輸出更新成功的日誌
          console.log( 'Update Distributed BS success', res );
          
          // 關閉所有彈出視窗
          //this.dialog.closeAll();

          // 刷新基站資訊
          this.getQueryBsInfo();

          // 刷新網元資訊
          //this.getNEList(); 

          // 刷新基站告警資訊
          //this.getCurrentBsFmList()

          // 如果編輯設定視窗有開啟，則等更新讀取完後，關閉新增或編輯設定視窗
          if ( this.BsBasicInfoEditWindowRef ) {
            this.BsBasicInfoEditWindowRef.close();
          }

          this.hideSpinner();  // 完成後隱藏 spinner
        },
        // 錯誤回調函數
        error: ( error ) => {
          // 輸出更新失敗的日誌
          console.error( 'Update Distributed BS fail', error );
          this.hideSpinner();  // 出錯時隱藏 spinner
        },
        complete: () => {
          console.log( 'Update Distributed BS Success' );
          this.hideSpinner();  // 完成後隱藏 spinner
        }
      });
    }

  }

// ↑ 編輯、調整與更新 BS 任何資訊時都會呼叫的 API，除了編輯一體式基站的鄰居 ↑



// ↓ 基本資訊區 ↓

  isLoadingBsInfo =  true;                            // 加載 BS 資訊狀態的標誌，初始設置為 true
  selectBsInfo:      BSInfo = {} as BSInfo;           // 用於存儲從服務器或 Local Files 獲取的一體式基站資訊
  selectBsInfo_dist: BSInfo_dist = {} as BSInfo_dist; // 用於存儲從服務器或 Local Files 獲取的分佈式基站資訊
  selectBsCellCount: number = 0;                      // 用於存儲當前選中的 BS Cell 數量
   selectBsPosition: string = "";                     // 用於存儲當前選中的一體式 BS 位置
  selectDistBsPosition: string = "";                  // 用於存儲當前選中的分佈式 BS 位置
  gNBIdLength: number = 0;  // 用於存儲 gNBIdLength，以便後續可能會計算 NCI 或 cellLocalId @2024/05/04 Add
  
  /**
   * @2024/05/08 Update
   * 取得基站資訊
   * @method getQueryBsInfo
   * @description
   * - 此方法用於獲取當前基站的詳細資訊。
   * - 根據是本地模式或 API 模式，從 Local 文件或服務器獲取基站資訊。
   * - 進行一體式與分佈式基站的不同數據結構處理。
   * - 處理後續的網元列表資訊，以及座標位置或軟體版本顯示資訊。
   * - 使用 Angular 的變更檢測來更新 UI。
   * @note
   * - 這個函數同時處理兩種類型的基站資訊，根據基站類型計算相應的 Cell 數量
   * - @2024/04/12 Update - 更新計算分佈式 Cell 數方式，改跟基站主頁方法相同
   * - @2024/04/15 Add - 新增"基站參數"欄位所需的設值處理
   * - @2024/05/04 Add - 新增取得 gNBIdLength
   */
  getQueryBsInfo() {
    console.log( 'getQueryBsInfo() - Start' );

    this.isLoadingBsInfo = true; // 開始加載數據，顯示進度指示器

    this.showLoadingSpinner();   // 顯示 Loading Spinner

    clearTimeout( this.refreshTimeout ); // 取消之前設定的超時，避免重複或不必要的操作

    if ( this.commonService.isLocal ) {
      // Local 模式: 使用 Local 文件提供的數據

      if ( this.bsType === "1" ) {

        // 取得 Local 一體式基站資訊
        this.selectBsInfo        = this.bsInfo_LocalFiles.bsInfo_local.find( info => info.id === this.bsID ) || {} as BSInfo;
        this.selectBsInfo.laston = this.commonService.formatTimeWithoutSecondsFraction( this.selectBsInfo.laston ); // 處理時間格式
        this.selectBsPosition    = this.commonService.formatPosition( this.selectBsInfo.position );                 // 處理位置訊息格式
        
        console.log( 'In local - Get the BSInfo:', this.selectBsInfo );
        console.log( 'In local - Get the BSInfo position:', this.selectBsPosition );

        // @2024/05/04 Add
        // 取得 gNBIdLength - 避免 info 為空的狀況都從 extension_info 中取得
        if ( this.selectBsInfo.extension_info[0].gNBIdLength  ) {
          this.gNBIdLength = this.selectBsInfo.extension_info[0].gNBIdLength;
          console.log( 'In local - Get the BSInfo gNBIdLength:', this.gNBIdLength );
        }

        // 一體式基站，直接將 Cell 數量設為 1
        this.selectBsCellCount = 1;

      } else if ( this.bsType === "2" ) {

        // 取得 Local 分佈式基站資訊
        this.selectBsInfo_dist        = this.bsInfo_LocalFiles.dist_bsInfo_local.find( info => info.id === this.bsID ) || {} as BSInfo_dist;
        this.selectBsInfo_dist.laston = this.commonService.formatTimeWithoutSecondsFraction( this.selectBsInfo_dist.laston ); // 處理時間格式
        //this.selectDistBsPosition     = this.commonService.formatPosition( this.selectBsInfo_dist.position );               // 處理位置訊息格式
        console.log( 'In local - Get the BSInfo_dist:', this.selectBsInfo_dist );
        //console.log( 'In local - Get the BSInfo_dist position:', this.selectBsInfo_dist.position );

        // @2024/05/04 Add
        // 取得 gNBIdLength - 避免 info 為空的狀況都從 extension_info 中取得
        this.gNBIdLength = this.selectBsInfo_dist.extension_info[0].gNBIdLength;
        console.log( 'In local - Get the BSInfo_dist gNBIdLength:', this.gNBIdLength );

        // 對於分佈式基站，計算 RU 的數量 ( 透過 info 內資料筆數直接計算，因基本上每筆都會有一個 RU )
        //this.selectBsCellCount = this.selectBsInfo_dist.info.length; // 每個 RU 代表一個 Cell
                   // 改用遍歷 components 計算 Cell 數量 @2024/04/12 Add
        // 如果 bstype 為 2，需要遍歷 components 物件算 Cell 數量，每個 RU 代表一個 Cell
        let cellCount = 0;
        for ( const compKey in this.selectBsInfo_dist.components ) {
          const compVal = this.selectBsInfo_dist.components[compKey];
          for ( const innerKey in compVal ) {
            // 取得內層陣列的長度，即 cell 數量
            cellCount += compVal[innerKey].length;
          }
        }
        // 使用 cellCount 設置 selectBsCellCount
        this.selectBsCellCount = cellCount;

      }

      console.log( `In local - BS Type ${ this.bsType } - Cell Count: ${ this.selectBsCellCount }` );

      // @2024/03/27 Add
      // 取得基站資訊後，取得網元列表資訊並進行座標位置或軟體版本顯示資訊的相關處理 
      //this.getNEList(); 

      // @2024/04/16 Update
      // 獲取 NCI 列表並設定預設選擇的 NCI、ExtensionInfo、NeighborList ( 預設"基站參數"與"鄰居基站列表"的 Cell 為 nciList 中第一筆 )
      if ( this.bsType === '1' && this.selectBsInfo ) {
        this.nciList = this.selectBsInfo.extension_info.map( info => info.nci );
        this.selectedNci = this.nciList[0];
        this.selectedExtensionInfo = this.selectBsInfo.extension_info.find(info => info.nci === this.selectedNci);
        this.selectedNeighborNci = this.nciList[0]; // 初始化鄰居基站列表的選擇
        this.neighborList = this.getNeighborList( this.selectedNeighborNci );
      } else if ( this.bsType === '2' && this.selectBsInfo_dist ) {
        this.nciList = this.selectBsInfo_dist.extension_info.map( info => info.nci );
        this.selectedNci = this.nciList[0];
        this.selectedExtensionInfo = this.selectBsInfo_dist.extension_info.find( info => info.nci === this.selectedNci );
        this.selectedNeighborNci = this.nciList[0]; // 初始化鄰居基站列表的選擇
        this.neighborList = this.getNeighborList( this.selectedNeighborNci );
      }

      this.isLoadingBsInfo = false; // Local 模式下，數據加載快速完成，直接設置為 false
      this.hideSpinner();  // 因為 Local 模式數據加載通常很快，所以立即隱藏 spinner

    } else {
      
      // 非 Local 模式: 通過 API 從服務器獲取數據
      this.API_BS.queryBsInfo( this.bsID ).subscribe({
        next: ( res ) => {

          console.log( 'Get the response of queryBsInfo:', res );

          if ( res.bstype === 1 ) {

            // 刷新一體式基站資訊
            this.selectBsInfo        = res as BSInfo;
            this.selectBsInfo.laston = this.commonService.formatTimeWithoutSecondsFraction( this.selectBsInfo.laston ); // 處理時間格式
            this.selectBsPosition    = this.commonService.formatPosition( this.selectBsInfo.position );               // 處理位置訊息格式
            console.log( 'Get the BSInfo:', this.selectBsInfo );
            console.log( 'Get the BSInfo position:', this.selectBsPosition );

            // @2024/05/04 Add
            // 取得 gNBIdLength - 避免 info 為空的狀況都從 extension_info 中取得
            if ( this.selectBsInfo.extension_info[0].gNBIdLength  ) {
              this.gNBIdLength = this.selectBsInfo.extension_info[0].gNBIdLength;
              console.log( 'In local - Get the BSInfo gNBIdLength:', this.gNBIdLength );
            }

            // 一體式基站，直接將 Cell 數量設為 1
            this.selectBsCellCount = 1;

          } else if ( res.bstype === 2 ) {

            // 刷新分佈式基站資訊
            this.selectBsInfo_dist        = res as BSInfo_dist;
            this.selectBsInfo_dist.laston = this.commonService.formatTimeWithoutSecondsFraction( this.selectBsInfo_dist.laston ); // 處理時間格式
            //this.selectDistBsPosition     = this.commonService.formatPosition( this.selectBsInfo_dist.position );               // 處理位置訊息格式
            console.log( 'Get the BSInfo_dist:', this.selectBsInfo_dist );
            // console.log( 'Get the BSInfo_dist position:', this.selectDistBsPosition );

            // 對於分佈式基站，計算 RU 的數量 ( 透過 info 內資料筆數直接計算，因基本上每筆都會有一個 RU )
            //this.selectBsCellCount = this.selectBsInfo_dist.info.length; // 每個 RU 代表一個 Cell

            // @2024/05/04 Add
            // 取得 gNBIdLength - 避免 info 為空的狀況都從 extension_info 中取得
            this.gNBIdLength = this.selectBsInfo_dist.extension_info[0].gNBIdLength;  
            console.log( 'Get the BSInfo_dist gNBIdLength:', this.gNBIdLength );

            // 改用遍歷 components 計算 Cell 數量 @2024/04/12 Add
            // 如果 bstype 為 2，需要遍歷 components 物件算 Cell 數量，每個 RU 代表一個 Cell
            let cellCount = 0;
            for ( const compKey in this.selectBsInfo_dist.components ) {
              const compVal = this.selectBsInfo_dist.components[compKey];
              for ( const innerKey in compVal ) {
                // 取得內層陣列的長度，即 cell 數量
                cellCount += compVal[innerKey].length;
              }
            }
            // 使用 cellCount 設置 selectBsCellCount
            this.selectBsCellCount = cellCount;
          
          }
          
          console.log(`BS Type ${ this.bsType } - Cell Count: ${ this.selectBsCellCount }`);

          // @2024/03/27 Add
          // 取得基站資訊後，取得網元列表資訊並進行座標位置或軟體版本顯示資訊的相關處理 
          //this.getNEList(); 

          this.isLoadingBsInfo = false; // 數據加載完成

          // @2024/04/16 Update
          // 獲取 NCI 列表並設定預設選擇的 NCI、ExtensionInfo、NeighborList ( 預設"基站參數"與"鄰居基站列表"的 Cell 為 nciList 中第一筆 )
          if ( this.bsType === '1' && this.selectBsInfo ) {
            this.nciList = this.selectBsInfo.extension_info.map( info => info.nci );
            this.selectedNci = this.nciList[0];
            this.selectedExtensionInfo = this.selectBsInfo.extension_info.find(info => info.nci === this.selectedNci);
            this.selectedNeighborNci = this.nciList[0]; // 初始化鄰居基站列表的選擇
            this.neighborList = this.getNeighborList( this.selectedNeighborNci );
          } else if ( this.bsType === '2' && this.selectBsInfo_dist ) {
            this.nciList = this.selectBsInfo_dist.extension_info.map( info => info.nci );
            this.selectedNci = this.nciList[0];
            this.selectedExtensionInfo = this.selectBsInfo_dist.extension_info.find( info => info.nci === this.selectedNci );
            this.selectedNeighborNci = this.nciList[0]; // 初始化鄰居基站列表的選擇
            this.neighborList = this.getNeighborList( this.selectedNeighborNci );
          }
        },
        error: ( error ) => {
          console.error( 'Error fetching BS info:', error );
          this.isLoadingBsInfo = false; // 出錯時設置加載標誌為 false
          //this.hideSpinner();  // 出錯時隱藏 spinner
        },
        complete: () => {
          console.log( 'BS info fetch completed' );
          //this.hideSpinner();  // 完成後隱藏 spinner
          this.changeDetectorRef.detectChanges(); // 手動觸發變更檢測
        }
      });
    }

    console.log( 'getQueryBsInfo() - End' );
  }


  // @2024/03/27 Add
  // 定義 NEList 物件，並使用類型斷言將其初始化為空物件
           NEList: NEList = {} as NEList; // 用於儲存 O1 系統內的網元列表
  isLoadingNEList = true; // 控制加載 NE List 資訊狀態的標誌，初始設置為 true

  /**
   * @2024/04/17 Update
   * 獲取並處理網元列表資訊
   * @method getNEList
   * @description
   *    - 此函數負責從本地文件或後端 API 獲取網元列表，依運行模式而定。
   *    - 它處理獲取到的數據，按需要組織網元詳細訊息並篩選出當前基站的相關網元。
   *    - 在開始時啟動加載指示器，並在完成或發生錯誤時處理 UI 更新。
   *    - 在不同階段輸出日誌，用於調試和運營追踪。
   */
  getNEList() {
    console.log('getNEList() - Start'); // 輸出開始獲取網元列表的日誌

    this.isLoadingNEList = true;  // 標記數據加載開始，可能觸發 UI 加載指示器
    // this.showLoadingSpinner();  // 選擇性顯示加載轉圈，如果已實施

    if ( this.commonService.isLocal ) {
        // 本地模式：從本地數據源獲取網元列表
        this.NEList = this.neList_LocalFiles.neList_local;

        // 處理獲取的網元列表，為後續使用做結構化處理
        this.processNEList( this.NEList );

        // 篩選只包括當前基站部分的網元
        this.filterNEListByBSName();       

        this.isLoadingNEList = false; // 本地模式下數據加載快，立即設定加載標誌為 false

        // this.hideSpinner();  // 完成後隱藏加載轉圈
        this.changeDetectorRef.detectChanges(); // 手動觸發變更檢測以更新 UI

    } else {
        // API 模式：從後端服務獲取網元列表
        this.API_BS.queryBsComponentList().subscribe({
            next: ( res ) => {

                this.NEList = res; // 將獲取到的網元列表賦值給 NEList 屬性
                this.processNEList( this.NEList );  // 處理列表以準備使用

                // 篩選出屬於當前基站的網元
                this.filterNEListByBSName();    

                this.isLoadingNEList = false; // 設置加載完畢
              
                // this.hideSpinner();  // 完成後選擇性隱藏加載轉圈

                this.changeDetectorRef.detectChanges(); // 手動觸發 UI 更新
            },
            error: ( error ) => {
                console.error('獲取網元列表出錯:', error); // 輸出錯誤日誌
                this.isLoadingNEList = false; // 出錯時確保加載指示器為 false
                this.hideSpinner();           // 出錯時選擇性隱藏加載轉圈
            },
            complete: () => {
                console.log('網元列表獲取完成'); // 輸出完成獲取網元列表的日誌

                this.drawConnectingLines();             // 選擇性繪製連接網元的線條（如果適用）
                this.changeDetectorRef.detectChanges(); // 確保處理 UI 更新
                this.hideSpinner();                     // 完成後確保隱藏加載轉圈
            }
        });
    }

    console.log('getNEList() - End'); // 輸出結束獲取網元列表的日誌
  }


  // @2024/03/27 Add
  // 用於存儲網元的使用的軟體版本訊息，包括網元名稱、網元類型、網元型號和軟體版本號
  swVersionMap: { [neId: string]: { neName: string, neType: string, neModel: string, neSFversion: string } } = {};

  // @2024/03/27 Add
  // 用於存儲分佈式基站的 RU id 對應到的名稱與位置
  ruIdNamePositionMap: { [ruId: string]: { name: string, position: string } } = {};

  // @2024/03/27 Add
  // 用於存儲兩種基站的網元資訊，用於後續繪製拓樸圖
  componentArray: any[] = [];

  // @2024/03/28 Add
  // 用於儲存一體式基站的 NE ID，用於後續繪製拓樸圖
  allInOneNEID: string = "";

  /**
   * @2024/03/29 Update
   * 處理從 NEList 中獲取的網元訊息
   * @method processNEList
   * @param { NEList } neList - 網元列表
   * @description
   *    - 此方法用於處理從 NEList 中獲取的網元訊息，將其組織並儲存至適當的對象中。
   *    - 為一體式基站，直接將 components 加入到 componentArray 並處理對應的軟體版本資訊。
   *    - 為分佈式基站，則透過 getComponentArray_distBS 方法組織網元結構，並通過 if_BsInfo_dist_isNull 處理網元的軟體版本。
   *    - 根據基站類型，使用不同的策略來處理網元訊息。
   * @note
   *    - ruIdNamePositionMap: 用於存儲分佈式基站的 RU id 對應到的名稱與位置
   *    - swVersionMap: 用於存儲網元的使用的軟體版本訊息，包括網元名稱、網元類型、網元型號和軟體版本號
   *    - 03/29 Update - 修改當 this.bsType === "2" 時的處理方式
   */
  processNEList( neList: NEList ) {

    // 如果是一體式基站
    if ( this.bsType === "1" ) {

      // 處理一體式基站的網元資訊，放入 componentArray 用於繪拓樸圖
      this.componentArray = this.selectBsInfo.components;
      console.log( "一體式基站的 componentArray:", this.componentArray );

      // 處理一體式基站的軟體版本資訊
      for ( const component of this.selectBsInfo.components ) {

        // 在 NEList 中找到與網元 id 相對應的 NE
        const correspondingNE = neList.components.find( ne => ne.id === component.id );

        // 如果找到對應的 NE
        if ( correspondingNE ) {

          // 儲存此 NE ID 用於繪製拓樸圖
          this.allInOneNEID = correspondingNE.id;

          // 將網元類型轉換為大寫
          const neType = component.type.toUpperCase();

          // 構建 neModel 字串
          const neModel = `${correspondingNE.firm} / ${correspondingNE.modelname}`;

          // 獲取活動軟體版本，如果沒有則設置為 'None'
          const neSFversion = this.getActiveSoftwareVersion( correspondingNE.sm ) || 'None';

          // 將軟體版本資訊存儲在 swVersionMap 中，以網元 id 作為鍵
          this.swVersionMap[component.id] = { neName: correspondingNE.name, neType, neModel, neSFversion };
        }
      }

    } else if ( this.bsType === "2" ) { // 如是分佈式基站

      // 處理分佈式基站的網元資訊，放入 componentArray 用於繪拓樸圖
      this.getComponentArray_distBS( this.selectBsInfo_dist.components );
      console.log( "分佈式基站的 componentArray:", this.componentArray );

      // console.log( "分佈式基站的 this.selectBsInfo_dist.info.length:", this.selectBsInfo_dist.info.length );

      // 檢查分佈式 BS 的 info 是否有值
      // if ( this.selectBsInfo_dist.info.length > 0 ) { // 有值時

      //   // 遍歷 selectBsInfo_dist.info 中的每個 Info 對象，對分佈式基站的網元軟體版本資訊進行處理
      //   this.if_BsInfo_dist_notNull( this.selectBsInfo_dist.info, neList );

      // } else { // 無值時

      //   console.log( "this.selectBsInfo_dist.info 無值，開始使用 if_BsInfo_dist_isNull() 進行處理" );

      //   this.if_BsInfo_dist_isNull( neList );
      // }

      // 都直接改呼叫此函數，
      // 從 this.componentArray 中去取得對應的軟體或位置資訊
      this.if_BsInfo_dist_isNull( neList );

    }
  }

  /**
   * @2024/03/29 Add
   * 從分佈式基站配置中取得網元組成資訊
   * @method getComponentArray_distBS
   * @param {Components_dist} NE_Topology - 分佈式基站的網元拓撲結構
   * @description
   * - 此方法處理分佈式基站的網元資訊，並將這些資訊加入到 componentArray 中，用於之後繪製拓撲圖。
   * - 遍歷每個 CU、DU 和 RU，將其 ID 和類型存儲，RU 還會包含位置資訊。
   */
  getComponentArray_distBS( NE_Topology: Components_dist ) {

    // 處理分佈式基站的網元資訊，放入 componentArray 用於繪拓樸圖
    const components = NE_Topology;

    for ( const cuid in components ) {

      this.componentArray.push( { type: 'cu', id: cuid } );

      const dus = components[cuid];

      for ( const duid in dus ) {

        this.componentArray.push( { type: 'du', id: duid, cuid: cuid } );

        const rus = dus[duid];

        for ( let i = 0; i < rus.length; i++ ) {

          const ruId = Object.keys( rus[i] )[0];
          const position = Object.values( rus[i] )[0];

          this.componentArray.push( { type: 'ru', id: ruId, duid: duid, position: this.commonService.formatPosition( position ) } );
        }
      }
    }
  }

  /**
   * @2024/03/29 Add
   * 處理當從 BsInfo_dist.info 中「沒有」取得值時的分佈式基站網元軟體版本資訊
   * @method if_BsInfo_dist_isNull
   * @param {NEList} neList - 網元列表
   * @description
   * - 當分佈式基站的訊息為空時，此方法遍歷 componentArray 並處理相應的網元軟體版本資訊。
   * - 對每個網元，查找相對應的軟體版本並更新至 swVersionMap，RU 類型還會更新位置訊息至 ruIdNamePositionMap。
   */
  if_BsInfo_dist_isNull( neList: NEList ) {
    // 遍歷 this.componentArray,對分佈式基站的網元軟體版本資訊進行處理
    for ( const component of this.componentArray ) {
      const correspondingNE = neList.components.find( ne => ne.id === component.id );
      
      // 如果找到對應的 NE
      if ( correspondingNE ) {
        const neType = component.type.toUpperCase(); // 轉換網元類型為大寫
        const neModel = `${correspondingNE.firm} / ${correspondingNE.modelname}`; // 構建網元型號字串
        const neSFversion = this.getActiveSoftwareVersion( correspondingNE.sm ) || 'None'; // 獲取活動軟體版本,如果沒有則設置為 'None'
        
        // 將軟體版本資訊存儲在 swVersionMap 中,以網元 ID 作為鍵
        this.swVersionMap[component.id] = { neName: correspondingNE.name, neType, neModel, neSFversion };
        
        // 如果是 RU 網元,將 NE 的名稱和位置存儲在 ruIdNamePositionMap 中,以 RU.id 作為鍵
        if ( component.type === 'ru' ) {
          this.ruIdNamePositionMap[component.id] = {
            name: correspondingNE.name, // NE 的名稱
            position: component.position // 從 componentArray 中獲取 RU 的位置資訊
          };
        }
      }
    }
  }

  /**
   * @2024/03/29 Add
   * 處理從 BsInfo_dist.info 中「有」取得值時的分佈式基站網元軟體版本資訊
   * @method if_BsInfo_dist_notNull
   * @param {Info_dist[]} info_distBS - 分佈式基站的詳細訊息
   * @param {NEList} neList - 網元列表
   * @description
   * - 此方法遍歷從 BsInfo_dist.info 中取得的訊息，並處理分佈式基站的網元軟體版本資訊。
   * - 分別處理 RU、CU 和 DU 的訊息，更新其名稱、位置和軟體版本至對應的映射表中。
   */
  if_BsInfo_dist_notNull( info_distBS: Info_dist[], neList: NEList ) {

    // 遍歷 selectBsInfo_dist.info 中的每個 Info 對象，對分佈式基站的網元軟體版本資訊進行處理
    for ( const info of info_distBS ) {
              
      // 如果 RU.id 存在
      if ( info.RU && info.RU.id ) {

        const ruId = info.RU.id; // 獲取 RU.id

        // 在 NEList 中找到與 RU.id 相對應的 NE
        const correspondingNE = neList.components.find( ne => ne.id === ruId );

        // 如果找到對應的 NE
        if ( correspondingNE ) {

          // 將 NE 的名稱和位置存儲在對象中,以 RU.id 作為鍵
          this.ruIdNamePositionMap[ruId] = {
            name: correspondingNE.name, // NE 的名稱
            position: this.commonService.formatPosition( info.RU.position ) // 格式化 RU 的位置資訊
          };

          // 處理軟體版本資訊
          const neType = 'RU'; // 設置網元類型為 'RU'
          const neModel = `${correspondingNE.firm} / ${correspondingNE.modelname}`; // 構建網元型號字串
          const neSFversion = this.getActiveSoftwareVersion( correspondingNE.sm ) || 'None'; // 獲取活動軟體版本,如果沒有則設置為 'None'
          this.swVersionMap[ruId] = { neName: correspondingNE.name, neType, neModel, neSFversion }; // 將軟體版本資訊存儲在 swVersionMap 中,以 RU.id 作為鍵
        }
      }

      // 處理 CU 和 DU 的軟體版本資訊
      if ( info.CU && info.CU.id ) { // 如果 CU.id 存在

        const cuId = info.CU.id; // 獲取 CU.id
        const correspondingNE = neList.components.find(ne => ne.id === cuId); // 在 NEList 中找到與 CU.id 相對應的 NE

        // 如果找到對應的 NE
        if ( correspondingNE ) {
          const neType = 'CU'; // 設置網元類型為 'CU'
          const neModel = `${correspondingNE.firm} / ${correspondingNE.modelname}`; // 構建網元型號字串
          const neSFversion = this.getActiveSoftwareVersion( correspondingNE.sm ) || 'None'; // 獲取活動軟體版本,如果沒有則設置為 'None'

          this.swVersionMap[cuId] = { neName: correspondingNE.name, neType, neModel, neSFversion }; // 將軟體版本資訊存儲在 swVersionMap 中,以 CU.id 作為鍵
        }
      }

      if ( info.DU && info.DU.id ) { // 如果 DU.id 存在

        const duId = info.DU.id; // 獲取 DU.id
        const correspondingNE = neList.components.find( ne => ne.id === duId ); // 在 NEList 中找到與 DU.id 相對應的 NE

        // 如果找到對應的 NE
        if ( correspondingNE ) { 
          const neType = 'DU';   // 設置網元類型為 'DU'
          const neModel = `${correspondingNE.firm} / ${correspondingNE.modelname}`; // 構建網元型號字串
          const neSFversion = this.getActiveSoftwareVersion( correspondingNE.sm ) || 'None'; // 獲取活動軟體版本,如果沒有則設置為 'None'
          
          this.swVersionMap[duId] = { neName: correspondingNE.name, neType, neModel, neSFversion }; // 將軟體版本資訊存儲在 swVersionMap 中,以 DU.id 作為鍵
        }
      }
    }
  }

  /**
   * @2024/03/27 Add
   * 獲取網元目前使用的軟體版本
   * @method getActiveSoftwareVersion
   * @param {Sm} sm - 軟體管理對象，包含軟體清單和槽位訊息
   * @returns {string | undefined} - 返回活動的軟體版本號，如果無活動版本則返回 undefined
   * @description
   * - 此方法從軟體管理對象中找到當前激活的軟體槽位，並返回其版本號。
   * - 如果沒有激活的槽位或缺少版本訊息，則返回 undefined。
   */
  getActiveSoftwareVersion( sm: Sm ): string | undefined {

    // 如果 sm 和 software-inventory 和 software-slot 存在
    if ( sm && sm['software-inventory'] && sm['software-inventory']['software-slot'] ) {

      // 找到 active 為 'true' 的 slot
      const activeSlot = sm['software-inventory']['software-slot'].find( slot => slot.active === 'true' );

      // 如果找到活動 slot 並且有 build-version
      if ( activeSlot && activeSlot['build-version'] ) {

        // 返回 build-version
        return activeSlot['build-version'];
      }
    }

    // 如果沒有找到活動軟體版本，返回 undefined
    return undefined;
  }

  // ↓ 編輯設定 @2024/04/14 Add ↓
  
    // 宣告 BsBasicInfoEditWindow 模板參考變數
    @ViewChild('BsBasicInfoEditWindow') BsBasicInfoEditWindow!: TemplateRef<any>;

    // 宣告 BsBasicInfoEditForm 表單群組變數
    BsBasicInfoEditForm: FormGroup = new FormGroup({});
    
    // 宣告 BsBasicInfoEditWindowRef 彈出視窗參考變數
    BsBasicInfoEditWindowRef!: MatDialogRef<any>;

    /**
     * @2024/04/14 Add
     * 建立基站基本訊息編輯表單
     * @method createBsBasicInfoEditForm
     * @description
     * - 此方法用於使用 FormBuilder 建立 BsBasicInfoEditForm 表單群組。
     * - 表單包含基站名稱、描述、經緯度，並動態生成 RU 控制項。
     * - RU 控制項的生成依賴於 RU 的數量和配置。
     */
    createBsBasicInfoEditForm() {
      // 使用 FormBuilder 建立 BsBasicInfoEditForm 表單群組
      this.BsBasicInfoEditForm = this.fb.group({
        // 宣告 bsName 表單控制項
        bsName: '',
        // 宣告 description 表單控制項
        description: '',
        // 宣告 longitude 表單控制項
        longitude: '',
        // 宣告 latitude 表單控制項
        latitude: '',
        // 使用 generateRuControls() 方法動態生成 RU 控制項
        ...this.generateRuControls()
      });
    }

    /**
     * @2024/04/14 Add
     * 動態生成 RU 控制項
     * @method generateRuControls
     * @returns {object} 控制項物件，每個 RU 一對經緯度控制項
     * @description
     * - 此方法基於 ruIdNamePositionMap 中的 RU 數量動態生成表單控制項。
     * - 為每個 RU 創建一對經度和緯度的表單控制項。
     * - 控制項的命名格式為 `longitude_{index}` 和 `latitude_{index}`。
     */
    generateRuControls(): { [key: string]: any } {
      // 宣告 controls 物件變數
      const controls: { [key: string]: any } = {};

      // 若 selectBsInfo_dist 和 ruIdNamePositionMap 存在
      if (this.selectBsInfo_dist && this.ruIdNamePositionMap) {
        // 遍歷 ruIdNamePositionMap 的鍵值
        Object.keys( this.ruIdNamePositionMap ).forEach( ( ruId, index ) => {
          // 使用 `longitude_${index}` 作為名稱，建立經度表單控制項
          controls[`longitude_${index}`] = this.fb.control('');
          // 使用 `latitude_${index}` 作為名稱，建立緯度表單控制項
          controls[`latitude_${index}`] = this.fb.control('');
        });
      }

      // 回傳 controls 物件
      return controls;
    }

    // @2024/04/14 Add
    // 宣告 ParsePositionPipe 位置解析管道
    private parsePositionPipe = new ParsePositionPipe();

    /**
     * @2024/04/14 Add
     * 更新基站基本訊息編輯表單
     * @method updateBsBasicInfoEditForm
     * @description
     * - 此方法用於根據當前選擇的基站訊息更新 BsBasicInfoEditForm 表單的值。
     * - 根據 bsType 分別處理一體式和分佈式基站的數據。
     * - 如果是分佈式基站，還會更新每個 RU 的位置控制項。
     * - 使用 parsePositionPipe 轉換位置數據格式，並更新到表單控制項中。
     */
    updateBsBasicInfoEditForm() {
      // 根據 bsType 決定使用 selectBsInfo 或 selectBsInfo_dist
      const bsInfo = this.bsType === "1" ? this.selectBsInfo : this.selectBsInfo_dist;

      // 若 bsInfo 存在
      if  ( bsInfo ) {
        // 使用 parsePositionPipe 解析位置字串，若無則設為空物件
        const position = bsInfo.position ? this.parsePositionPipe.transform( bsInfo.position ) : { lat: '', lng: '' };
        
        // 更新 BsBasicInfoEditForm 表單群組的值
        this.BsBasicInfoEditForm.patchValue({
          // 設定 bsName 的值
          bsName: bsInfo.name || '',
          // 設定 description 的值
          description: bsInfo.description || '',
          // 設定 longitude 的值
          longitude: position.lng,
          // 設定 latitude 的值
          latitude: position.lat
        });
      }

      // 若 bsType 為 "2" 且 ruIdNamePositionMap 存在
      if ( this.bsType === "2" && this.ruIdNamePositionMap ) {
        // 遍歷 ruIdNamePositionMap 的鍵值對
        Object.entries( this.ruIdNamePositionMap ).forEach( ( [ruId, ruInfo], index ) => {
          // 使用 parsePositionPipe 解析位置字串
          const position = this.parsePositionPipe.transform(ruInfo.position);
          // 取得 `longitude_${index}` 表單控制項
          const longitudeControl = this.BsBasicInfoEditForm.get(`longitude_${index}`);
          // 取得 `latitude_${index}` 表單控制項
          const latitudeControl = this.BsBasicInfoEditForm.get(`latitude_${index}`);

          // 若 longitudeControl 和 latitudeControl 存在
          if ( longitudeControl && latitudeControl ) {
            // 設定 longitudeControl 的值
            longitudeControl.setValue( position.lng );
            // 設定 latitudeControl 的值
            latitudeControl.setValue( position.lat );
          }

          // 輸出位置資訊的日誌
          console.log("updateBsBasicInfoEditForm - RU 位置資訊，索引" + index + ": ", position);
        });
      }
    }

    /**
     * @2024/04/14 Add
     * 開啟基站基本資訊編輯彈出視窗
     * @method openBsBasicInfoEditWindow
     * @description
     * - 此方法用於初始化並開啟基站基本資訊編輯彈出視窗。
     * - 方法首先創建和更新表單的數據模型，然後使用 Angular Material 的彈出視窗服務來顯示表單。
     */
    openBsBasicInfoEditWindow() {
      // 建立 BsBasicInfoEditForm 表單群組
      this.createBsBasicInfoEditForm();
      // 更新 BsBasicInfoEditForm 表單群組的值
      this.updateBsBasicInfoEditForm();
      // 開啟 BsBasicInfoEditWindow 彈出視窗
      this.BsBasicInfoEditWindowRef = this.dialog.open( 
        this.BsBasicInfoEditWindow, { id: 'BsBasicInfoEditWindowRef' } );
    }

    /**
     * @2024/04/14 Add
     * 提交基站基本資訊編輯表單
     * @method BsBasicInfoEdit_Submit
     * @description
     * - 此方法用於處理基站基本資訊編輯表單的提交。
     * - 驗證表單數據是否有效後，根據基站類型（一體式或分佈式）構建更新數據對象。
     * - 對於一體式基站，直接調用更新方法；
     * - 對於分佈式基站，額外處理組件位置數據和其他相關參數後調用更新方法。
     * - 提交操作涉及更新基站配置如名稱、描述、位置等訊息，並可能涉及座標轉換。
     */
    BsBasicInfoEdit_Submit() {
      // 若 BsBasicInfoEditForm 表單有效
      if ( this.BsBasicInfoEditForm.valid ) {
        // 取得 BsBasicInfoEditForm 表單的值
        const formValue = this.BsBasicInfoEditForm.value;

        // 若 bsType 為 "1"
        if ( this.bsType === "1" ) {
          // 建立更新一體式基站的資料物件
          const updateData: ForUpdateBs = {
            // 設定編輯類型為 1
            edit_type: 1,
            // 設定 session 的值
            session: this.sessionId,
            // 設定 id 的值
            id: this.selectBsInfo.id,
            // 設定 name 的值
            name: formValue.bsName,
            // 設定 description 的值
            description: formValue.description,
            // 設定 bstype 的值
            bstype: String( this.selectBsInfo.bstype ),
            // 設定 position 的值
            position: `[${formValue.longitude},${formValue.latitude}]`,
            // 設定 components 的值
            components: this.selectBsInfo.components,
            // 設定 pci 的值
            pci: String( this.selectBsInfo.info['bs-conf'].pci ),
            // 設定 plmnid 的值
            plmnid: {
              // 設定 mnc 的值
              mnc: String( this.selectBsInfo.info.pLMNId_MNC ),
              // 設定 mcc 的值
              mcc: String( this.selectBsInfo.info.pLMNId_MCC )
            },
            // 設定 nci 的值
            nci: String( this.selectBsInfo.info['bs-conf'].nci ),
            // 設定 gpslatitude 的值
            gpslatitude: String( formValue.latitude * 1000000 ),
            // 設定 gpslongitude 的值
            gpslongitude: String( formValue.longitude * 1000000 ),
            // 設定 nrarfcndl 的值
            nrarfcndl: String( this.selectBsInfo.info['bs-conf']['nrarfcn-dl'] ),
            // 設定 nrarfcnul 的值
            nrarfcnul: String( this.selectBsInfo.info['bs-conf']['nrarfcn-ul'] ),
            // 設定 channelbandwidth 的值
            channelbandwidth: String( this.selectBsInfo.info['bs-conf']['channel-bandwidth'] ),
            // 設定 txpower 的值
            txpower: String( this.selectBsInfo.info['bs-conf']['tx-power'] ),
            // 設定 tac 的值
            tac: String( this.selectBsInfo.info['bs-conf'].tac ),
            // 設定 extension_info 的值
            extension_info: this.selectBsInfo.extension_info
          };

          // 呼叫 updateBs() 方法更新一體式基站
          this.updateBs( updateData );

        // 若 bsType 為 "2"
        } else if (this.bsType === "2") {
          // 建立更新分佈式基站的 components 資料物件
          const componentsData: Components_dist = {};
        
          // 遍歷 CU
          for (const cuId in this.selectBsInfo_dist.components) {
            // 初始化 CU 的 components 資料物件
            componentsData[cuId] = {};
            // 遍歷 DU
            for (const duId in this.selectBsInfo_dist.components[cuId]) {
              // 初始化 DU 的 components 資料物件
              componentsData[cuId][duId] = [];
              // 遍歷 RU
              for ( const ruInfo of this.selectBsInfo_dist.components[cuId][duId] ) {
                // 取得 RU 的 ID
                const ruId = Object.keys( ruInfo )[0];
                // 取得 RU 的索引
                const index = Object.keys( this.ruIdNamePositionMap ).findIndex( id => id === ruId );
                
                // 取得 RU 的經度表單控制項
                const longitudeControl = this.BsBasicInfoEditForm.get(`longitude_${index}`);
                // 取得 RU 的緯度表單控制項
                const latitudeControl = this.BsBasicInfoEditForm.get(`latitude_${index}`);
        
                // 若 longitudeControl 和 latitudeControl 存在
                if ( longitudeControl && latitudeControl ) {
                  // 建立 RU 的位置物件
                  const position = {
                    // 設定經度的值
                    longitude: longitudeControl.value,
                    // 設定緯度的值
                    latitude: latitudeControl.value
                  };

                  // 新增 RU 的位置資料到 components 資料物件
                  componentsData[cuId][duId].push({ 
                    [ruId]: `[${longitudeControl.value},${latitudeControl.value}]`
                  });
                  
                } else {
                  // 若表單控制項不存在，則使用原始位置
                  componentsData[cuId][duId].push( { [ruId]: ruInfo[ruId] } );
                }
              }
            }
          }

          // 從 extension_info 中獲取 cellinfo 資訊
          const cellinfo: Cellinfo_dist[] = this.selectBsInfo_dist.extension_info.map( info => ({
            // 設定 nRPCI 的值
            nRPCI: info.NRCellDU.db.nRPCI,
            // 設定 nRTAC 的值
            nRTAC: info.NRCellDU.db.nRTAC,
            // 設定 arfcnDL 的值
            arfcnDL: info.NRCellDU.db.arfcnDL,
            // 設定 arfcnUL 的值
            arfcnUL: info.NRCellDU.db.arfcnUL,
            // 設定 bSChannelBwDL 的值
            bSChannelBwDL: info.NRCellDU.db.bSChannelBwDL,
            // 設定 configuredMaxTxPower 的值
            configuredMaxTxPower: info.NRSectorCarrier.db.configuredMaxTxPower,
            // 設定 pLMNId_MCC 的值
            pLMNId_MCC: info.NRCellDU.db.pLMNId_MCC,
            // 設定 pLMNId_MNC 的值
            pLMNId_MNC: info.NRCellDU.db.pLMNId_MNC,
            // 設定 nci 的值
            nci: info.nci
          }));

          // 建立更新分佈式基站的資料物件
          const updateData: ForUpdateDistributedBs = {
            // 設定編輯類型為 1
            edit_type: 1,
            // 設定 session 的值
            session: this.sessionId,
            // 設定 id 的值
            id: this.selectBsInfo_dist.id,
            // 設定 name 的值
            name: formValue.bsName,
            // 設定 bstype 的值
            bstype: String( this.selectBsInfo_dist.bstype ),
            // 設定 description 的值
            description: formValue.description,
            // 設定 components 的值
            components: componentsData,
            // 設定 cellinfo 的值
            cellinfo: cellinfo,
            // 設定 extension_info 的值
            extension_info: this.selectBsInfo_dist.extension_info
          };

          // 呼叫 updateDistributedBs() 方法更新分佈式基站
          this.updateDistributedBs( updateData );
        }
      }
    }
  
  // ↑ 編輯設定 @2024/04/17 Update ↑


// ↑ 基本資訊區 ↑
  


// ↓ 繪製拓樸圖區 @2024/05/08 Update ↓

  // 使用 @ViewChild 裝飾器獲取 canvas 元素的引用
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  /**
   * 獲取一體式基站的中心位置
   * @method getAllInOnePosition
   * @returns {x: number, y: number} - 基站的中心坐標
   * @description
   * - 此方法計算並返回一體式基站在畫布上的中心位置。
   * - 利用畫布的寬度和高度來計算中心點。
   */
  getAllInOnePosition(): { x: number, y: number } {
    const  canvasWidth = this.canvas.nativeElement.width; // 獲取畫布寬度
    const canvasHeight = this.canvas.nativeElement.height; // 獲取畫布高度
    const x = canvasWidth / 2; // 水平置中
    const y = canvasHeight / 2; // 垂直置中
    return { x, y }; // 返回位置
  }

  /**
   * 獲取 CU 的位置
   * @method getCuPosition
   * @param {any} cu - CU 元件的參考
   * @returns {x: number, y: number} - CU 的坐標位置
   * @description
   * - 此方法計算並返回指定 CU 元件在畫布上的位置。
   * - 位置取決於 CU 在 componentArray 中的索引和畫布的總數量。
   */
  getCuPosition( cu: any ): { x: number, y: number } {
    const index = this.componentArray.filter( c => c.type === 'cu' ).indexOf( cu ); // 獲取 CU 在 componentArray 中的索引
    const x = this.canvas.nativeElement.width / 4; // CU 的 x 座標
    const y = this.canvas.nativeElement.height / ( this.componentArray.filter( c => c.type === 'cu' ).length + 1 ) * ( index + 1 ); // CU 的 y 座標
    return { x, y }; // 返回位置
  }

  /**
   * 獲取 DU 的位置
   * @method getDuPosition
   * @param {any} du - DU 元件的參考
   * @returns {x: number, y: number} - DU 的坐標位置
   * @description
   * - 此方法計算並返回指定 DU 元件在畫布上的位置。
   * - 位置取決於 DU 在 componentArray 中的索引和畫布的總數量。
   */
  getDuPosition( du: any ): { x: number, y: number } {
    const index = this.componentArray.filter( c => c.type === 'du' ).indexOf( du ); // 獲取 DU 在 componentArray 中的索引
    const x = this.canvas.nativeElement.width * 0.535; // DU 的 x 座標
    const y = this.canvas.nativeElement.height / ( this.componentArray.filter( c => c.type === 'du' ).length + 1 ) * ( index + 1 ); // DU 的 y 座標
    return { x, y }; // 返回位置
  }

  /**
   * 獲取 RU 的位置
   * @method getRuPosition
   * @param {any} ru - RU 元件的參考
   * @returns {x: number, y: number} - RU 的坐標位置
   * @description
   * - 此方法計算並返回指定 RU 元件在畫布上的位置。
   * - 位置取決於 RU 在 componentArray 中的索引和畫布的總數量，以及 RU 的總數。
   */
  getRuPosition( ru: any ): { x: number, y: number } {
    const index = this.componentArray.filter( c => c.type === 'ru' ).indexOf( ru ); // 獲取 RU 在 componentArray 中的索引
    const ruCount = this.componentArray.filter( c => c.type === 'ru' ).length; // 獲取 RU 的數量
    const x = this.canvas.nativeElement.width * 0.75; // 調整 RU 的 x 座標
    const y = this.canvas.nativeElement.height / ( ruCount + 1 ) * ( index + 1 ) * 1.1; // 均勻分佈 RU 的 y 座標
    return { x, y }; // 返回位置
  }

  /**
   * 獲取網元名稱
   * @method getComponentName
   * @param {string} id - 網元的唯一標識符
   * @returns {string} - 返回網元的名稱
   * @description
   * - 此方法根據網元的 ID 從 NEList 中查找並返回網元的名稱。
   * - 如果無法找到對應的網元，則返回空字符串。
   */
  getComponentName( id: string ): string {
    const component = this.NEList.components.find( c => c.id === id ); // 根據網元 ID 查找網元
    return component ? component.name : ''; // 返回網元名稱，如果找不到則返回空字串
  }

  /**
   * 獲取網元狀態
   * @method getComponentStatus
   * @param {string} id - 網元的唯一標識符
   * @returns {number} - 返回網元的狀態代碼
   * @description
   * - 此方法根據網元的 ID 從 NEList 中查找並返回網元的狀態。
   * - 如果無法找到對應的網元，則返回 0。
   */
  getComponentStatus(id: string): number {
    const component = this.NEList.components.find( c => c.id === id ); // 根據網元 ID 查找網元
    return component ? component.status : 0; // 返回網元狀態，如果找不到則返回 0
  }

  /**
   * 繪製連接線
   * @method drawConnectingLines
   * @description
   * - 此方法在畫布上繪製連接線，連接不同的網元。
   * - 利用 canvas 的 2D 上下文來繪製線條。
   * - 線條連接的是 CU 至 DU，以及 DU 至 RU 的位置。
   * - 每條線都根據計算得到的起點和終點坐標來進行繪製。
   */
  drawConnectingLines() {
    const canvas = this.canvas.nativeElement; // 獲取 canvas 元素
    const ctx = canvas.getContext('2d');      // 獲取繪圖上下文

    // 檢查渲染上下文是否存在
    if ( ctx ) {
      ctx.clearRect( 0, 0, canvas.width, canvas.height ); // 清除畫布

      ctx.lineWidth = 3;         // 設置線條寬度為 3
      ctx.strokeStyle = 'white'; // 設置線條顏色為白色

      // 繪製 CU 和 DU 之間的連接線
      this.componentArray.filter( c => c.type === 'cu' ).forEach( cu => {
        const cuPosition = this.getCuPosition( cu ); // 獲取 CU 位置
        this.componentArray.filter( c => c.type === 'du' ).forEach( du => {
          const duPosition = this.getDuPosition( du ); // 獲取 DU 位置
          console.log("繪製 CU 和 DU 之間的連接線 - cuPosition", cuPosition); // 輸出 CU 位置
          console.log("繪製 CU 和 DU 之間的連接線 - duPosition", duPosition); // 輸出 DU 位置
          this.drawLine( ctx, cuPosition, duPosition ); // 繪製 CU 和 DU 之間的連接線
        });
      });

      // 繪製 DU 和 RU 之間的連接線
      this.componentArray.filter( du => du.type === 'du' ).forEach( du => {
        const duPosition = this.getDuPosition( du ); // 獲取 DU 位置
        this.componentArray.filter( ru => ru.type === 'ru' && ru.duid === du.id ).forEach( ru => {
          const ruPosition = this.getRuPosition( ru ); // 獲取 RU 位置
          console.log("繪製 DU 和 RU 之間的連接線 - duPosition", duPosition); // 輸出 DU 位置
          console.log("繪製 DU 和 RU 之間的連接線 - ruPosition", ruPosition); // 輸出 RU 位置
          this.drawLine( ctx, duPosition, ruPosition ); // 繪製 DU 和 RU 之間的連接線
        });
      });
    }
  }

  /**
   * 繪製單條線
   * @method drawLine
   * @param {CanvasRenderingContext2D} ctx - canvas 的 2D 繪圖上下文
   * @param {object} start - 線的起點坐標 {x, y}
   * @param {object} end - 線的終點坐標 {x, y}
   * @description
   * - 此方法在 canvas 上繪製一條從 start 到 end 的直線。
   * - 使用 moveTo 和 lineTo 方法設定線條的起點和終點。
   * - 調用 stroke 方法完成線條的繪製。
   */
  drawLine( ctx: CanvasRenderingContext2D, start: { x: number, y: number }, end: { x: number, y: number } ) {
    ctx.beginPath(); // 開始繪製新路徑
    ctx.moveTo( start.x, start.y ); // 移動到起點
    ctx.lineTo( end.x, end.y ); // 繪製到終點
    ctx.stroke(); // 描邊
  }

// ↑ 繪製拓樸圖區 @2024/05/08 Update ↑



// ↓ 基站參數區 @2024/05/09 Update ↓

  bsParametersType: string = 'Basic';       // 預設選擇 "Basic"    @2024/03/29 Add 
  //bsParametersType: string = 'Advanced';  // 預設選擇 "Advanced" @2024/03/29 Add

  /**
   * @2024/03/29 Add
   * 變更 Bs Parameters 視窗顯示類型的函數
   * @method changeBsParametersType
   * @param {MatButtonToggleChange} e - 切換按鈕的事件物件
   * @description
   * - 根據當前選擇的 Log 類型載入數據
   * - 更新當前類型，以便知道哪個 Bs Parameters 類型被選中
   */
  changeBsParametersType( e: MatButtonToggleChange ) {

    // 根據當前選擇的 Log 類型載入數據
    if ( e.value === 'Basic' ) {

      this.bsParametersType = 'Basic';

    } else if ( e.value === 'Advanced' ) {

      this.bsParametersType = 'Advanced';
    }

    // 更新當前類型，以便知道哪個 Bs Parameters 類型被選中
    this.bsParametersType = e.value;
    console.log( '頁面切換後，顯示的 Bs Parameters 類型:', this.bsParametersType+
                  '\nLog type displayed after tab switch:', this.bsParametersType );
  }

  nciList: string[] = [];   // 存儲 NCI 列表
  selectedNci: string = ''; // 當前選擇的 NCI（用於基站參數）
  selectedExtensionInfo: ExtensionInfo | undefined; // 當前選擇的 ExtensionInfo

  /**
   * @2024/04/25 Update
   * 當選擇的 NCI 發生變化時觸發的函數（ 用於基站參數 ）
   * @method onBsParamSelectedNciChange
   * @description
   * - 根據基站類型和選擇的 NCI，更新當前選擇的 ExtensionInfo
   */
  onBsParamSelectedNciChange() {
    if ( this.selectedNci ) {
      if ( this.bsType === '1' && this.selectBsInfo ) {
        this.selectedExtensionInfo = this.selectBsInfo.extension_info.find( info => info.nci === this.selectedNci );
      } else if ( this.bsType === '2' && this.selectBsInfo_dist ) {
        this.selectedExtensionInfo = this.selectBsInfo_dist.extension_info.find( info => info.nci === this.selectedNci );
      }
      // Additional logic to update the displayed data as needed
    }
  }
  
  /**
   * @2024/04/15 Add
   * 當點擊搜尋按鈕時觸發的函數（用於基站參數）
   * @method onBsParamSearchClick
   * @description
   * - 根據基站類型和選擇的 NCI，更新當前選擇的 ExtensionInfo
   */
  onBsParamSearchClick() {
    if (this.bsType === '1' && this.selectBsInfo) {
      this.selectedExtensionInfo = this.selectBsInfo.extension_info.find(info => info.nci === this.selectedNci);
    } else if (this.bsType === '2' && this.selectBsInfo_dist) {
      this.selectedExtensionInfo = this.selectBsInfo_dist.extension_info.find(info => info.nci === this.selectedNci);
    }
  }

  /**
   * @2024/04/15 Add
   * 當點擊清除按鈕時觸發的函數（用於基站參數）
   * @method onBsParamClearClick
   * @description
   * - 根據基站類型，將選擇的 NCI 重置為預設值
   * - 根據重置後的 NCI，更新當前選擇的 ExtensionInfo
   */
  onBsParamClearClick() {
    if (this.bsType === '1' && this.selectBsInfo) {
      this.selectedNci = this.nciList[0];
      this.selectedExtensionInfo = this.selectBsInfo.extension_info.find(info => info.nci === this.selectedNci);
    } else if (this.bsType === '2' && this.selectBsInfo_dist) {
      this.selectedNci = this.nciList[0];
      this.selectedExtensionInfo = this.selectBsInfo_dist.extension_info.find(info => info.nci === this.selectedNci);
    }
  }


  /**
   * @2024/05/09 Update
   * 根據指定選項同步 DS 和 DB 結構之間的extension_info 
   * @method syncAllExtensionInfo
   * @param { any } extension - 包含 DS 和 DB 結構的擴展對象
   * @param { string } option - 同步選項，'NMS' 或其他，用於確定同步方向
   * @returns { any } 修改後的擴展對象，其中 DS 和 DB 結構已同步
   * @description
   * - 根據提供的選項在 db 和 ds 之間同步屬性
   * - 遞迴處理嵌套對象以確保完整的同步深度
   * - 幫助維持網路管理系統中配置狀態的一致性
   */
  syncAllExtensionInfo( extension: any, option: string ) {
    // 從擴展對象中檢索所有鍵以進行迭代
    const keys = Object.keys( extension );

    // 在擴展對象中迭代每個鍵
    keys.forEach( key => {
      // 檢查當前鍵的屬性是否存在且是一個對象
      if ( extension[key] && typeof extension[key] === 'object' ) {
        // 檢查同步選項是否為 'NMS'
        if ( option === 'NMS' ) {
          // NMS 選項：將 db 同步到 ds
          if ( extension[key].ds && extension[key].db ) {
            extension[key].ds = { ...extension[key].db };
          }
        } else {
          // 其他選項：將 ds 同步到 db
          if ( extension[key].ds && extension[key].db ) {
            extension[key].db = { ...extension[key].ds };
          }
        }
        // 遞迴同步嵌套對象以確保處理所有層次
        this.syncAllExtensionInfo( extension[key], option );
      }
    });

      // 返回經過同步處理後的修改擴展對象
      return extension;
  }

  // @2024/05/07 Add
  // 用於儲存更新要設定的編輯類型
  editType: number = 0;

  /**
   * @2024/05/09 Update
   * 提交 Base Station Parameter Edit 表單的方法
   * @method BsParamEdit_ForAllTableSyncAction_Submit
   * @param   { string } option - 同步選項，用於決定同步所有設定是要基於網管系統( NMS - db )的參數設定，還是要基於基站( BS - ds )的參數設定
   * @returns { void }
   * @description
   * - 這個方法根據用戶選擇的同步選項來設定和提交基站參數的更新
   * - 根據選擇，重置並設定編輯類型
   * - 解析和轉換位置資訊為經緯度
   * - 建立和提交更新資料物件到相應的更新方法
   * - 對於一體式基站( bsType 為 "1" )，處理並更新一體式基站的所有參數資訊
   * - 對於分佈式基站( bsType 為 "2" )，處理並更新分佈式基站每個 cell 的所有參數資訊
   */
  BsParamEdit_ForAllTableSyncAction_Submit( option: string ) {

    // 重置編輯類型設定
    this.editType = 0;

    // 設定同步編輯類型
    if( option === "NMS" ) {

      // 如為依據網管設定同步
      this.editType = 2;

    } else {

      // 如為依據基站設定同步
      this.editType = 3;
    }

    // 若 bsType 為 "1"
    if ( this.bsType === "1" ) {    

      // 將位置字串解析為經緯度數組
      const positionArray = JSON.parse( this.selectBsInfo.position );

      // 計算經緯度並乘以 1000000
      const gpslatitude = positionArray[1] * 1000000;
      const gpslongitude = positionArray[0] * 1000000;
      
      // 建立更新一體式基站的資料物件
      const updateData: ForUpdateBs = {
        // 設定編輯類型
        edit_type: this.editType,
        // 設定 session 的值
        session: this.sessionId,
        // 設定 id 的值
        id: this.selectBsInfo.id,
        // 設定 name 的值
        name: this.selectBsInfo.name,
        // 設定 description 的值
        description: this.selectBsInfo.description,
        // 設定 bstype 的值
        bstype: String( this.selectBsInfo.bstype ),
        // 設定 position 的值
        position: this.selectBsInfo.position,
        // 設定 components 的值
        components: this.selectBsInfo.components,
        // 設定 pci 的值
        pci: String( this.selectBsInfo.info['bs-conf'].pci ),
        // 設定 plmnid 的值
        plmnid: {
          // 設定 mnc 的值
          mnc: String( this.selectBsInfo.info.pLMNId_MNC ),
          // 設定 mcc 的值
          mcc: String( this.selectBsInfo.info.pLMNId_MCC )
        },
        // 設定 nci 的值
        nci: String( this.selectBsInfo.info['bs-conf'].nci ),
        // 設定 gpslatitude 的值
        gpslatitude: String( gpslatitude ),
        // 設定 gpslongitude 的值
        gpslongitude: String( gpslongitude ),
        // 設定 nrarfcndl 的值
        nrarfcndl: String( this.selectBsInfo.info['bs-conf']['nrarfcn-dl'] ),
        // 設定 nrarfcnul 的值
        nrarfcnul: String( this.selectBsInfo.info['bs-conf']['nrarfcn-ul'] ),
        // 設定 channelbandwidth 的值
        channelbandwidth: String( this.selectBsInfo.info['bs-conf']['channel-bandwidth'] ),
        // 設定 txpower 的值
        txpower: String( this.selectBsInfo.info['bs-conf']['tx-power'] ),
        // 設定 tac 的值
        tac: String( this.selectBsInfo.info['bs-conf'].tac ),
      };

      // 依據選擇的同步選項設定 extension_info
      const syncedExtensionInfo = this.syncAllExtensionInfo( this.selectBsInfo.extension_info, option );

      // 設定 extension_info 的值
      updateData.extension_info = syncedExtensionInfo;

      // 呼叫 updateBs() 方法更新一體式基站
      this.updateBs( updateData );

    // 若 bsType 為 "2"
    } else if ( this.bsType === "2" ) {

      // 從 extension_info 中獲取 cellinfo 資訊
      const cellinfo: Cellinfo_dist[] = this.selectBsInfo_dist.extension_info.map( info => ({
        // 設定 nRPCI 的值
        nRPCI: info.NRCellDU.db.nRPCI,
        // 設定 nRTAC 的值
        nRTAC: info.NRCellDU.db.nRTAC,
        // 設定 arfcnDL 的值
        arfcnDL: info.NRCellDU.db.arfcnDL,
        // 設定 arfcnUL 的值
        arfcnUL: info.NRCellDU.db.arfcnUL,
        // 設定 bSChannelBwDL 的值
        bSChannelBwDL: info.NRCellDU.db.bSChannelBwDL,
        // 設定 configuredMaxTxPower 的值
        configuredMaxTxPower: info.NRSectorCarrier.db.configuredMaxTxPower,
        // 設定 pLMNId_MCC 的值
        pLMNId_MCC: info.NRCellDU.db.pLMNId_MCC,
        // 設定 pLMNId_MNC 的值
        pLMNId_MNC: info.NRCellDU.db.pLMNId_MNC,
        // 設定 nci 的值
        nci: info.nci
      }));

      // 建立更新分佈式基站的資料物件
      const updateData: ForUpdateDistributedBs = {
        // 設定編輯類型
        edit_type: this.editType,
        // 設定 session 的值
        session: this.sessionId,
        // 設定 id 的值
        id: this.selectBsInfo_dist.id,
        // 設定 name 的值
        name: this.selectBsInfo_dist.name,
        // 設定 bstype 的值
        bstype: String( this.selectBsInfo_dist.bstype ),
        // 設定 description 的值
        description: this.selectBsInfo_dist.description,
        // 設定 components 的值
        components: this.selectBsInfo_dist.components,
        // 設定 cellinfo 的值
        cellinfo: cellinfo,
      };

      // 依據選擇的同步選項設定 extension_info
      const syncedExtensionInfos = this.selectBsInfo_dist.extension_info.map( extInfo => {
        return this.syncAllExtensionInfo( extInfo, option );
      });
      updateData.extension_info = syncedExtensionInfos;

      // 呼叫 updateDistributedBs() 方法更新分佈式基站
      this.updateDistributedBs( updateData );
    }
  }

  /**
   * @2024/05/09 Update
   * 轉換字符串為對應的枚舉值
   * @method convertToParamTableEnum
   * @param   { string } paramTableName - extension_info 參數表格名稱字符串
   * @returns { ExtensionInfoParamTableNames } - 返回枚舉對應的值
   * @description
   *    - 此方法將傳入的字符串參數名稱轉換為枚舉類型，用於後續索引操作
   */
  convertToParamTableEnum( paramTableName: string ): ExtensionInfoParamTableNames {
    // 將字符串轉換為枚舉值
    return ExtensionInfoParamTableNames[paramTableName as keyof typeof ExtensionInfoParamTableNames];
  }

  /**
   * @2024/05/09 Update
   * 單一參數欄位數據同步 - 一體式用
   * @method syncSingleParamInExtensionInfoTable
   * @param {ExtensionInfo_ForUpdateBs[]} extension - extension_info 數據數組
   * @param {string} option - 同步選項 ('NMS' 或 'BS')
   * @param {string} ParamTableName - 參數表格名
   * @param {string} editParamName - 欲同步的具體參數名稱
   * @returns {ExtensionInfo_ForUpdateBs[]} - 返回更新後的數據數組
   * @description
   *    - 根據指定的同步選項更新指定的欄位數據
   *    - 'NMS' 選項將 db 數據同步到 ds
   *    - 'BS' 選項將 ds 數據同步到 db
   */
  syncSingleParamInExtensionInfoTable( 
    extension: ExtensionInfo_ForUpdateBs[], 
      option: string, 
        ParamTableName: string, 
          editParamName: string ): ExtensionInfo_ForUpdateBs[] {

    // 獲取枚舉類型的 extension_info 參數表格名稱
    const paramTableName = this.convertToParamTableEnum( ParamTableName );

    // 對數據數組進行映射和更新
    return extension.map( ext => {

        // 獲取當前extension_info 中的字段數據
        const fieldData = ext[paramTableName];

        // 確保必要數據存在並進行更新
        if ( fieldData && 'db' in fieldData && 'ds' in fieldData && editParamName && fieldData.db && fieldData.ds ) {

            // 決定新值來源
            const newValue = ( fieldData.ds as any )[editParamName as keyof typeof fieldData.ds] || ( fieldData.db as any )[editParamName as keyof typeof fieldData.db];

            // 根據選項同步數據
            if ( option === 'NMS' ) {
                return {
                    [paramTableName]: {
                        ds: {
                            ...fieldData.ds,
                            [editParamName]: (fieldData.db as any)[editParamName as keyof typeof fieldData.db] // 同步 DB 值到 DS
                        }
                    }
                };
            } else {
                return {
                    [paramTableName]: {
                        db: {
                            ...fieldData.db,
                            [editParamName]: (fieldData.ds as any)[editParamName as keyof typeof fieldData.ds] // 同步 DS 值到 DB
                        }
                    }
                };
            }
        }
        // 沒有更新時返回 null
        return null;
    }).filter( x => x != null ) as ExtensionInfo_ForUpdateBs[]; // 過濾出已更新的元素
  }

  /**
   * @2024/05/09 Update
   * 單一參數欄位數據同步 - 分佈式用
   * @method syncSingleParamInExtensionInfoTable_dist
   * @param {ExtensionInfo_dist_ForUpdateDistributedBs[]} extension - extension_info 數據數組
   * @param {string} option - 同步選項 ('NMS' 或 'BS')
   * @param {string} ParamTableName - 參數表格名
   * @param {string} editParamName - 欲同步的具體參數名稱
   * @returns {ExtensionInfo_dist_ForUpdateDistributedBs[]} - 返回更新後的數據數組
   * @description
   *    - 根據指定的同步選項更新指定的欄位數據
   *    - 'NMS' 選項將 db 數據同步到 ds
   *    - 'BS' 選項將 ds 數據同步到 db
   */
  syncSingleParamInExtensionInfoTable_dist(
    extension: ExtensionInfo_dist_ForUpdateDistributedBs[], 
      option: string, 
        ParamTableName: string, 
          editParamName?: string ): ExtensionInfo_dist_ForUpdateDistributedBs[] {
    
    // 獲取枚舉類型的 extension_info 參數表格名稱
    const paramTableName = this.convertToParamTableEnum( ParamTableName );

    // 對數據數組進行映射和更新
    return extension.map( ext => {

        // 獲取當前extension_info 中的字段數據
        const fieldData = ext[paramTableName];

        // 確保必要數據存在並進行更新
        if ( fieldData && 'db' in fieldData && 'ds' in fieldData && editParamName && fieldData.db && fieldData.ds ) {

            // 決定新值來源
            const newValue = ( fieldData.ds as any )[editParamName as keyof typeof fieldData.ds] || ( fieldData.db as any )[editParamName as keyof typeof fieldData.db];

            // 根據選項同步數據
            if ( option === 'NMS' ) {
                return {
                    [paramTableName]: {
                        ds: {
                            ...fieldData.ds,
                            [editParamName]: ( fieldData.db as any )[editParamName as keyof typeof fieldData.db] // 同步 DB 值到 DS
                        }
                    }
                };
            } else {
                return {
                    [paramTableName]: {
                        db: {
                            ...fieldData.db,
                            [editParamName]: ( fieldData.ds as any )[editParamName as keyof typeof fieldData.ds] // 同步 DS 值到 DB
                        }
                    }
                };
            }
        }
        // 沒有更新時返回 null
        return null;
    }).filter( x => x != null ) as ExtensionInfo_dist_ForUpdateDistributedBs[]; // 過濾出已更新的元素
  }

  /**
   * @2024/05/08 Add
   * 提交基站單一欄位同步編輯操作的方法
   * @method BsParamEdit_ForSingleFieldSyncAction_Submit
   * @param {string} option - 同步選項，用於決定同步設定是基於網管系統(NMS)還是基站的本地設定(BS)
   * @param {string} paramTableName - 要同步的參數表格名稱
   * @param {string} [editParamName] - 欲同步的具體參數名稱（可選）
   * @description
   *    - 此方法根據用戶選擇的同步選項來設定並提交基站的單一欄位參數更新。
   *    - 根據 bsType 的值判斷基站類型（一體式或分佈式），進行相應的數據更新流程。
   *    - 對於一體式基站 ( bsType 為 "1" )：
   *        - 建立更新數據物件，包括基站的基本訊息及透過 `syncSingleParamInExtensionInfoTable` 方法同步更新的 extension_info。
   *        - 之後呼叫 `updateBs()` 方法以提交更新。
   *    - 對於分佈式基站 ( bsType 為 "2" )：
   *        - 先篩選出與選擇的 NCI 相關的 extension_info。
   *        - 使用 `syncSingleParamInExtensionInfoTable_dist` 方法處理同步操作，生成新的 extension_info 數組。
   *        - 建立更新數據物件，包括基站的基本訊息及更新後的 extension_info 。
   *        - 之後呼叫 `updateDistributedBs()` 方法以提交更新。
   *    - 該方法的行為取決於同步選項，以及被操作的基站類型。
   */
  BsParamEdit_ForSingleFieldSyncAction_Submit( option: string, paramTableName: string, editParamName?: string ) {

    // 若 bsType 為 "1"
    if ( this.bsType === "1" ) {    

      if( editParamName ) {

        // 建立更新一體式基站的資料物件
        const updateData: ForUpdateBs = {
          // 設定編輯類型
          edit_type: 4,
          // 設定 session 的值
          session: this.sessionId,
          // 設定 id 的值
          id: this.selectBsInfo.id,
          // 設定 name 的值
          name: this.selectBsInfo.name,
          // 設定 description 的值
          description: this.selectBsInfo.description,
          // 設定 bstype 的值
          bstype: String( this.selectBsInfo.bstype ),
          // 設定 position 的值
          position: this.selectBsInfo.position,
          // 設定 components 的值
          components: this.selectBsInfo.components,
          // 設定 extension_info 的值
          extension_info: this.syncSingleParamInExtensionInfoTable( this.selectBsInfo.extension_info, option, paramTableName, editParamName )
        };

        console.log("使用", option, "進行同步，POST 的 JSON 為:", updateData );

        // 呼叫 updateBs() 方法更新一體式基站
        this.updateBs( updateData );

      }

    // 若 bsType 為 "2"
    } else if ( this.bsType === "2" ) {

      if ( this.selectedExtensionInfo && this.selectedNci === this.selectedExtensionInfo.nci ) {
        const filteredInfo = this.selectBsInfo_dist.extension_info.filter( info => info.nci === this.selectedNci );
        const syncInfo = filteredInfo.map( info => this.syncSingleParamInExtensionInfoTable_dist( [info], option, paramTableName, editParamName)[0] );

        // 建立更新分佈式基站的資料物件
        const updateData: ForUpdateDistributedBs = {
          // 設定編輯類型
          edit_type: 4,
          // 設定 session 的值
          session: this.sessionId,
          // 設定 id 的值
          id: this.selectBsInfo_dist.id,
          // 設定 name 的值
          name: this.selectBsInfo_dist.name,
          // 設定 bstype 的值
          bstype: String( this.selectBsInfo_dist.bstype ),
          // 設定 description 的值
          description: this.selectBsInfo_dist.description,
          // 設定 components 的值
          components: this.selectBsInfo_dist.components,

          // 設定 extension_info 的值
          extension_info: syncInfo
        };

        console.log("使用", option, "進行同步，POST 的 JSON 為:", updateData );

        // 呼叫 updateDistributedBs() 方法更新分佈式基站
        this.updateDistributedBs( updateData );
      }
    }
  }

  // @2024/05/09 Add
  // ViewChild 裝飾器用來獲取模板中的 #editSingleParamValueWindow 模板引用變量，
  // 允許我們在 TypeScript 代碼中訪問這個 Angular 模板。
  @ViewChild('editSingleParamValueWindow') editSingleParamValueWindow!: TemplateRef<any>;

  // @2024/05/09 Add
  // 用於存儲彈出視窗的參考，以便可以進行開啟、操作和關閉彈出視窗的動作。
  // MatDialogRef 類型提供了一系列控制彈出視窗的方法，如 close() 用於關閉彈出視窗。
  editSingleParamValueWindowRef!: MatDialogRef<any>;

  // @2024/05/09 Add
  // FormGroup 類型的 editSingleParamForm 變量用來存儲和管理表單控制項的集合。
  // 這個表單群組包含了用於基站參數值的各個表單控制項，如 gNB ID、Cell ID 等。
  editSingleParamForm!: FormGroup;

  // @2024/05/09 Add
  createEditSingleParamForm(): void {
    // 使用 Angular 的 FormBuilder 創建表單群組，並為各表單控件設定初始值和驗證規則
    this.editSingleParamForm = this.fb.group({
      newParamValue: ['', [Validators.required]]
    });
  }

  // @2024/05/09 Add
  // 用於儲存參數表格名稱
  paramTableName: string = "";

  // @2024/05/09 Add
  // 用於儲存要編輯的參數表格內的參數名稱與當前值
  editParamName: string = "";
  editParamCurrentValue: string = "";

  // @2024/05/09 Add
  paramOptions: { [key: string]: Array<{value: string | number | boolean, label: string}> } = {
    'gNB-type': [{ value: 'SA', label: 'SA' }, { value: 'NSA', label: 'NSA' }, { value: 'SA_NSA', label: 'SA_NSA' }],
    'equipmentType': [
      { value: 'RRU', label: 'RRU' },
      { value: 'BBU', label: 'BBU' },
      { value: 'Wide-area-BS-cabinet', label: 'Wide-area-BS-cabinet' },
      { value: 'Medium-range-BS', label: 'Medium-range-BS' }
    ],
    'environmentType': [{ value: 'Indoor', label: 'Indoor' }, { value: 'Outdoor', label: 'Outdoor' }],
    'powerInterface': [{ value: 'AC', label: 'AC' }, { value: 'DC', label: 'DC' }],
    'autoScalable': [{ value: true, label: 'true' }, { value: false, label: 'false' }],
    'administrativeState': [{ value: 'Locked', label: 'Locked' }, { value: 'Shutdown', label: 'Shutdown' }, { value: 'Unlocked', label: 'Unlocked' }],
    'ssbSubCarrierSpacing': [{ value: '15', label: '15' }, { value: '30', label: '30' }, { value: '60', label: '60' }, { value: '120', label: '120' }, { value: '240', label: '240' }],
    'txDirection': [{ value: 'DL', label: 'DL' }, { value: 'UL', label: 'UL' }, { value: 'DL and UL', label: 'DL and UL' }],
    'bwpContext': [{ value: 0, label: 'DL' }, { value: 1, label: 'UL' }, { value: 2, label: 'SUL' }],
    'isInitialBwp': [{ value: 0, label: 'INITIAL' }, { value: 1, label: 'OTHER' }],
    'cyclicPrefix': [{ value: 0, label: 'Normal' }, { value: 1, label: 'Extended' }]
  };

  isDropdown( paramName: string ): boolean {
    return this.paramOptions.hasOwnProperty( paramName );
  }

  getOptions( paramName: string ): Array< { value: string | number | boolean, label: string } > {
    return this.paramOptions[paramName] || [];
  }

  editOption: string = "";

  // @2024/05/09 Add
  openEditSingleParamValueWindow( option: string, ParamTableName: string, EditParamName: string, currentValue: any ): void {

    // 一開啟視窗先初始化四變數
    this.paramTableName = "";
    this.editParamName = "";
    this.editParamCurrentValue = "";
    this.editOption = "";

    // 輸出當前要調整的欄位內參數名稱以供調試
    console.log( "paramTableName is:", ParamTableName );
    console.log( ", and editParamName is:", EditParamName );
    this.paramTableName = ParamTableName;
    this.editParamName = EditParamName;
    this.editParamCurrentValue = currentValue;
    this.editOption = option;

    // 呼叫函數初始化表單
    this.createEditSingleParamForm(); // 初始化表單

    // 開啟彈出視窗，傳入對應模板和數據
    this.editSingleParamValueWindowRef = this.dialog.open( this.editSingleParamValueWindow, {
        id: 'editSingleParamValueWindowRef' // 設定彈出視窗的唯一標識
    });

    // 訂閱彈出視窗關閉事件，用於清理或記錄
    this.editSingleParamValueWindowRef.afterClosed().subscribe( result => {
        console.log('editSingleParamValueWindow was closed'); // 輸出彈出視窗關閉的日誌
    });
  }


  // 一體式基站用
  updateSingleParamInExtensionInfoTable(
    extension: ExtensionInfo_ForUpdateBs[],
    option: string,
    ParamTableName: string,
    editParamName: string,
    newValue: any
  ): any {
    const paramTableName = this.convertToParamTableEnum(ParamTableName);

    return extension.map(ext => {
      const fieldData = ext[paramTableName];
      if (fieldData) {
        const updateField = option === 'NMS' ? 'db' : 'ds';
        const detail = fieldData[updateField] as any; // 斷言為任意類型，以允許索引訪問
        if (updateField in fieldData && detail) {
          if ( editParamName in detail ) {
            // 更新指定的參數值，並保留其他所有參數
            const updatedDetails = {
              ...detail,
              [editParamName]: newValue
            };
            return { [paramTableName]: { [updateField]: updatedDetails } };
          }
        }
      }
      return null; // 如果沒有更新，返回 null
    }).filter(ext => ext !== null); // 過濾出已更新的元素
  }

  // 分佈式基站用
  updateSingleParamInExtensionInfoTable_dist(
    extension: ExtensionInfo_dist_ForUpdateDistributedBs[],
    option: string,
    ParamTableName: string,
    editParamName: string,
    newValue: any
  ): any {
    const paramTableName = this.convertToParamTableEnum(ParamTableName);

    return extension.map(ext => {
      const fieldData = ext[paramTableName];
      if (fieldData) {
        const updateField = option === 'NMS' ? 'db' : 'ds';
        const detail = fieldData[updateField] as any; // 斷言為任意類型，以允許索引訪問
        if (updateField in fieldData && detail) {
          if (editParamName in detail) {
            // 更新指定的參數值，並保留其他所有參數
            const updatedDetails = {
              ...detail,
              [editParamName]: newValue
            };
            return { [paramTableName]: { [updateField]: updatedDetails } };
          }
        }
      }
      return null; // 如果沒有更新，返回 null
    }).filter(ext => ext !== null); // 過濾出已更新的元素
  }


  // 編輯單參數欄位設定值用 @2024/05/09 Add
  BsParamEdit_editSingleParamValue_Submit( option: string, paramTableName: string, editParamName: string ) {
    
    // 從表單獲取新值
    const newValue = this.editSingleParamForm.get('newParamValue')!.value;

    // 若 bsType 為 "1"
    if ( this.bsType === "1" ) {
        if ( editParamName ) {
            const updatedExtensionInfo = this.updateSingleParamInExtensionInfoTable(
                this.selectBsInfo.extension_info, 
                option, 
                paramTableName, 
                editParamName, 
                newValue
            );

            const updateData: ForUpdateBs = {
                edit_type: 4,
                session: this.sessionId,
                id: this.selectBsInfo.id,
                name: this.selectBsInfo.name,
                description: this.selectBsInfo.description,
                bstype: String( this.selectBsInfo.bstype ),
                position: this.selectBsInfo.position,
                components: this.selectBsInfo.components,
                extension_info: updatedExtensionInfo
            };

            console.log( "提交更新的數據:", updateData );
            this.updateBs( updateData );
        }
    } else if ( this.bsType === "2" ) {
        if ( this.selectedExtensionInfo && this.selectedNci === this.selectedExtensionInfo.nci ) {
            const filteredInfo = this.selectBsInfo_dist.extension_info.filter( info => info.nci === this.selectedNci );
            const updatedExtensionInfo = filteredInfo.map( info => 
                this.updateSingleParamInExtensionInfoTable_dist( [info], option, paramTableName, editParamName, newValue )[0]
            );

            const updateData: ForUpdateDistributedBs = {
                edit_type: 4,
                session: this.sessionId,
                id: this.selectBsInfo_dist.id,
                name: this.selectBsInfo_dist.name,
                bstype: String( this.selectBsInfo_dist.bstype ),
                description: this.selectBsInfo_dist.description,
                components: this.selectBsInfo_dist.components,
                extension_info: updatedExtensionInfo
            };

            console.log( "提交更新的數據:", updateData );
            this.updateDistributedBs( updateData );
        }
    }
  }



// ↑ 基站參數區 @2024/05/09 Update ↑



// ↓ 鄰居基站列表區 @2024/05/06 Update ↓

  neighborList: Neighbor[] = [];
  selectedNeighborNci: string = ''; // 當前選擇的NCI（用於鄰居基站列表）

  /**
   * @2024/04/16 Add
   * 當選擇的 NCI 發生變化時觸發的函數（用於鄰居基站列表）
   * @method onNeighborSelectedNciChange
   * @description
   * - 根據選擇的 NCI，更新鄰居基站列表
   */
  onNeighborSelectedNciChange() {
    this.neighborList = this.getNeighborList( this.selectedNeighborNci );
  }

  /**
   * @2024/04/16 Add
   * 當點擊搜尋按鈕時觸發的函數（用於鄰居基站列表）
   * @method onNeighborSearchClick
   * @description
   * - 根據選擇的 NCI，更新鄰居基站列表
   */
  onNeighborSearchClick() {
    this.neighborList = this.getNeighborList( this.selectedNeighborNci );
  }

  /**
   * @2024/04/16 Add
   * 當點擊清除按鈕時觸發的函數（用於鄰居基站列表）
   * @method onNeighborClearClick
   * @description
   * - 根據基站類型，將選擇的 NCI 重置為預設值
   * - 根據重置後的 NCI，更新鄰居基站列表
   */
  onNeighborClearClick() {
    if ( this.bsType === '1' && this.selectBsInfo ) {
      this.selectedNeighborNci = this.nciList[0];
    } else if ( this.bsType === '2' && this.selectBsInfo_dist ) {
      this.selectedNeighborNci = this.nciList[0];
    }
    this.neighborList = this.getNeighborList( this.selectedNeighborNci );
  }

  /**
   * @2024/04/16 Add
   * 根據選擇的 NCI 獲取鄰居基站列表
   * @method getNeighborList
   * @param {string} nci - 選擇的 NCI
   * @returns {Neighbor[]} 鄰居基站列表
   */
  getNeighborList( nci: string ): Neighbor[] {
    if ( this.bsType === '1' && this.selectBsInfo ) {
      return this.selectBsInfo.anr['anr-son-output'].neighbor;
    } else if ( this.bsType === '2' && this.selectBsInfo_dist ) {
      return this.selectBsInfo_dist.anr[nci]['anr-son-output'].neighbor;
    }
    return [];
  }

  /**
   * @2024/04/16 Add
   * 將 16 進制字串轉換為 10 進制數字
   * @method hexToDecimal
   * @param { string } hex - 16 進制字串
   * @returns { number } 10 進制數字
   */
  hexToDecimal( hex: string ): number {
    return parseInt( hex, 16 );
  }


  // @2024/05/05 Add
  // ViewChild 裝飾器用來獲取模板中的 #addNeighborBsWindow、#editNeighborBsWindow 模板引用變量，
  // 允許我們在 TypeScript 代碼中訪問這個 Angular 模板。
  @ViewChild('addNeighborBsWindow') addNeighborBsWindow!: TemplateRef<any>;
  @ViewChild('editNeighborBsWindow') editNeighborBsWindow!: TemplateRef<any>;

  // @2024/05/05 Add
  // 用於存儲彈出視窗的參考，以便可以進行開啟、操作和關閉彈出視窗的動作。
  // MatDialogRef 類型提供了一系列控制彈出視窗的方法，如 close() 用於關閉彈出視窗。
  addOrEditNeighborBsWindowRef!: MatDialogRef<any>;

  // @2024/05/05 Add
  // FormGroup 類型的 neighborForm 變量用來存儲和管理表單控制項的集合。
  // 這個表單群組包含了用於編輯鄰居基站資訊的各個表單控制項，如 gNB ID、Cell ID 等。
  neighborForm!: FormGroup;

  /**
   * @2024/05/05 Add
   * 初始化或重置鄰居基站資訊表單
   * 創建鄰居基站編輯表單並設置驗證規則
   * @method createNeighborForm
   * @returns {void}
   * @description
   * - 建立用於編輯或新增鄰居基站資訊的表單，包括驗證規則。
   */
  createNeighborForm(): void {
    // 使用 Angular 的 FormBuilder 創建表單群組，並為各表單控件設定初始值和驗證規則
    this.neighborForm = this.fb.group({
      gnbId: ['', [Validators.required]],  // gNB ID 表單控制項，用於儲存計算出的gNB ID，無初始值和特定驗證
      //cellId: ['', [Validators.pattern('^[01]{0,14}$')]], // 設定 Cell ID 的驗證規則，只允許 0 或 1，最多 14 位
      nci: ['', [
        Validators.required,      // 確保 NCI 欄位必填
        Validators.minLength(9),  // 確保 NCI 欄位至少有 9 個字符
        Validators.maxLength(9),  // 確保 NCI 欄位最多 9 個字符
        Validators.pattern(/^[0-9A-Fa-f]{1,9}$/)  // 限制只能輸入16進制字符
      ]],  // NCI 表單控制項，加入長度和字符的驗證規則
      nrpci: ['', [Validators.required]],  // nRPCI 表單控制項，無初始值，用於儲存 nRPCI (NR Physical Cell ID)
      mcc: ['', [Validators.required]],    // MCC 表單控制項，無初始值，用於儲存 Mobile Country Code
      mnc: ['', [Validators.required]],    // MNC 表單控制項，無初始值，用於儲存 Mobile Network Code
      nrarfcn: ['', [Validators.required]] // NRARFCN 表單控制項，無初始值，用於儲存 NR ARFCN (Absolute Radio Frequency Channel Number)
    });

    // 呼叫設定 Cell ID 自動填充邏輯的函數，確保輸入格式正確
    //this.setupCellIdAutoFill(); // 初始化 Cell ID 的自動填充邏輯
  }
  
  /**
   * @2024/05/05 Add
   * 設定 Cell ID 的自動填充邏輯，確保格式正確
   * 自動調整輸入的 Cell ID，保持固定長度
   * @method setupCellIdAutoFill
   * @returns {void}
   */
  setupCellIdAutoFill(): void {
    // 監聽 cellId 控件的值變化
    this.neighborForm.get('cellId')!.valueChanges.subscribe(value => {
        // 移除輸入值中的所有非 0 和 1 字元
        const cleaned = value.replace(/[^01]/g, '');
        // 檢查清理後的值長度是否超過最大限制
        if (cleaned.length > 14) {
            // 如果超過14位，則截取最後14位
            this.neighborForm.get('cellId')!.setValue(cleaned.substr(1, 14));
        } else {
            // 如果未超過，填充前導0以保持長度為14，並阻止觸發額外的 valueChanges 事件
            this.neighborForm.get('cellId')!.setValue(cleaned.padStart(14, '0'), {emitEvent: false});
        }
    });
  }

  /**
   * 處理鍵盤輸入以實現自定義的 Cell ID 輸入行為
   * @method handleCellIdInput
   * @param {KeyboardEvent} event - 觸發的鍵盤事件
   * @returns {void}
   */
  handleCellIdInput(event: KeyboardEvent): void {
    // 定義允許的按鍵清單
    const allowedKeys = ['0', '1', 'Numpad0', 'Numpad1', 'Backspace', 'ArrowLeft', 'ArrowRight'];
    // 獲取事件目標元素並確保其不為 null
    const inputElement = event.target as HTMLInputElement | null;
    if (!inputElement) return; // 如果目標元素不存在，則終止函數執行

    // 獲取目前表單控件的值
    let currentValue = this.neighborForm.get('cellId')!.value;
    const maxCellLength = 14; // 設定最大長度限制
    const cursorPos = inputElement.selectionStart; // 獲取光標位置
    if (!cursorPos) return; // 如果光標位置未獲取到，則終止函數執行

    // 處理僅允許的按鍵以及組合鍵（如 Ctrl 或 Meta）
    if (!allowedKeys.includes(event.key) && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        return;
    }

    // 處理數字小鍵盤和主鍵盤的輸入
    let inputChar = event.key.replace('Numpad', '');

    if (inputChar === 'Backspace') {
        // 處理退格鍵：刪除光標前的字符
        if (cursorPos > 0 && cursorPos <= currentValue.length) {
            currentValue = currentValue.substring(0, cursorPos - 1) + currentValue.substring(cursorPos);
            event.preventDefault(); // 阻止預設的退格行為
        }
    } else if (['0', '1'].includes(inputChar) && currentValue.length < maxCellLength) {
        // 處理數字輸入：在光標位置插入字符
        currentValue = currentValue.substring(0, cursorPos) + inputChar + currentValue.substring(cursorPos);
        event.preventDefault(); // 阻止預設的輸入行為
    }

    // 確保輸入不超過最大長度
    currentValue = currentValue.padStart(maxCellLength, '0').substring(0, maxCellLength);
    
    // 更新表單控件的值
    this.neighborForm.get('cellId')!.setValue(currentValue);
  }
  
  // @2024/05/06 Add
  // 儲存選擇要編輯的 Neighbor BS 之 NCI、PCI
  theSelectedEditNeighborNCI: string = "";
  theSelectedEditNeighborPCI: number = 0;

  /**
   * @2024/05/09 Update
   * 打開鄰居基站資訊編輯彈出視窗
   * 根據模式（新增或編輯）打開彈出視窗，並準備表單
   * @method openNeighborBsEditDialog
   * @param { string }  mode - 彈出視窗模式（'add' 或 'edit'）
   * @param { any } neighbor - 編輯時使用的鄰居基站資料
   * @returns { void }
   */
  openNeighborBsEditDialog( mode: string, neighbor?: any ): void {

    // 輸出當前模式以供調試
    console.log( "Mode is:", mode );

    // 呼叫函數初始化表單
    this.createNeighborForm(); // 初始化表單

    if ( mode == "add" ) {

      // 輸出當前是要新增哪個 Cell ( NCI ) 的鄰居基站
      console.log( "要新增鄰居基站的 Cell ( NCI ) 為", this.selectedNeighborNci );
    }
    
    if ( mode == "edit" ) {

      // 輸出當前是要新增哪個 Cell ( NCI ) 的鄰居基站
      console.log( "要編輯的鄰居基站是位於此 Cell -", this.selectedNeighborNci, "底下" );

      // 輸出當前選擇的鄰居基站所有資訊
      console.log( "Selected neighbor:", neighbor );

      // 將選中的鄰居基站 nci 賦值給 theSelectedDeleteNeighborNCI
      this.theSelectedEditNeighborNCI = neighbor.nci;

      // 將選中的鄰居基站 nci 賦值給 theSelectedDeleteNeighborPCI
      this.theSelectedEditNeighborPCI = neighbor.pci;

      // 輸出當前選擇要編輯的 Neighbor BS 的 nci @2024/05/06 Add
      console.log( "the Selected Edit Neighbor NCI:", this.theSelectedEditNeighborNCI );

      // 如果是編輯模式，使用提供的鄰居基站資料來填充表單
      this.fillForm( neighbor );
    }

    // 根據傳入的模式開啟對應的彈出視窗模板
    let dialogTemplate = mode === 'add' ? this.addNeighborBsWindow : this.editNeighborBsWindow;

    // 開啟彈出視窗，傳入對應模板和數據
    this.addOrEditNeighborBsWindowRef = this.dialog.open( dialogTemplate, {
        data: {
            neighbor: neighbor
        },
        id: 'addOrEditNeighborBsWindowRef' // 設定彈出視窗的唯一標識
    });

    // 訂閱彈出視窗關閉事件，用於清理或記錄
    this.addOrEditNeighborBsWindowRef.afterClosed().subscribe( result => {
        console.log('addOrEditNeighborBsWindow was closed'); // 輸出彈出視窗關閉的日誌
    });
  }

  /**
    * @2024/05/05 Add
    * 使用提供的鄰居基站數據填充表單，以便於編輯鄰居基站資訊
    * @method fillForm
    * @param { any } neighbor - 需要填充的鄰居基站數據
    */
  fillForm( neighbor: any ): void {

    // 計算十進制的 Cell ID
    const cellIdDecimal = this.calculateCellLocalId( neighbor.nci );

    // 轉換 Cell ID 為二進制表示，並填充至固定長度
    const cellIdBinary = this.convertCellIdToBinary( parseInt( cellIdDecimal, 10 ) );

    // 更新表單的各個字段
    this.neighborForm.patchValue({
      gnbId: this.calculateGnbId( neighbor.nci ), // 設定計算後的 gNB ID
      //cellId: cellIdBinary,                     // 使用二進制格式的 Cell ID
      nci:  neighbor.nci,                         // 設定 NCI
      nrpci: neighbor.pci,                        // 設定 nRPCI
      mcc: neighbor['plmn-id'].mcc,               // 設定 MCC
      mnc: neighbor['plmn-id'].mnc,               // 設定 MNC
      nrarfcn: neighbor.nrarfcn                   // 設定 NRARFCN
    });
  }

  /**
    * @2024/05/05 Add
    * 根據選擇的 NCI 計算 gNB ID
    * 利用 NCI 和 gNB ID 長度計算 gNB ID
    * @method calculateGnbId
    * @param { string } nci - 選擇的 NCI
    * @returns { number } - 計算得到的 gNB ID
    */
  calculateGnbId( nci: string ): number {

    if ( !nci ) { // 檢查輸入的 NCI 是否存在
        return 0;
    }
    
    const gnbIdLength = this.gNBIdLength || 22; // 從成員變數獲取 gNB ID 長度，如果未設置則使用預設值 22
    if ( isNaN( gnbIdLength ) ) { // 檢查 gNB ID 長度是否為有效數值
        return 0;
    }

    const nciNumber = parseInt( nci, 16 ); // 將 NCI 從十六進制轉換成整數
    return Math.floor( nciNumber / Math.pow( 2, 36 - gnbIdLength ) ); // 根據 gNB ID 長度計算 gNB ID
  }

  /**
    * @2024/05/05 Add
    * 根據提供的 NCI 和 gNB ID 長度計算局部 Cell ID
    * 這個方法計算出的 Cell ID 是十進制值，用於後續處理或顯示
    * @method calculateCellLocalId
    * @param { string } nci - 要從中計算的 NCI
    * @returns { string } - 計算得到的 Cell ID，為十進制值
    */
  calculateCellLocalId( nci: string ): string {
    //const gnbIdLength = this.gNBIdLength; // 使用成員變數 gNBIdLength 或默認值 22

    const gnbIdLength = this.gNBIdLength;  // 使用成員變數 gNBIdLength
    const nciNumber = parseInt( nci, 16 ); // 將 NCI 從十六進制轉換成整數

    // 根據 gNB ID 長度計算 Cell ID，並返回十進制字符串
    return ( nciNumber % Math.pow( 2, 36 - gnbIdLength ) ).toString();
  }

  /**
    * @2024/05/05 Add
    * 將 Cell ID 轉換為二進制表示形式
    * @method convertToBinary
    * @param { number } cellId - 十進制的 Cell ID
    * @returns { string } - 二進制表示的 Cell ID，固定 14 位
    */
  convertCellIdToBinary( cellId: number ): string {
    return cellId.toString( 2 ).padStart( 14, '0' ); // 轉換為二進制並填充至14位
  }

  // @2024/05/06 Add
  // ViewChild 裝飾器用於獲取模板中 #deleteNeighborBSConfirmWindow 的元素
  @ViewChild('deleteNeighborBSConfirmWindow') deleteNeighborBSConfirmWindow: any;

  // @2024/05/06 Add
  // MatDialogRef 用於控制打開的彈出視窗
  deleteNeighborBSConfirmWindowRef!: MatDialogRef< any >;

  // @2024/05/06 Add
  // 儲存選擇要刪除的 Neighbor BS 之 NCI、PCI
  theSelectedDeleteNeighborNCI: string = "";
  theSelectedDeleteNeighborPCI: number = 0; 

  /**
   * @2024/05/06 Add
   * 打開選擇的鄰居基站刪除確認彈出視窗
   * @method openDeleteNeighborBSConfirmWindow
   * @param { Neighbor } neighbor - 需要刪除的鄰居基站資料
   * @returns { void }
   */
  openDeleteNeighborBSConfirmWindow( neighbor: Neighbor ) {

    // 將選中的鄰居基站 NCI 賦值給類變量
    this.theSelectedDeleteNeighborNCI = neighbor.nci;

    // 將選中的鄰居基站 PCI 賦值給類變量
    this.theSelectedDeleteNeighborPCI = neighbor.pci;

    // 輸出選中的鄰居基站 NCI 和 PCI
    console.log("選中要刪除的鄰居基站的 NCI 為:", this.theSelectedDeleteNeighborNCI);
    console.log("選中要刪除的鄰居基站的 PCI 為:", this.theSelectedDeleteNeighborPCI);

    // 呼叫函數初始化表單
    this.createNeighborForm(); // 初始化表單

    // 使用 MatDialog 服務開啟確認刪除的彈出視窗
    this.deleteNeighborBSConfirmWindowRef = this.dialog.open(
        this.deleteNeighborBSConfirmWindow, {
            id: 'deleteNeighborBSConfirmWindow' // 彈出視窗的唯一標識
        }
    );

    // 訂閱彈出視窗關閉後的事件
    this.deleteNeighborBSConfirmWindowRef.afterClosed().subscribe(confirm => {
        console.log('Dialog was closed'); // 彈出視窗關閉時輸出日誌
    });
  }

  // @2024/05/06 Add
  // 組裝一體式基站新增、編輯或刪除鄰居基站 POST 要提交的數據 
  submitData_allInOneBs_editNeighborBs: ForAddOrEditOrDeleteNeighborBs_allInOneBs = {} as ForAddOrEditOrDeleteNeighborBs_allInOneBs;

  // @2024/05/06 Add
  // 組裝分佈式基站新增、編輯或刪除鄰居基站 POST 要提交的數據 
  submitData_dist_editNeighborBs: ForUpdateDistributedBs_editNeighborBs = {} as ForUpdateDistributedBs_editNeighborBs;

  /**
   * @2024/05/06 Add
   * 提交新增、編輯或刪除鄰居基站的方法
   * @method addOrEditOrDeleteNeighborBs_Submit
   * @param   { string } action - 執行的動作類型（'add', 'edit', 'delete'）
   * @returns { void }
   * @description
   * - 根據提供的動作類型，處理鄰居基站的新增、編輯或刪除操作。
   * - 依據基站類型處理對應的數據並提交。
   */
  addOrEditOrDeleteNeighborBs_Submit( action: string ) {

    this.showProcessingSpinner();   // 顯示 Processing Spinner

    // 檢查表單有效性或是否為刪除操作
    if ( ( action !== 'delete' && this.neighborForm?.valid ) || ( action === 'delete' ) ) {

      // 獲取表單值
      const formValue = this.neighborForm.value;

      if ( this.bsType === '1' ) {
        // 如果基站類型為 '1'，即一體式基站，則進行以下處理

        // 初始化 submitData_allInOneBs_editNeighborBs 變數
        this.submitData_allInOneBs_editNeighborBs = {} as ForAddOrEditOrDeleteNeighborBs_allInOneBs;

        // 輸出初始化後的 submitData_allInOneBs_editNeighborBs 變數
        console.log( "addOrEditOrDeleteNeighborBs_Submit() - Start - submitData_allInOneBs_editNeighborBs:", this.submitData_allInOneBs_editNeighborBs );
   
        // 根據操作類型組裝 neighbor 數據
        let neighbors: any[] = [];

        // 根據操作類型進行處理
        switch ( action ) {
          case 'add':

            // 從現有的鄰居列表加上新鄰居
            neighbors = [...this.neighborList];

            // 添加新鄰居
            neighbors.push({
                // 下面是根據表單填寫的數據創建新鄰居對象
                id: "0",
                enable: "0",
                alias: "",
                'must-include': "",
                'plmn-id': {
                    mcc: formValue.mcc,
                    mnc: formValue.mnc
                },
                nci: formValue.nci,
                nrarfcn: formValue.nrarfcn,
                pci: formValue.nrpci,
                'q-offset': "",
                cio: "",
                'rs-tx-power': "",
                blacklisted: "",
                tac: "",
                '__itri_default___': 0
            });

            break;

          case 'edit':

            // 從列表中過濾出不需要編輯的鄰居，即那些 NCI 和 PCI 都不匹配的鄰居
            neighbors = this.neighborList.filter( neighbor => {
                return !( neighbor.nci === this.theSelectedEditNeighborNCI && neighbor.pci === this.theSelectedEditNeighborPCI );
            });
        
            // 將編輯過的鄰居數據添加到列表中
            neighbors.push({
                // 與新增相似，更新鄰居數據
                id: "0",
                enable: "0",
                alias: "",
                'must-include': "",
                'plmn-id': {
                    mcc: formValue.mcc,
                    mnc: formValue.mnc
                },
                nci: formValue.nci,
                nrarfcn: formValue.nrarfcn,
                pci: formValue.nrpci,
                'q-offset': "",
                cio: "",
                'rs-tx-power': "",
                blacklisted: "",
                tac: "",
                '__itri_default___': 0
            });

            break;
            
          case 'delete':

            // 過濾出要刪除的鄰居，確保兩個條件都匹配的 neighbor 才可被移除
            neighbors = this.neighborList.filter( neighbor => {
                return !( neighbor.nci === this.theSelectedDeleteNeighborNCI && neighbor.pci === this.theSelectedDeleteNeighborPCI );
            });

            break;
        }

        // 組裝一體式基站 POST 要提交數據
        this.submitData_allInOneBs_editNeighborBs = {
          type: "anr",
          session: this.sessionId,
          isSave: "true",
          bsInfo: [{
              bsId: this.bsID,
              nci: this.selectedNeighborNci,
              neighbor: neighbors
          }]
        };

        // 根據動作類型輸出日誌
        switch ( action ) {
          case 'add':
            console.log( "Add - The POST data for optimalBs():", this.submitData_allInOneBs_editNeighborBs );
            break;
          case 'edit':
            console.log( "Edit - The POST data for optimalBs():", this.submitData_allInOneBs_editNeighborBs );
            break;
          case 'delete':
            console.log( "Delete - The POST data for optimalBs():", this.submitData_allInOneBs_editNeighborBs );
            break;
        }

      } else if ( this.bsType === '2' ) {
        // 如果基站類型為 '2'，即分佈式基站，則進行以下處理
      
        // 初始化存儲提交數據的變數變數 - submitData_dist_editNeighborBs 
        this.submitData_dist_editNeighborBs = {} as ForUpdateDistributedBs_editNeighborBs;
      
        // 輸出初始化後的 submitData_dist_editNeighborBs 變數
        console.log("addOrEditOrDeleteNeighborBs_Submit() - Start - submitData_dist_editNeighborBs:", this.submitData_dist_editNeighborBs);
      
        // 組裝分佈式基站 POST 要提交數據
        this.submitData_dist_editNeighborBs = {
          session: this.sessionId, // 設置 session 值
          id: this.bsID, // 設置基站 ID
          name: this.bsName, // 設置基站名稱
          bstype: this.bsType, // 設置基站類型
          components: this.selectBsInfo_dist.components, // 設置基站網元
          description: this.selectBsInfo_dist.description, // 設置基站描述
          neighborinfo: [], // 初始化 neighborinfo 數組
        };
      
        // 遍歷每個 NCI
        for ( const nci of this.nciList ) {

          // 找到對應的 extension_info
          const extensionInfo = this.selectBsInfo_dist.extension_info.find(info => info.nci === nci);
      
          // 如果找到了對應的 extension_info
          if ( extensionInfo ) {

            // 創建一個新的 Neighborinfo 對象
            const neighborInfo: Neighborinfo = {
              gNBId: extensionInfo.gNBId,             // 設置 gNBId
              gNBIdLength: extensionInfo.gNBIdLength, // 設置 gNBIdLength
              cellLocalId: extensionInfo.cellLocalId, // 設置 cellLocalId
              neighbor: [], // 初始化 neighbor 數組
            };
      
            // 如果當前 NCI 與選中的 NCI 相同，則處理 neighbor 列表
            if ( nci === this.selectedNeighborNci ) {

              // 根據操作類型進行處理
              switch ( action ) {

                case 'add':
                  // 添加新的 neighbor 到 neighborInfo.neighbor 數組
                  neighborInfo.neighbor = [
                    ...this.neighborList, // 展開原有的 neighborList
                    {
                      id: "0",            // 設置新 neighbor 的 id
                      enable: "0",        // 設置新 neighbor 的 enable 值
                      alias: "",          // 設置新 neighbor 的 alias 值
                      'must-include': "", // 設置新 neighbor 的 must-include 值
                      'plmn-id': {
                        mcc: formValue.mcc, // 設置新 neighbor 的 plmn-id.mcc 值
                        mnc: formValue.mnc  // 設置新 neighbor 的 plmn-id.mnc 值
                      },
                      nci: formValue.nci,         // 設置新 neighbor 的 nci 值
                      nrarfcn: formValue.nrarfcn, // 設置新 neighbor 的 nrarfcn 值
                      pci: formValue.nrpci,       // 設置新 neighbor 的 pci 值
                      'q-offset': "",             // 設置新 neighbor 的 q-offset 值
                      cio: "",                    // 設置新 neighbor 的 cio 值
                      'rs-tx-power': "",          // 設置新 neighbor 的 rs-tx-power 值
                      blacklisted: "",            // 設置新 neighbor 的 blacklisted 值
                      tac: "",                    // 設置新 neighbor 的 tac 值
                      '__itri_default___': 0      // 設置新 neighbor 的 __itri_default___ 值
                    }
                  ];
                  break;
      
                case 'edit':
                  // 過濾掉要編輯的 neighbor,並添加編輯後的 neighbor 到 neighborInfo.neighbor 數組
                  neighborInfo.neighbor = this.neighborList.filter( neighbor => {
                    return !( neighbor.nci === this.theSelectedEditNeighborNCI && neighbor.pci === this.theSelectedEditNeighborPCI );
                  });
                  
                  neighborInfo.neighbor.push({
                    id: "0",              // 設置編輯後的 neighbor 的 id
                    enable: "0",          // 設置編輯後的 neighbor 的 enable 值
                    alias: "",            // 設置編輯後的 neighbor 的 alias 值
                    'must-include': "",   // 設置編輯後的 neighbor 的 must-include 值
                    'plmn-id': {
                      mcc: formValue.mcc, // 設置編輯後的 neighbor 的 plmn-id.mcc 值
                      mnc: formValue.mnc  // 設置編輯後的 neighbor 的 plmn-id.mnc 值
                    },
                    nci: formValue.nci,         // 設置編輯後的 neighbor 的 nci 值
                    nrarfcn: formValue.nrarfcn, // 設置編輯後的 neighbor 的 nrarfcn 值
                    pci: formValue.nrpci,       // 設置編輯後的 neighbor 的 pci 值
                    'q-offset': "",             // 設置編輯後的 neighbor 的 q-offset 值
                    cio: "",                    // 設置編輯後的 neighbor 的 cio 值
                    'rs-tx-power': "",          // 設置編輯後的 neighbor 的 rs-tx-power 值
                    blacklisted: "",            // 設置編輯後的 neighbor 的 blacklisted 值
                    tac: "",                    // 設置編輯後的 neighbor 的 tac 值
                    '__itri_default___': 0      // 設置編輯後的 neighbor 的 __itri_default___ 值
                  });
                  break;
      
                case 'delete':
                  // 過濾掉要刪除的 neighbor,更新 neighborInfo.neighbor 數組
                  neighborInfo.neighbor = this.neighborList.filter( neighbor => {
                    return !( neighbor.nci === this.theSelectedDeleteNeighborNCI && neighbor.pci === this.theSelectedDeleteNeighborPCI );
                  });
                  break;
              }
            } else {
              // 如果當前 NCI 與選中的 NCI 不同，則直接使用原有的 neighbor 列表
              neighborInfo.neighbor = this.getNeighborList( nci );
            }
      
            // 將 neighborInfo 添加到 neighborinfo 數組中
            this.submitData_dist_editNeighborBs.neighborinfo.push( neighborInfo );
          }
        }

        // 根據動作類型輸出日誌
        switch ( action ) {
          case 'add':
            console.log( "Add - The POST data for updateDistributedBs():", this.submitData_dist_editNeighborBs );
            break;
          case 'edit':
            console.log( "Edit - The POST data for updateDistributedBs():", this.submitData_dist_editNeighborBs );
            break;
          case 'delete':
            console.log( "Delete - The POST data for updateDistributedBs():", this.submitData_dist_editNeighborBs );
            break;
        }
      }

      // 判斷是否為本地模式進行模擬或實際 API 呼叫
      if ( this.commonService.isLocal ) {

          console.log('Local testing environment, no update operation will be performed.');

          // 隱藏加載指示器
          this.hideSpinner();

      } else {

        // 非 Local 模式下執行對應的 API 調用
        const apiObservable = this.bsType === "1"
                ? this.API_BS.optimalBs( this.submitData_allInOneBs_editNeighborBs )
                : this.API_BS.updateDistributedBs( this.submitData_dist_editNeighborBs );

        // 呼叫 API 進行鄰居基站新增、編輯或刪除操作
        apiObservable.subscribe({
          next: ( res ) => {

            // 輸出操作成功的日誌
            console.log( 'Neighbor BS operation success', res );

            // 刷新相關基站資訊
            this.getQueryBsInfo();       // 刷新基站資訊
            //this.getNEList();          // 刷新網元資訊
            //this.getCurrentBsFmList(); // 刷新告警資訊

            // 操作完成後，關閉新增或編輯鄰居基站視窗
            if ( this.addOrEditNeighborBsWindowRef ) {
              this.addOrEditNeighborBsWindowRef.close();
            }

            this.changeDetectorRef.detectChanges(); // 手動觸發變更檢測
            // 隱藏加載指示器
            //this.hideSpinner();
          },
          error: ( error ) => {

            // 操作失敗後的處理
            console.error( 'Neighbor BS operation failed', error );
            
            // 出錯時隱藏加載指示器
            this.hideSpinner();
          },
          complete: () => {
            console.log( 'Neighbor BS operation Success' );
            this.changeDetectorRef.detectChanges(); // 手動觸發變更檢測
            this.hideSpinner();  // 完成後隱藏 spinner
          }
        });
      }

    } else {
      
        // 如果表單驗證未通過
        console.error('Form is not valid, please check the input fields.');

        // 表單驗證未通過也隱藏加載指示器
        this.hideSpinner();
    }
  }


// ↑ 鄰居基站列表區 @2024/05/06 Update ↑



// ↓ 基站告警區 @2024/05/09 Update ↓


  // 告警嚴重程度選項 @2024/04/01 Add
  severitys: string[] = ['CRITICAL', 'MAJOR', 'MINOR', 'WARNING'];

           p: number = 1; // 當前頁數
    pageSize: number = 5; // 每頁幾筆
  totalItems: number = 0; // 總筆數

  /**
   * @2024/04/01 Add
   * 處理告警資訊的頁面切換
   * @method pageChanged_CurrentBsFmList
   * @param {number} page - 當前頁碼
   * @description
   * - 此函數在告警列表分頁切換時被呼叫。
   * - 更新當前頁碼並根據是否為 Local 模式決定是否重新從 API 獲取數據。
   * - 在非 Local 模式下，頁碼變動會觸發重新獲取當前告警資訊的 API 請求。
   */
  pageChanged_CurrentBsFmList( page: number ) {
    this.p = page;
    console.log ("Current Page:", this.p );

    // 如非 Local 模式，切換頁面時重新呼叫 API 獲取告警資訊
    if ( !this.commonService.isLocal ) {
      this.getCurrentBsFmList();
    }
  }

  // ↓ 用於儲存所有於此 BS 內的告警資訊 ↓
  currentBsFmList: CurrentBsFmList = {} as CurrentBsFmList;  
  isLoadingCurrentBsFmList = true;                // 控制加載當前 Bs Fm List 資訊狀態的標誌,初始設置為 true
  filtered_CurrentBsFmList: FaultMessage[] = [];  // 用於儲存篩選後的基站告警資訊
  isSearch_currentBsFmList: boolean = false;      // 用於標記是否進行了搜尋

  /**
   * @2024/05/09 Update
   * 獲取指定基站的當前告警資訊
   * @method getCurrentBsFmList
   * @description
   *    - 此函數用於獲取並處理指定基站的當前告警資訊。
   *    - 在本地模式和 API 模式下有不同的數據獲取方式。
   *    - 在本地模式下，直接從本地文件獲取數據。
   *    - 在 API 模式下，根據設定的日期篩選和嚴重程度篩選條件發起 HTTP 請求。
   *    - 加載過程中顯示加載指示，加載完成或發生錯誤後更新 UI 顯示。
   */
  getCurrentBsFmList() {
    console.log('getCurrentBsFmList() - Start');

    this.isLoadingCurrentBsFmList = true; // 標記開始加載
    // this.showLoadingSpinner();          // 顯示加載指示

    if ( this.commonService.isLocal ) {

      // 本地模式：從本地文件獲取數據
      this.currentBsFmList = this.currentBsFmList_LocalFiles.currentBsFmList_local;
      console.log( 'currentBsFmList:', this.currentBsFmList );

      // 轉換 processstatus 為字串型態
      this.currentBsFmList.faultMessage.forEach( msg => {
        msg.processstatus = String( msg.processstatus );
      });

      this.totalItems = this.currentBsFmList.totalMessageNumber;
      console.log( "In getCurrentBsFmList() not click search (Local mode) - msgToDisplay:", this.msgToDisplay );

      this.isLoadingCurrentBsFmList = false; // 標記加載完成
      // this.hideSpinner();                  // 隱藏加載指示

    } else {

      // API 模式：根據篩選條件從後端服務獲取數據
      const params = this.prepareFmListParams(); // 準備 API 請求參數

      this.API_BS.queryCurrentBsFaultMessage( this.bsID, params ).subscribe({
        next: ( res ) => {
          this.handleCurrentBsFmListResponse( res );  // 處理回應數據
        },
        error: ( error ) => {
          console.error( 'Error fetching current BS fault message:', error ); // 輸出錯誤日誌
          this.isLoadingCurrentBsFmList = false; // 標記加載出錯
          // this.hideSpinner();                 // 隱藏加載指示
        },
        complete: () => {
          console.log( 'Current BS fault message fetch completed' ); // 輸出完成日誌
          // this.hideSpinner();                                   // 完成後隱藏加載指示
        }
      });
    }

    console.log("getCurrentBsFmList() - End");
  }

  /**
   * @2024/05/09 Add
   * 準備發起獲取當前告警資訊的 API 請求參數
   * @method prepareFmListParams
   * @description
   * - 此函數根據表單的日期篩選值和嚴重程度篩選條件來準備 API 請求的參數。
   * - 處理日期格式，只保留日期部分，以符合後端接口的需求。
   * - 計算分頁參數，以確保每次請求只獲取當前頁面所需的告警資訊。
   * - 如果有設定嚴重程度的篩選，則加入該條件至請求參數中。
   * @returns { bsCurrentFmParams } 準備好的 API 請求參數
   */
  prepareFmListParams(): bsCurrentFmParams {

    // 格式化起始日期以只保留日期部分
    const formattedStartDate = this.commonService.dealPostDate( this.alarmSearchForm.controls['from'].value );
    const start = formattedStartDate.split(' ')[0];  // 例如 '2024-03-10'

    // 格式化結束日期，同上
    const formattedEndDate = this.commonService.dealPostDate( this.alarmSearchForm.controls['to'].value );
    const end = formattedEndDate.split(' ')[0];  // 例如 '2024-03-10'

    // 準備請求參數，包括日期範圍和分頁資訊
    const params: bsCurrentFmParams = {
      method: 'desc',
      start,  // 開始日期
      end,    // 結束日期
      offset: ( this.p - 1 ) * this.pageSize,  // 根據當前頁數計算偏移量
      limit: this.pageSize,  // 每頁顯示的條目數
    };

    // 檢查是否有嚴重程度的篩選條件
    const bsCurrentFmControl = this.alarmSearchForm.get('severity');
    if ( bsCurrentFmControl && bsCurrentFmControl.value !== 'All' ) {
      params.urgency = bsCurrentFmControl.value;  // 添加嚴重程度條件
    }

    return params;
  }

  /**
   * @2024/05/09 Add
   * 處理從 API 獲取的當前告警資訊回應
   * @method handleCurrentBsFmListResponse
   * @param { any } res 從API獲得的回應物件，包含告警訊息
   * @description
   * - 此函數根據用戶是否執行了搜尋操作來處理API回應。
   * - 如果是因常規加載獲得數據而非搜尋操作，則更新 currentBsFmList。
   * - 如果是搜尋操作觸發的請求，則更新 filtered_CurrentBsFmList。
   * - 處理完成後，更新頁面上顯示的總告警數。
   * - 轉換告警狀態 ( processstatus ) 為字串格式，方便前端顯示。
   * - 加載過程中顯示加載指示，加載完成或發生錯誤後隱藏加載指示，並更新UI。
   */
  handleCurrentBsFmListResponse( res: any ) {
    
    if ( !this.isSearch_currentBsFmList ) {
      // 如果數據非因搜尋操作獲得
      console.log( 'In getCurrentBsFmList() not click search - res:', res );

      this.currentBsFmList = res; // 賦值響應至currentBsFmList

      // 將processstatus轉換為字串型態
      this.currentBsFmList.faultMessage.forEach( msg => {
        msg.processstatus = String( msg.processstatus );
      });

      console.log( 'In getCurrentBsFmList() not click search - currentBsFmList:', this.currentBsFmList );

      this.totalItems = this.currentBsFmList.totalMessageNumber;
      console.log( 'In getCurrentBsFmList() not click search - Total Bs Fault Message Num:', this.totalItems );

    } else {

      // 如果是搜尋操作觸發的數據獲得
      console.log( 'In getCurrentBsFmList() click search - res:', res );

      // 將篩選過的數據直接賦值至filtered_CurrentBsFmList
      this.filtered_CurrentBsFmList = res.faultMessage;

      // 轉換processstatus為字串型態
      this.filtered_CurrentBsFmList.forEach( msg => {
        msg.processstatus = String( msg.processstatus );
      });

      this.totalItems = res.totalMessageNumber; // 更新記錄的告警總數
      console.log( "In getCurrentBsFmList() click search - msgToDisplay:", this.msgToDisplay );
    }

    this.isLoadingCurrentBsFmList = false; // 標記加載完成
    //this.hideSpinner();  // 完成後隱藏加載指示
  }

       alarmSearchForm!: FormGroup;
  afterAlarmSearchForm!: FormGroup; // 用於儲存並顯示出篩選條件
  
  /**
   * @2024/04/17 Update
   * 搜尋基站告警資訊
   * @method search_currentBsFmList
   * @description
   *    - 此函數用於根據用戶提供的搜尋條件進行基站告警資訊的搜尋。
   *    - 支持本地和 API 模式下的數據處理。
   *    - 在本地模式下，從本地資料過濾符合條件的告警資訊。
   *    - 在 API 模式下，根據設定的搜尋條件（ 如日期範圍和嚴重程度 ）向後端發起請求。
   *    - 搜尋過程中顯示加載指示，並於完成或出錯後更新用戶界面。
   */
  search_currentBsFmList() {
    console.log( 'search_currentBsFmList() - Start' );

    // 確認告警資訊是否已加載
    if ( !this.currentBsFmList || !this.currentBsFmList.faultMessage ) {
      console.error( 'currentBsFmList.faultMessage is not loaded yet.' );
      return;
    }

    // 更新顯示的搜尋條件
    this.afterAlarmSearchForm = this.alarmSearchForm.value;

    this.p = 1; // 當點擊搜尋時,將頁數預設為 1

    const from = this.alarmSearchForm.get( 'from' )?.value;
    const to = this.alarmSearchForm.get( 'to' )?.value;
    const severity = this.alarmSearchForm.get( 'severity' )?.value;
    
    console.log( 'the search severity is', severity );
    
    // 清除以前的搜尋結果
    this.filtered_CurrentBsFmList = [];
    this.isSearch_currentBsFmList = false;

    this.afterAlarmSearchForm = _.cloneDeep( this.alarmSearchForm );

    this.isLoadingCurrentBsFmList = true; // 設置加載旗標為 true,表示開始加載
    this.showProcessingSpinner(); // 顯示 Processing Spinner

    if ( this.commonService.isLocal ) {

      this.filtered_CurrentBsFmList = this.currentBsFmList.faultMessage.filter( msg => {

        const msgDate = new Date( msg.modifytime );
        const isAfterFrom = msgDate >= new Date( from );
        const isBeforeTo = msgDate <= new Date( to );
        const isSeverityMatch = severity === 'All' || msg.eventtype === severity;

        return isAfterFrom && isBeforeTo && isSeverityMatch;
      });

      // 將 filtered_CurrentBsFmList 中的 processstatus 轉換為字串型態
      this.filtered_CurrentBsFmList.forEach( msg => {
        msg.processstatus = String( msg.processstatus );
      });

      this.isSearch_currentBsFmList = true;  // Local Search 完畢,設置標記為 true

      this.totalItems = this.filtered_CurrentBsFmList.length; // 確保更新 totalItems 以反映搜尋結果的數量

      console.log( "In search_currentBsFmList() in Local mode - msgToDisplay:", this.msgToDisplay );

      this.isLoadingCurrentBsFmList = false; // 設置加載旗標為 false,表示加載完成
      this.hideSpinner();  // 因為 Local 模式數據加載通常很快，所以立即隱藏 spinner

    } else {  // 如非在 Local 環境測試


      // 只保留傳入日期的部分
      const formattedDate = this.commonService.dealPostDate( this.alarmSearchForm.controls['from'].value );
      const start = formattedDate.split(' ')[0]; // 獲取日期部分,例如 '2024-03-10'
      
      const formattedEnd = this.commonService.dealPostDate( this.alarmSearchForm.controls['to'].value );  
      const end = formattedEnd.split(' ')[0];    // 獲取日期部分,例如 '2024-03-10'

      const params: bsCurrentFmParams = {
        method: 'desc',
        start,           // 取得開始日期 - 目前後端無法篩選時分秒
        end,             // 取得結束日期 - 目前後端無法篩選時分秒

        offset: ( this.p - 1 ) * this.pageSize,
        limit: 5
      };

      // 獲取 bsCurrentFmControl 的控制元件
      const bsCurrentFmControl = this.alarmSearchForm.get('severity');

      // 判斷 severity 控制元件是否存在且有值
      if ( bsCurrentFmControl && bsCurrentFmControl.value !== 'All' ) {
        params.urgency = bsCurrentFmControl.value;
      }

      // 使用 API_BS 中的 queryCurrentBsFaultMessage() 發起 HTTP GET 請求
      this.API_BS.queryCurrentBsFaultMessage( this.bsID, params ).subscribe({
        next: ( res ) => {    // 成功的 callback

          console.log( 'In search_currentBsFmList() - res:', res );
          
          // 傳回的數據 res 已是篩選過的,故直接放入 filtered_CurrentBsFmList
          this.filtered_CurrentBsFmList = res.faultMessage;

          // 將 filtered_CurrentBsFmList 中的 processstatus 轉換為字串型態
          this.filtered_CurrentBsFmList.forEach( msg => {
            msg.processstatus = String( msg.processstatus );
          });

          this.totalItems = res.totalMessageNumber;       // 更新記錄的告警總數
          this.isSearch_currentBsFmList = true;        // Search 完畢,設置標記為 true,以便 msgToDisplay 切換成顯示 filtered_CurrentBsFmList
          console.log( "In search_currentBsFmList() - msgToDisplay:", this.msgToDisplay );

          this.isLoadingCurrentBsFmList = false; // 設置加載旗標為 false,表示加載完成
          this.hideSpinner();  // 完成後隱藏 spinner
        },
        error: ( error ) => {  // 錯誤的 callback
          console.error( 'Error searching current bs fault message:', error ); // 顯示錯誤訊息

          this.isLoadingCurrentBsFmList = false; // 設置加載旗標為 false，表示加載出錯
          this.hideSpinner();  // 出錯時隱藏 spinner
        }
      });

    }

    // // 更新顯示的搜尋條件
    // this.afterAlarmSearchForm.patchValue({
    //   'from': from,
    //   'to': to,
    //   'severity': severity
    // });

    // 檢查搜尋表單的值
    console.log('Search criteria for current bs fault message:', this.afterAlarmSearchForm.value);

    console.log("search_currentBsFmList() - End");
  }

  /**
   * @2024/04/01 Add
   * 創建告警搜尋表單
   * @method createAlarmSearchForm
   * @description
   *    - 此函數用於創建告警搜尋表單，初始化包括日期和嚴重程度的搜尋欄位。
   */
  createAlarmSearchForm() {

    // 獲取當前時間
    const nowTime = this.commonService.getNowTime();

    // 創建當前時間的 Date 物件
    const now = new Date(`${nowTime.year}-${nowTime.month}-${nowTime.day} ${nowTime.hour}:${nowTime.minute}`);

    // 創建往回推一個月的時間之 Date 物件
    const from = new Date( now );
    from.setMonth( from.getMonth() - 1 );

    // 格式化日期時間以符合兩位數格式
    const  paddedMonth = ( '0' + ( from.getMonth() + 1 ) ).slice( -2 );
    const    paddedDay = ( '0' + from.getDate() ).slice( -2 );
    const   paddedHour = ( '0' + from.getHours() ).slice( -2 );
    const paddedMinute = ( '0' + from.getMinutes() ).slice( -2 );

    this.alarmSearchForm = this.fb.group({
          'from': new FormControl(`${from.getFullYear()}-${paddedMonth}-${paddedDay} ${paddedHour}:${paddedMinute}`), 
            'to': new FormControl(`${now.getFullYear()}-${nowTime.month}-${nowTime.day} ${nowTime.hour}:${nowTime.minute}`),
      'severity': new FormControl( 'All' ) // 告警嚴重程度欄位
    });

    //this.afterAlarmSearchForm = _.cloneDeep(this.alarmSearchForm); // 深拷貝 alarmSearchForm 的值給 afterAlarmSearchForm
  }

  /**
   * @2024/03/31 Add
   * 重置告警搜尋
   * @method clear_search_currentBsFmList
   * @description
   *    - 此函數用於重置告警搜尋條件，並重新加載告警資訊。
   */
  clear_search_currentBsFmList() {

    this.isSearch_currentBsFmList = false;

    this.alarmSearchForm.reset();  
    this.createAlarmSearchForm();
    this.afterAlarmSearchForm = _.cloneDeep( this.alarmSearchForm );
    
    this.p = 1; // 當點擊重置搜尋時，將顯示頁數重置為 1

    this.getCurrentBsFmList();
    
  }  

  /**
   * @2024/04/01 Add
   * 獲取用於顯示的基站告警數據
   * @property msgToDisplay
   * @description
   *    - 此屬性根據是否進行了搜尋來決定返回的告警資訊數組。
   */
  get msgToDisplay(): FaultMessage[] {

    // 檢查 this.currentBsFmList 是否存在，以及 this.currentBsFmList.faultMessage  是否為非空數組
    if ( this.currentBsFmList && Array.isArray( this.currentBsFmList.faultMessage ) ) {
      return this.isSearch_currentBsFmList ? this.filtered_CurrentBsFmList : this.currentBsFmList.faultMessage;
    }
    return []; // 如果數據還沒有載入，則返回一個空數組
  }


// ↑ 基站告警區 @2024/05/09 Update ↑



// ↓ 網元列表區 @2024/05/09 Update ↓


  // @2024/03/29 Add
  // 用於儲存所有於此 BS 內的網元
  NEList_InThisBS: NEList = {} as NEList;

  /**
   * @2024/03/29 Add
   * 篩選出屬於當前基站名稱的網元
   * @method filterNEListByBSName
   * @description
   * - 此函數負責從全局網元列表（NEList）中篩選出屬於當前基站（由 bsName 指定）的網元。
   * - 篩選後的網元將被存儲到 NEList_InThisBS 中，以便進一步處理或顯示。
   * - 函數首尾均有日誌輸出，用於追踪篩選過程的開始和結束。
   */
  filterNEListByBSName() {
    console.log( 'filterNEListByBSName() - Start' );  // 日誌記錄開始篩選

    // 暫存篩選後的網元數據
    const filteredComponents: NE[] = [];

    // 遍歷現有網元列表
    this.NEList.components.forEach(( ne: NE ) => {
        // 檢查網元所屬基站名稱是否匹配當前基站
        if ( ne.bsName === this.bsName ) {
            filteredComponents.push( ne );  // 加入到篩選結果
        }
    });

    // 更新存儲篩選後的網元列表
    this.NEList_InThisBS = {
        components: filteredComponents
    };

    console.log( "於此 BS -", this.bsName, "內的網元有:", this.NEList_InThisBS );  // 日誌記錄篩選結果

    console.log( 'filterNEListByBSName() - End' );  // 日誌記錄篩選結束
  }

  /**
   * @2024/04/17 Update
   * 導航到選定網元的詳細資訊頁面
   * @method viewNEDetailInfo
   * @param { NE } NE - 從 NE 列表中選擇的網元對象。
   * @description
   * - 此方法用於導航到指定網元的詳細資訊頁面。
   * - 使用 Angular 的路由服務（router）來實現頁面跳轉，其中路由地址包含網元的 ID。
   * - 可用於在用戶界面中由用戶選擇特定網元時觸發詳細訊息的顯示。
   */
  viewNEDetailInfo( NE: NE ) {
    // 實現基於路由的頁面導航，傳遞網元 ID 至詳細資訊頁面
    this.router.navigate( ['/main/component-mgr/info', NE.id] );
  }


// ↑ 網元列表區 @2024/05/09 Update ↑



// ↓ 基站效能區 @2024/05/08 Add ↓

  //multi: any[];
  view: any[] = [700, 300];
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  xAxisLabel: string = 'Years';
  yAxisLabel: string = 'Population';

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  filteredData: ChartData[] = []; // 宣告 filteredData 屬性，類型為 ChartData[]，初始值為空數組

  selectedCategory: string = 'Accessibility'; // 預設選項
  
  // 數據範例
  multi: ChartData[] = [
    {
      "name": "Accessibility",
      "series": [
        { "name": "2022-04-01", "value": 50 },
        { "name": "2022-04-02", "value": 80 }
      ]
    },
    {
      "name": "Integrity",
      "series": [
        { "name": "2022-04-01", "value": 45 },
        { "name": "2022-04-02", "value": 70 }
      ]
    }
    // more categories...
  ];

  updateChart() {
    this.filteredData = this.filterData();
    this.changeDetectorRef.markForCheck(); // 標記為需要檢查，因為我們使用了 OnPush
  }
  
  filterData(): ChartData[] {
    return this.multi.filter(item => item.name === this.selectedCategory);
  }


// ↑ 基站效能區 @2024/05/08 Add ↑


}

