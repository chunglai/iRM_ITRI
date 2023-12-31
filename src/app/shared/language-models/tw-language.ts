export const TwLanguage = {

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
  'index.menu_componentMgr':'元件管理',
  'index.menu_faultMgr':'故障管理',
  'index.menu_performMgr':'效能管理',
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
  'ok':'確定',
  'cancel':'取消',
  'search':'搜尋',
  'search_criteria':'篩選條件',  // @12/04 Add by yuchen
  'clear_search':'搜尋重置',     // @11/24 Add by yuchen

  // Field Management (場域管理) @11/30 Add by yuchen
  'field.list':'場域列表',
  'field.name':'場域名稱',
  'field.bsNum':'基站數量',
  'field.alarm':'場域告警',
  'field.view':'檢視',
  'field.snapshot':'快照',
  'field.delTitle':'刪除',
  'field.delItem':'刪除此場域',
  'field.add':'新增場域',
  'field.info':'場域詳細資訊',
  'field.Map':'場域地圖',
  'field.image':'場域圖片',    // @2024/01/03 Update
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
  'field.CPU_Utilization':'使用率 - CPU',
  'field.Memory_Utilization':'使用率 - Memory',
  'field.bsInfo':'基站資訊',
  'field.BSname':'基站名稱',
  'field.BStype':'基站類型',
  'field.Longitude':'經度',
  'field.Latitude':'緯度',
  'field.modifyConfiguration':'修改配置',
  'field.neighboringBSList':'鄰近基站列表',
  'field.config':'場域配置',                  // @12/12 Add
  'field.configPMset':'效能管理參數設定',      // @12/12 Add 
  'field.report':'場域報表',                  // @12/12 Add
  'field.reportPM':'場域效能 (PM)',           // @12/12 Add
  'field.reportFM':'告警資訊 (FM)',           // @12/12 Add
  'field.optim':'場域優化',                   // @12/12 Add
  'field.optimSON':'執行 SON rApps',         // @12/12 Add
  'field.mapModel':'地圖模式',                // @12/12 Add
  'field.bsList':'基站列表',                  // @12/12 Add
  'field.bsAntennaCoord':'基站天線位置座標',   // @12/13 Add
  'field.BSstatus':'連線狀態',                // @12/13 Add
  'field.bsAlarm':'告警',                    // @12/13 Add
  'field.legend_all-in-one_bs':'一體式基站',  // @12/28 Add
  'field.legend_dist_bs':'O-RAN基站',        // @12/28 Add

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
  
  // Component Management (元件管理)
  'cm.name':'元件名稱',
  'cm.provision':'匯入元件參數',
  'ExportCSV':'匯出過濾結果.csv', 
  'cm.add':'新增元件',
  'cm.type':'元件種類:',
  'cm.ip':'元件IP位址',
  'cm.port':'元件Port',
  'cm.mac':'元件MAC位址',
  'cm.acc':'元件管理帳號',
  'cm.passw':'元件管理密碼',
  'cm.manufacturer':'生產廠商',
  'cm.model':'元件型號',
  'cm.delete':'刪除此元件',
  'cm.confirm_del':'確定要刪除此元件',
  'cm.unable_del':'無法刪除已組站之元件，請先刪除所屬之基站',
  'cm.error':'錯誤',
  'cm.info':'元件資訊',
  'cm.apply':'套用',
  'cm.file':'檔案管理',
  'cm.path':'路徑',
  'cm.download':'下載',
  
  // Account Management (帳號管理)
  'user_account':'帳號',
  'key_account':'密碼',
  'role_account':'角色',
  'expired_time_account':'有效時間',
  'addaccount':'帳號新增',
  'delaccount':'帳號刪除',
  'confirm_del_acc':'確定帳號刪除',

  // Schedule Management (排程管理) @11/24 Add by yuchen
  'sm.select_type':'排程類型',
  'sm.select_field':'場域',
  'sm.create_type':'排程類型',
  'sm.th_create':'建立排程',
  'sm.th_time':'排程時間',
  'sm.th_type':'類型',
  'sm.th_state':'狀態',
  'sm.th_download':'報表下載',
  'sm.th_view':'檢視',
  'sm.th_delete':'刪除',
  'sm.smDownload':'下載此排程報表',
  'sm.view_detail':'詳細查看此排程',
  'sm.delItem':'刪除此排程',
  'sm.fmReport':'產出故障管理報表',
  'sm.pmReport':'產出效能管理報表',
  'sm.sfUpdate':'軟體更新',
  
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
  'NElog.detailclose':'關閉',                 // @11/03 add by yuchen
  'NElog.ExportCSV':'匯出網元日誌為 .csv',      // @11/07 add by yuchen
  'NElog.ExportXLSX':'匯出網元日誌為 .xlsx',    // @11/23 Add by yuchen
}
