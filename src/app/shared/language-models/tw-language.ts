export const TwLanguage = {
  'loading':"載入中...",
  'Processing':"處理中...",

  'logon':'登入',
  'logon.welcome':'歡迎',
  'logon.field_mgr_system':'Athena Orchestrator',
  'logon.user_logon':'使用者登入',
  'logon.password_error':'使用者名或密碼輸入錯誤',
  'logon.required_error':'請輸入帳號或密碼',
  'logon.401':'Session ID 已過期，請重新登錄',
  'logon.403':'使用者名或密碼輸入錯誤',
  'logon.404':'此帳號不存在',

  // 選單標題
  'index.menu_iRmSys':'Athena Orchestrator',
  'index.menu_dashboard':'主畫面',
  'index.menu_fieldMgr':'場域管理',
  'index.menu_BSMgr':'基站管理',
  'index.menu_componentMgr':'網元管理',
  'index.menu_faultMgr':'故障管理',
  'index.menu_performMgr':'效能管理',
  'index.menu_sliceMgr':'切片管理',
  'index.menu_softwareMgr':'軟體管理',
  'index.menu_scheduleMgr':'排程管理',
  'index.menu_accountMgr':'帳號管理',
  'index.menu_logMgr':'日誌管理',   // "log" -> "日誌" @10/25 by yuchen

  'index.netFun':'網路功能',
  'index.faultMsg':'告警資訊',
  'index.viewMore':'詳細訊息',
  'index.view':'詳細訊息',
  'index.resourceMsg':'資源訊息',
  'index.cpuLoading':'CPU 負載',
  'index.diskUsage':'硬碟使用量',
  'index.memoryUsage':'內存使用量',
  'index.networkThroughput':'網路吞吐量',
  'table.header_name':'名稱',
  'table.header_dmsCount':'DMS 數量',
  'table.header_nfCount':'NF 數量',
  'table.header_faultCount':'故障數量',
  'table.globalID':'Global ID',
  'table.Status':'部署情況',
  'table.performance':'部署狀態',
  'table.delete':'刪除',
  
  // Common Items (共用項目)
  "back": '返回',
  'ok':'確定',
  'confirm':'確認',             // @2024/01/10 Add by yuchen
  'cancel':'取消',
  'search':'搜尋',
  'search_criteria':'篩選條件',  // @12/04 Add by yuchen
  'clear_search':'重置搜尋',     // @11/24 Add by yuchen
  'close': '關閉',               // @2024/01/22 Add
  'clear_select':'重置選擇',     // @2024/04/25 Add

  // Field Management (場域管理) @11/30 Add by yuchen
  'field.list':'場域列表',
  'field.name':'場域名稱',
  'field.bsNum':'基站數量',

  'field.create':'建立場域',        // @2024/01/31 Add
  'field.createNext':'下一步',      // @2024/01/31 Add
  'field.createBack':'上一步',      // @2024/01/31 Add
  'field.createDone':'完成',        // @2024/01/31 Add
  'field.createReset':'重置',       // @2024/01/31 Add
  'field.createTitle':'場域建立',    // @2024/01/31 Add
  'field.setFieldName':'設定場域名稱',              // @2024/01/31 Add
  'field.setFieldBoundsCoord':'設定場域邊界座標',    // @2024/01/31 Add
  'field.setNotificationNum': '設定管理者通知門號',  // @2024/01/31 Add
  'field.PhoneNum': '電話號碼',                    // @2024/01/31 Add
  'field.selectBaseStations': '選擇基站',          // @2024/01/31 Add
  'field.setupComplete': '場域設定完成。',          // @2024/01/31 Add
  'field.bsDescription': '基站地點說明',            // @2024/02/01 Add
  'field.validLongitude': '請輸入有效經度 ( -180.0 ~ 180.0 )',  // @2024/02/02 Add
  'field.validLatitude' : '請輸入有效緯度 ( -90.0 ~ 90.0 )',    // @2024/02/02 Add
  'field.validPhoneNumber' : '請輸入有效門號(10 碼)',        // @2024/02/02 Add

  'field.view':'檢視',
  'field.viewDetail':'詳細',

  'field.alarm':'場域告警',

  'field.snapshot':'快照',
  'field.fieldSnapshots': '場域快照',
  'field.fieldSnapshotSettings': '場域快照設置',
  'field.setSnapshotName': '設定此快照名稱',
  'field.setCurrentSnapshotNamePlaceholder': '請為此快照輸入名稱',
  'field.snapshotsList': '快照列表',
  'field.totalSaved': '已儲存總數',
  'field.saveFieldSnapshot':'儲存',
  'field.snapshotNameRequired': '請輸入快照名稱（不可僅含空白）',
  'field.mustContainNonWhitespace': '快照名稱至少包含一個非空格字符',
  'field.downloadCurrentFieldSnapshot':'下載此快照',
  'field.snapshotNo':'編號',
  'field.snapshotName':'快照名稱',
  'field.createdTime': '建立時間',
  'field.currentSnapshot': '目前快照',
  'field.download': '下載',
  'field.downloadSnapshot': '下載此快照',
  'field.delete': '刪除',
  'field.deleteSnapshot': '刪除此快照',
  'field.confirm_del_fieldSnapshot':'確定要刪除場域快照',
  'field.closeSnapshot':'關閉',

  'field.delTitle':'刪除',
  'field.delItem':'刪除此場域',

  'field.info':'場域詳細資訊',
  'field.Map':'場域地圖',
  'field.image':'場域圖片', // @2024/01/03 Update
  'field.noFieldImageAvailableTitle':  '注意',             // @2024/01/22 Add
  'field.noFieldImageAvailableMessage':'場域圖片尚未上傳。', // @2024/01/22 Add
  'field.rsrpMap':'RSRP 地圖',
  'field.sinrMap':'SINR 地圖',
  'field.MapOption':'更多選項',
  'field.faultInfo':'場域告警',
  'field.criticalFault':'嚴重',
  'field.majorFault':'主要',
  'field.minorFault':'次要',
  'field.warningFault':'警告',
  'field.performanceInfo':'場域效能',
  'field.handoverRate':'換手成功率',
  'field.accessRate':'接入成功率',
  'field.CPU_Utilization':'CPU 使用率',
  'field.Memory_Utilization':'Memory 使用率',

  'field.bsInfo':'基站資訊',
  'field.bsNameInMouseOver':'名稱',
  'field.bsTypeInMouseOver':'類型',
  'field.BSname':'基站名稱',
  'field.BStype':'基站類型',
  'field.Longitude':'經度',
  'field.Latitude':'緯度',
  'field.moreBsInfos':'更多資訊',
  
  'field.modifyConfiguration':'修改配置',
  'field.modifySuccess':'修改已套用',         // @2024/01/10 Add
  'field.modifyError':'修改錯誤',             // @2024/01/10 Add
  'field.nothingChanged':'未有更動',          // @2024/01/15 Add
  'field.neighboringBSList':'鄰近基站列表',
  'field.config':'場域配置',                  // @12/12 Add
  'field.edit':'場域編輯',                    // @2024/01/11 Add
  'field.fieldImageEdit':'場域圖片編輯',
  'field.editInfo':'場域資訊',                // @2024/01/11 Add
  'field.northBound':'場域北界',              // @2024/01/11 Add
  'field.southBound':'場域南界',              // @2024/01/11 Add
  'field.lat':'緯度',                         // @2024/02/02 Add
  'field.westBound':'場域西界',               // @2024/01/11 Add
  'field.eastBound':'場域東界',               // @2024/01/11 Add
  'field.lng':'經度',                         // @2024/02/02 Add
  
  'field.notificationNum':'管理者通知門號',    // @2024/01/11 Add
  'field.fieldBoundsEx':'場域邊界示意圖',      // @2024/01/18 Add
  'field.indoorMap':'室內地圖',               // @2024/01/18 Add
  'field.preview':'預覽',                     // @2024/02/04 Add
  'field.editBSs':'調整基站分配',              // @2024/01/28 Add
  'field.cancelEditBSs':'取消',               // @2024/01/28 Add
  'field.selectBSs':'選擇基站',                // @2024/01/18 Add
  'field.confirmFieldEditField': "確認進行場域變更？", // @2024/01/28 Add
  'field.showFieldBS': '顯示場域內基站',
  'field.showAllBS': '顯示所有基站',


  'field.fieldImageUpload':'場域圖片上傳',      // @2024/02/23 Update
  'field.fieldImageNone':'未有場域圖片',        // @2024/02/23 Update
  'field.fieldImageNotUploaded': '尚未上傳場域圖片(如室內或室外地圖)',      // @2024/02/23 Update
  'field.fieldImageNotUploaded1': '尚未上傳場域圖片',      // @2024/02/23 Add
  'field.fieldImageNotUploaded2': '(如室內或室外地圖)',  // @2024/02/23 Add
  'field.DeletefieldImage':'刪除該場域圖片',              // @2024/02/23 Update
  'field.confirmDeletefieldImage':'確定刪除該場域圖片？',  // @2024/02/23 Update

  'field.configPMset':'效能管理參數設定',  // @12/12 Add 
  'field.pmIP': 'PM伺服器IP位址',         // @2024/02/15 Add
  'field.folderPath': '資料夾路徑',       // @2024/02/15 Add
  'field.pmID': '使用者名稱',             // @2024/02/15 Add
  'field.pmKey': '密碼',                 // @2024/02/15 Add
  'field.MeasurementInterval_pmint': 'PM資料量測頻率(秒)',     // @2024/02/15 Add
  'field.UploadInterval_fmint': 'PM資料上傳頻率(秒)',          // @2024/02/15 Add
  'field.measurementType': '量測類型',  // @2024/02/16 Add
  'field.off': '關閉',                  // @2024/02/16 Add
  'field.default': '預設',              // @2024/02/16 Add
  'field.selfDefined': '自定義',        // @2024/02/16 Add
  "field.enterSelfDefinedParam": "輸入自定義參數",      // @2024/02/21 Add
  'field.confirmPMgmtParameterSet': '確認套用變更？' ,  // @2024/02/22 Update
  'field.apply':'套用', // @2024/02/22 Add
  'field.close':'關閉', // @2024/02/22 Add
  'field.applyReminder': '提醒', // @2024/02/22 Add
  
  'field.report':'場域報表',                 // @12/12 Add
  'field.reportPM':'場域效能(PM)',          // @12/12 Add
  'field.fieldPerformanceAnalysis': '場域效能分析',


  'field.reportFM':'告警資訊(FM)',          // @12/12 Add
  'field.optim':'場域優化',                  // @12/12 Add
  'field.optimSON':'執行 SON rApps',         // @12/12 Add

  'field.modeSwitch': '模式切換',    // @2024/04/12 Add
  'field.mapModel':'場域地圖',       // @2024/04/12 Update
  'field.map':'地圖', 
  'field.bsList':'基站列表',         // @12/12 Add

  'field.bsAntennaCoord':'基站天線座標',      // @12/13 Add
  'field.BSstatus':'連線狀態',                // @12/13 Add
  'field.bsAlarm':'告警',                    // @12/13 Add
  'field.legend_all-in-one_bs':'一體式基站',  // @12/28 Add
  'field.legend_dist_bs':'分佈式基站',       // @12/28 Add
  
  'field.selectOptimizationParameters': '選擇優化參數',
  'field.selectCalculationParameters': '選擇計算參數',

  'field.setCCO':'設定 CCO',
  'field.ccoSettings':'CCO 設定',
  'field.maxCoverageRange': '最大覆蓋範圍',
  'field.maxSINR': '最大 SINR',

  'field.setANR':'設定 ANR',
  'field.anrSettings':'ANR 設定',
  'field.minSignalPower': '最小訊號強度',

  'field.setPCI':'設定 PCI',
  'field.pciSettings':'PCI 設定',
  'field.pciMin': 'PCI 最小值',
  'field.pciMax': 'PCI 最大值',

  'field.sonCalculate':'計算',
  'field.clearAndReset': '清除並重置',

  'field.calculationCategories': '計算類別',

  'field.calculationResults': '計算結果',
  'field.originalTxPower': '原傳輸功率',
  'field.newTxPower': '新傳輸功率',

  'field.fieldPerformance': '場域效能',

  'field.originalNeighborBS': '原鄰居基站',
  'field.newNeighborBS': '新鄰居基站',
  
  'field.pciCollisions': '衝突的 PCI',
  'field.pciConfusions': '混淆的 PCI',
  'field.originalPCI': '原 PCI',
  'field.newPCI': '新 PCI',
  'field.uniDirectionalPairCountCollisions': '單向衝突對數',
  'field.uniDirectionalPairCountConfusions': '單向混淆對數',
  'field.ratio': '，比率',
  'field.none': '無',
  'field.originalCollisionPairs': '原衝突對',
  'field.newCollisionPairs': '新衝突對',
  'field.source': '原始基站',
  'field.target': '目標基站',
  'field.originalConfusionPairs': '原混淆對',
  'field.newConfusionPairs': '新混淆對',
  'field.confused': '混淆基站',

  


  'field.optimizationType': '優化種類',
  'field.optimizationResult': '優化結果',
  
  'field.applySON': '套用',
  'field.cancelSON': '取消',
  "field.confirmApplySonField": "套用此次計算進行優化？", // @2024/04/12 Add

  'field.open': '開啟',
  'field.anrMode': '最小訊雜比',
  'field.anrThreshold': '最小訊雜比門檻值',
  'field.sinr': '訊雜比(SINR值)',

  'field.optimize': '執行優化',
  'field.calculating': '計算中',



  // BS Management ( 基站管理 )
  'BS.list':'基站列表',
  'BS.createWindowTitle':'基站建立',
  'BS.create':'建立基站',
  
  'BS.setBSName': '設定基站名稱',
  'BS.enterBSName': '請輸入基站名稱',
  'BS.nameUsedInAccount': '此帳號下已存在相同基站名稱',
  'BS.nameExists': '此名稱已存在',

  'BS.setBSType': '設定基站類型',
  'BS.setNEAndCoordinates': '設定網元與座標',
  'BS.selectBSType': '請選擇基站類型',
  'BS.selectDUNumber': '請選擇 DU 數量',
  'BS.selectRUNumber': '請選擇 RU 數量',

  'BS.duNumber': 'DU 數量',
  'BS.cuNumber': 'CU 數量',
  'BS.ruNumber': 'RU 數量',
  'BS.gpsLocation': 'GPS 位置',
  'BS.selectIntegratedNE': '選擇網元',
  'BS.selectNE': '請選擇一個網元',
  'BS.selectCUNE': '選擇 CU',
  'BS.requiredCU': '請選擇一個 CU',
  'BS.selectDUNE': '選擇 DU',
  'BS.requiredDU': '請選擇一個 DU',
  'BS.selectRUNE': '選擇 RU',
  'BS.requiredRU': '請選擇一個 RU',
  'BS.setCU': '設定 CU',
  'BS.setDU': '設定 DU',
  'BS.setRU': '設定 RU',
  'BS.setGPSLocation': '設定 GPS 位置',
  'BS.setConnectedDU': '設定連接的 DU',
  'BS.selectConnectedDU': '請選擇一個 DU 連接到',

  'BS.setLatitude': '設定緯度',
  'BS.setLongitude': '設定經度', 

  'BS.setBSLocationDescriptionAndUploadParameters': '設定基站地點說明與上傳基站參數檔',
  'BS.generateParameterSampleFile': '產生基站參數樣本檔 (.xlsx)',
  'BS.generateParameterSampleDownload': '樣本檔下載 (.xlsx)',
  'BS.uploadParameterFile': '上傳基站參數檔 (.xlsx)',
  'BS.ex': "例",
  'BS.enterBSLocationDescription': '請輸入基站地點說明',
  'BS.uploadBSParameterFile': '請上傳一個基站參數檔',
  'BS.notUploaded': '未上傳',
  'BS.uploaded': '已上傳',
  'BS.setupComplete': '基站設定完成。',

  'BS.name':'基站名稱',
  'BS.type':'基站類型',
  'BS.all-in-one':'一體式', // @2024/04/18 Add
  'BS.dist':'分佈式',       // @2024/04/18 Add
  'BS.cellCount':'Cell 數',
  'BS.description':'基站地點說明',
  'BS.belongField':'隸屬場域',
  'BS.status':'連線狀態',
  'BS.view':'檢視',
  'BS.delete':'刪除',
  'BS.confirm_del':'確定要刪除基站',
  'BS.inUseCannotDelete': '使用中，無法刪除。',
  'BS.field': '場域',



  'BS.info':'基站詳細資訊',

  'BS.alarmLatestUpdateTime': '最新更新時間',
  'BS.alarmLatestUpdateTimeRangeEnd':'～',     
  'BS.processingFmStatus': '處理狀態',


  // 基本訊息區
  'BS.editSettings': '編輯設定',
  'BS.Latitude': '緯度',
  'BS.Longitude': '經度',  
  'BS.apply':'套用', 

  'BS.bsAntennaCoord':'基站天線座標',
  'BS.ruNeName':'網元名稱 ( RU )',
  'BS.latLong':'經緯度',
  'BS.lastHeartbeatTime': '最後連線時間',
  'BS.neName':'網元名稱',
  'BS.neType':'網元類型',
  'BS.neModel':'網元型號',
  'BS.neSFversion':'軟體版本',

  'BS.topology':'基站組態',

  'BS.parameters':'基站參數',
  'BS.basic': '基本',
  'BS.advanced': '進階',
  'BS.allTableSyncOptions': '同步所有設定選項',
  'BS.syncAction': '同步操作',
  'BS.syncWithNMSSettings': '依照網管設定同步',
  'BS.syncWithBSSettings': '依照基站設定同步',
  'BS.nmsSettingValue': '網管設定值',
  'BS.bsSettingValue': '基站設定值',
  'BS.parametersItem': '參數項目',
  'BS.mismatch': '是否不符',
  'BS.mismatchYes': '是',
  'BS.mismatchNo': '否',
  'BS.editParameterSettings': '編輯參數設定值',
  'BS.currentParameterValue': '當前參數值',
  'BS.currentSettingValue': '當前設定值',
  'BS.setNewParamValue': '設定新值',
  'BS.enterNewParameterValue': '請輸入欲設定的新參數值。',
  'BS.setParameterValue': '設定一個參數值',
  'BS.selectNewParameterValue': '請選擇欲設定的新參數值。',
  'BS.selectParameterValue': '選擇一個參數值',


  'BS.neighborBsList':'鄰居基站列表',
  'BS.editNeighborBS': '編輯鄰居基站',
  'BS.addNeighborBS': '新增鄰居基站',  
  'BS.enterHexNCI': '請輸入十六進位 NCI',
  'BS.nciIsRequired': 'NCI 為必填。',
  'BS.enterExactHexChars': '請輸入正確的 9 個十六進位字符。',
  'BS.onlyHexCharsAllowed': '只允許使用十六進位字符。',
  'BS.enterGNBID': '請輸入 gNB ID',
  'BS.enterPCI': '請輸入 PCI',
  'BS.enterMCC': '請輸入 MCC',
  'BS.enterMNC': '請輸入 MNC',
  'BS.enterNRARFCN': '請輸入 NRARFCN',
  'BS.gnbIDIsRequired': 'gNB ID 為必填。',
  'BS.pciIsRequired': 'PCI 為必填。',
  'BS.mccIsRequired': 'MCC 為必填。',
  'BS.mncIsRequired': 'MNC 為必填。',
  'BS.nrarfcnIsRequired': 'NRARFCN 為必填。',

  'BS.confirmDeleteNeighborBS': '確定要刪除此鄰居基站',

  'BS.alarms':'基站告警',

  'BS.neList':'網元列表',
  'BS.No':'編號',
  'BS.ip':'IP 位址',
  'BS.neStatus':'狀態',
  'BS.port':'埠號',
  'BS.edit':'編輯',

  'BS.performance':'基站效能',
  'BS.refreshBSPerformanceInfo': '刷新基站效能資訊',
  'BS.dataTimePast24Hours': '資料時間：過去 24 小時',

  'BS.viewMode': '檢視模式',
  'BS.fullInformation': '完整資訊',
  'BS.onlyBSLevel': '僅基站層級',
  'BS.kpiCategory': 'KPI 類別',
  'BS.kpiSubcategory': 'KPI 子類別',
  'BS.viewKPICategory': '檢視 KPI 類別',
  'BS.viewKPISubcategory': '檢視 KPI 子類別',


  // "BS.accessibility": "連線成功率",
  // "BS.drbAccessibility": "DRB 連線成功率",
  // "BS.integrity": "完整性",
  // "BS.integratedDownlinkDelay": "下行延遲彙總",
  // "BS.integratedUplinkDelay": "上行延遲彙總",
  // "BS.ranUEDownlinkThroughput": "RAN UE 下行吞吐量",
  // "BS.ranUEUplinkThroughput": "RAN UE 上行吞吐量",
  // "BS.utilization": "利用率",
  // "BS.processUtilization": "處理器利用率",
  // "BS.memoryUtilization": "記憶體利用率",
  // "BS.diskUtilization": "硬碟利用率",
  // "BS.retainability": "維持率",
  // "BS.mobility": "行動性",
  // "BS.ngRanHandoverSuccessRate": "NG-RAN 換手成功率",
  // "BS.energyConsumption": "能源消耗量",

  'BS.accessibility': 'Accessibility',
  'BS.drbAccessibility': 'DRB Accessibility',
  'BS.integrity': 'Integrity',
  'BS.integratedDownlinkDelay': 'Integrated Downlink Delay',
  'BS.integratedUplinkDelay': 'Integrated Uplink Delay',
  'BS.ranUEDownlinkThroughput': 'RAN UE Downlink Throughput',
  'BS.ranUEUplinkThroughput': 'RAN UE Uplink Throughput',
  'BS.utilization': 'Utilization',
  'BS.processUtilization': 'Process Utilization',
  'BS.memoryUtilization': 'Memory Utilization',
  'BS.diskUtilization': 'Disk Utilization',
  'BS.retainability': 'Retainability',
  'BS.mobility': 'Mobility',
  'BS.ngRanHandoverSuccessRate': 'NG-RAN Handover Success Rate',
  'BS.energyConsumption': 'Energy Consumption',

  "BS.timeInterval": "時間區間",
  'BS.timeIntervalHourly': '時間區間 ( 每小時 )',
  'BS.hourlyInterval': '每小時區間',

  'BS.dataSource': '資料來源',
  'BS.Power': '功耗 ( kW )',
  'BS.percentage': '百分比 ( % )',
  'BS.milliseconds': '毫秒 ( ms )',
  'BS.megabitsPerSecond': '兆位元每秒 ( Mbps )',
  'BS.kpiValueNone': '無',



  // Fault Management (故障管理)
  'fm.start':'起始時間',
  'fm.end':'結束時間',
  'fm.no':'編號',
  'fm.field':'場域名稱',
  'fm.BS':'基站名稱',
  'fm.component':'元件名稱',
  'fm.alarm':'告警名稱',
  'fm.severity':'嚴重度',
  'fm.count':'發生次數',
  'fm.occurtime':'事件時間',
  'fm.createtime':'首次記錄時間',
  'fm.updatetime':'最新更新時間',
  'fm.status':'告警狀態',
  'fm.situation':'處理狀況',
  'fm.owner':'回應人員',
  'fm.view':'檢視',
  'fm.total1':'全部共有',
  'fm.total2':'項訊息',
  'fm.eType':'告警分類',
  'fm.eCause':'告警原因',
  'fm.eDesc':'詳細描述',
  'fm.detail':'詳細告警訊息',
  'fm.addsitch':'新增處理狀況',
  'fm.sHistory':'處理狀況歷史紀錄',
  'fm.add':'新增',
  'fm.pending':'待處理',
  'fm.ended':'結束',
  'fm.close':'關閉',
  'fm.modifySuccess':'修改成功',

  // Performance Management (效能管理)
  'pm.field':'場域名稱',
  'pm.accessibility':'可用性',
  'pm.integrity':'完整性 (4指標)',
  'pm.retainability':'穩定性',
  'pm.efficiency':'能源效率',
  'pm.utilization':'利用率 (5指標)',
  'pm.mobility':'移動性',
  'information':'詳情資訊',
  'basic.info':'基本訊息',
  'nf.list':'NF 列表',
  'resource.pools':'Resource Pools',
  'ims.endpoint':'IMS 末端端點',
  'software.info':'軟體訊息',
  'version':'版本',
  'update':'更新',
  'theme':'調整主題',
  'logout_now':'登出',
  'view_detail':'詳細查看此項目',
  'createNF':'新增 NF',
  'delItem':'刪除此項',
  'updateSoftware':'更新此軟件',
  'nfRun':'NF 執行中',
  'nfNotRun':'NF 停止執行',
  'stopDE':'停止部署',
  'startDE':'開始部署',
  'createNFcapacity':'新增 NF Capacity',
  'a_search':'進階搜尋',
  'addSoftware':'新增軟體',
  'delsoftware':'刪除軟體',
  'type':'類型',
  'description':'描述',
  'fileName':'軟體名稱',
  'action':'動作',
  'time':'時間',
  'severity':'嚴重性',
  'NFmgr':'網路功能管理',
  'upload':'檔案上傳',
  'softwareFile':'軟體',
  'faultContext':'故障內容',
  'processComment':'備註',
  'npInfo':'網路效能訊息',
  'send':'傳送量',
  'receive':'接收量',
  'confirm_del_soft':'確定要刪除軟體',
  'confirm_del_field':'確定要刪除場域',
  'confirm_del_nf':'確定要刪除 NF',
  'performance_Advanced_Search':'進階查詢',
  'software_update':'軟體更新',
  'add_field':'場域新增',
  'detail':'NF動態',
  'limit.max':'上限',
  'limit.min':'下限',
  'modify_faultMsg_status':'修改故障訊息狀態',
  'confirm_modify':'確認修改',
  'pending_error':'待處理',
  'resolved':'已解決',
  'no_results':'未找到您想搜尋的相關數據。請嘗試修改搜尋關鍵字',

  //Dashboard
  'num_fields':'場域數量',
  'num_BSs':'基站數量',
  'num_UEs':'使用者數量',
  'coverage':'覆蓋率',
  'critical_Alarm':'嚴重告警',
  'major_Alarm':'主要告警',
  'minor_Alarm':'次要告警',
  'warning_Alarm':'警告告警',
  'dashboard.view':'檢視',

  //Software Management
  'firm':'firm',
  'model':'型號',
  'manufacturer':'生產廠商',
  'notes':'備註',
  'upload_time':'上傳時間',
  'file.Url':'新增方式',
  'ftp.account':'FTP 帳號',
  'ftp.password':'FTP 密碼',
  'upload.file':'上傳檔案',
  'url':'連結',
  'add.method':'選擇新增方式',
  'file.size':'檔案大小',
  'field_list':'場域列表',
  'software_version':'軟體版本',
  'time.end':'～ ',
  'modify_content': '變更軟體內容',
  'upload_file':'選擇上傳的檔案',
  
  // Component Management (元件管理)
  'cm.name':'元件名稱',
  'cm.provision':'匯入元件參數',
  'ExportCSV':'匯出過濾結果.csv', 
  'cm.add':'新增元件',
  'cm.type':'元件種類:',
  'cm.ip':'元件 IP 位址',
  'cm.port':'元件 Port',
  'cm.mac':'元件 MAC 位址',
  'cm.acc':'元件管理帳號',
  'cm.passw':'元件管理密碼',
  'cm.manufacturer':'生產廠商',
  'cm.model':'元件型號',
  'cm.delete':'刪除此元件',
  'cm.confirm_del':'確定要刪除此元件',
  'cm.unable_del':'無法刪除已組站之元件，請先刪除所屬之基站',
  'cm.error':'錯誤',
  'cm.info':'網元資訊',
  'cm.apply':'套用',
  'cm.file':'檔案管理',
  'cm.path':'路徑',
  'cm.download':'下載',
  'cm.container': '確定要更新單一Container? 其他未儲存之修改將被還原',
  'cm.notice' : '通知',
  'cm.applysoftware' : '軟體套用成功',
  'cm.restart' : '重啟',
  
  // Account Management (帳號管理)
  'user_account':'帳號',
  'key_account':'密碼',
  'role_account':'角色',
  'expired_time_account':'有效時間',
  'addaccount':'帳號新增',
  'delaccount':'帳號刪除',
  'confirm_del_acc':'確定帳號刪除',

  // Schedule Management (排程管理) @2024/03/22 Update
  'sm.select_type':'排程類型',
  'sm.select_field':'場域',
  'sm.create_type':'排程類型',
  'sm.createWindowTitle':'排程建立',
  'sm.th_create':'建立排程',
  'sm.th_time':'排程時間',
  'sm.scheduledExecutionTime': '排程執行時間',
  'sm.scheduledExecutionTimeTo':'～', 
  'sm.th_type':'類型',
  'sm.scheduleType': '排程類型',
  'sm.th_state':'執行狀態',
  'sm.th_download':'報表下載',
  'sm.th_view':'檢視',
  'sm.th_delete':'刪除',
  'sm.smDownload':'下載此排程報表',
  'sm.view_detail':'詳細查看此排程',
  'sm.delItem':'刪除此排程',
  'sm.sfReport':'產出軟體管理報表', // tickettype = 4
  'sm.fmReport':'產出故障管理報表', // tickettype = 3
  'sm.pmReport':'產出效能管理報表', // tickettype = 2
  'sm.caReport':'產出配置稽核報表', // tickettype = 1
  'sm.sfUpdate':'軟體更新',         // tickettype = 0

  'sm.jobPartialSuccessString':'部份成功', // ticketstatus = 5
  'sm.jobFailString':'失敗',               // ticketstatus = 4
  'sm.jobSuccessString':'成功',            // ticketstatus = 3
  'sm.jobOnGoingString':'進行中',          // ticketstatus = 2
  'sm.jobSchedulingString':'排程中',       // ticketstatus = 1 | 0
  'sm.jobDailyString':'每天',              // executedtype = 1
  'sm.jobWeeklyString':'每週',             // executedtype = 2
  'sm.jobMonthlyString':'每月',            // executedtype = 3
  'sm.daysOfWeek': ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  'sm.dateSuffix': '日', // 中文中特定的日期後綴

  'sm.confirm_del':'確定要刪除此排程',

  'sm.info':'排程資訊', 
  'sm.detailInfo':'詳細資訊', 
  'sm.executeField':'執行場域',

  'sm.contentInfo':'內容訊息',
  'sm.periodicExecution': '週期性執行',
  'sm.executionCycle': '執行週期',
  'sm.notPeriodicExecution': '無',
  'sm.reportDataRange': '報表資料區間',


  // tickettype = 0
  'sm.neCurrentVersion': '現有版本',
  'sm.neTargetVersion': '目標版本',

  // tickettype = 1
  'sm.snapshotAuditTitle': '欲稽核的快照名稱',

  // tickettype = 2
  'sm.startDate': '起始日期',
  'sm.endDate': '結束日期',
  'sm.kpiType': 'KPI 類型',
  'sm.custom': '自定義',
  'sm.kpiName': 'KPI 名稱',
  'sm.kpiDescription': 'KPI 說明',
  'sm.kpiFormula': 'KPI 公式',

  // 執行結果區
  'sm.executionResult': '執行結果',
  'sm.NeName':'網元名稱',
  'sm.targetNE': '目標網元',
  'sm.targetNeID': '目標網元 ID',
  'sm.neID': '網元 ID',
  'sm.time': '時間',
  'sm.updateStatus': '更新狀態',
  'sm.target': '目標',


  // Log Management (日誌管理)  @10/31 add by yuchen
  'LogLists': '日誌列表',
  'UserLogs': '使用者日誌',
  'NELogs': '網元日誌',     // NE = Network Element
  'Log.start':'執行時間',   // @11/17 changed by yuchen
  'Log.end':'～',          // @12/04 changed by yuchen
  'Log.total':'總共',      // @11/21 add by yuchen

  'UserLog.No':'編號',
  'UserLog.userid':'使用者',
  'UserLog.logtype':'類型',
  'UserLog.loglevel':'層級',
  'UserLog.logmsg':'執行動作',
  'UserLog.logtime':'執行時間',
  'UserLog.view':'檢視',
  'UserLog.single':'項使用者日誌訊息',          // @11/21 add by yuchen
  'UserLog.total':'項使用者日誌訊息',            // @11/21 changed by yuchen
  'UserLog.logKeywordString':'執行動作',        // @11/17 changed by yuchen
  'UserLog.detail':'使用者日誌詳細訊息',          // @11/03 add by yuchen
  'UserLog.detailclose':'關閉',                 // @11/03 add by yuchen
  'UserLog.ExportCSV':'匯出使用者日誌為 .csv',    // @11/07 add by yuchen
  'UserLog.ExportXLSX':'匯出使用者日誌為 .xlsx',  // @11/23 Add by yuchen
  'UserLog.Export':'匯出使用者日誌',              // @2024/03/13 Add by yuchen

  'NElog.No':'編號',
  'NElog.userid':'使用者',
  'NElog.comp_name':'網元名稱',               // @11/22 Add by yuchen
  'NElog.operation':'類型',
  'NElog.req_data':'請求數據',
  'NElog.resp_data':'回應數據',
  'NElog.logtime':'執行時間',
  'NElog.view':'檢視',
  'NElog.single':'項網元日誌訊息',              // @11/21 add by yuchen
  'NElog.total':'項網元日誌訊息',               // @11/21 changed by yuchen
  'NElog.logKeywordString':'請求 / 回應數據',   // @11/17 changed by yuchen
  'NElog.detail':'網元日誌詳細訊息',            // @11/03 add by yuchen
  'NElog.detailclose':'關閉',                // @11/03 add by yuchen
  'NElog.ExportCSV':'匯出網元日誌為 .csv',   // @11/07 add by yuchen
  'NElog.ExportXLSX':'匯出網元日誌為 .xlsx', // @11/23 Add by yuchen
  'NElog.Export':'匯出網元日誌',             // @2024/03/13 Add by yuchen

  // Slice Management ( 切片管理 )
  'slice.info':'切片詳細資訊',
}
