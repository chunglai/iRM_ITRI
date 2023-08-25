import { Injectable } from '@angular/core';
import { OCloudList } from './../field-management/field-management.component';
import { SystemSummary } from '../dashboard/dashboard.component';
import { OcloudSummary } from '../dashboard/dashboard.component';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { OcloudInfo, OcloudPerformance } from '../field-management/field-info/field-info.component';
import { FaultMessage, FaultMessages, FmStatus, FmStatusRecord } from '../fault-management/fault-management.component';
import * as _ from 'lodash';
import { PerformanceList } from '../performance-management/o-cloud-performance/o-cloud-performance.component';
import { SoftwareList } from '../software-management/software-management.component';
import { MainComponent } from '../main/main.component';
import { Nf, OcloudDmsList } from '../nf-management/nf-management.component';
import { OcloudCpuLoading, OcloudCpuUsage, OcloudDiskRate, OcloudDiskUsage, OcloudInterfaceUsage, OcloudMemoryUsage, OcloudNetworkThroughput, OcloudPower, OverviewKpi } from '../performance-management/o-cloud-performance-info/o-cloud-performance-info.component';
import { Observable } from 'rxjs';
import { DmsAvaliableCapacity, NfCapacityList, NfCapacitySummary, NfInfo, NfPerformance } from '../nf-management/nf-info/nf-info.component';
import { NfPerformanceList } from '../performance-management/nf-performance/nf-performance.component';
import { NfCpuLoading, NfCpuUsage, NfDiskRate, NfDiskUsage, NfInterfaceUsage, NfMemoryUsage, NfNetworkThroughput, NfOverviewKpi, NfPower } from '../performance-management/nf-performance-info/nf-performance-info.component';
import { Item } from './models/item';
import { FormGroup } from '@angular/forms';

export interface NowTime {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  isLocal!: boolean;
  restPath!: string;
  options = { headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }) };
  severitys: string[] = ['CRITICAL', 'MAJOR', 'MINOR', 'WARNING'];
  scaleFontSize: number = 20;
  rangeWidth: number = 10;
  statusList: Item[] = [
    { displayName: 'All', value: 'All' },
    { displayName: 'Running', value: '0' },
    { displayName: 'Deploying', value: '1' },
    { displayName: 'Fail Deploy', value: '2' },
    { displayName: 'Stopped', value: '3' }
  ];
  statusMapDisplayName: Map<string, string> = new Map();

  constructor(private http: HttpClient) {
    this.statusList.forEach((row) => {
      this.statusMapDisplayName.set(row.value, row.displayName);
    });
  }

  loadConfig(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.get('./assets/config/connection.json').subscribe(
        (res: any) => {
          this.isLocal = true;
          this.restPath = 'http://192.168.137.136:8080/o2_smo/webresources/ocloud';
          // this.isLocal = res['local'];
          //this.restPath = res['url'] + ':' + res['port'] + res['root'];
          resolve(true);
        });
    });
  }

  setSessionId(sessionId: string) {
    window.sessionStorage.setItem('sessionId', sessionId);
  }

  getSessionId(): string {
    return window.sessionStorage.getItem('sessionId') as string;
  }

  removeSessionId() {
    window.sessionStorage.removeItem('sessionId');
  }

  colorOne(): string {
    const styleType = window.sessionStorage.getItem('styleType');
    if (styleType === 'black') {
      return '#4FFF4F';
    } else {
      return '#27a327';
    }
  }

  colorTwo(): string {
    const styleType = window.sessionStorage.getItem('styleType');
    if (styleType === 'black') {
      return '#FFC14F';
    } else {
      return '#fc8f2a';
    }
  }

  colorThree(): string {
    const styleType = window.sessionStorage.getItem('styleType');
    if (styleType === 'black') {
      return '#FF3B3B';
    } else {
      return '#e90000';
    }
  }

  getNowTime(): NowTime {
    const d = new Date();
    const year = _.toString(d.getFullYear());
    const month = this.addZero(d.getMonth() + 1);
    const day = this.addZero(d.getDate());
    const hour = this.addZero(d.getHours());
    const minute = this.addZero(d.getMinutes());
    return {
      year: year,
      month: month,
      day: day,
      hour: hour,
      minute: minute
    }
  }

  addZero(t: number): string {
    const tStr = _.toString(t);
    if (tStr.length === 1) {
      return '0' + tStr;
    } else {
      return tStr;
    }
  }

  dealPostDate(time: any): string {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = this.addZero(date.getMonth() + 1);
    const day = this.addZero(date.getDate());
    const hour = this.addZero(date.getHours());
    const minute = this.addZero(date.getMinutes());
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }

  severityText(severity: string): string {
    if (severity.toUpperCase() === 'CRITICAL') {
      return 'Critical';
    } else if (severity.toUpperCase() === 'MAJOR') {
      return 'Major';
    } else if (severity.toUpperCase() === 'MINOR') {
      return 'Minor';
    } else if (severity.toUpperCase() === 'WARNING') {
      return 'Warning';
    } else {
      return '';
    }
  }

  details(status: number): string {
    return this.statusMapDisplayName.get(status.toString()) as string;
  }

  /* 第一個字母大寫，其餘小寫 */
  textTransfer(text: string) {
    if (text) {
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    } else {
      return '';
    }
  }

  /* API */
  // loginpage(body: {}): Observable<any> {
  //   const url = `${this.restPath}/loginpage`;
  //   const bodyStr = JSON.stringify(body);
  //   return this.http.post(url, bodyStr);
  // }

  queryOcloudList(): Observable<any> {
    const url = `${this.restPath}/queryOcloudList/${this.getSessionId()}`;
    return this.http.get(url);
  }

  createOcloud(body: {}): Observable<any> {
    const url = `${this.restPath}/createOcloud/${this.getSessionId()}`;
    const bodyStr = JSON.stringify(body);
    return this.http.post(url, bodyStr);
  }

  deleteOcloud(id: string): Observable<any> {
    const url = `${this.restPath}/deleteOcloud/${this.getSessionId()}/${id}`;
    return this.http.delete(url);
  }

  queryOcloudInfo(cloudId: string): Observable<any> {
    const url = `${this.restPath}/queryOcloudInfo/${this.getSessionId()}/${cloudId}`;
    return this.http.get(url);
  }

  queryOcloudPerformance(cloudId: string): Observable<any> {
    const url = `${this.restPath}/queryOcloudPerformance/${this.getSessionId()}/${cloudId}`;
    return this.http.get(url);
  }

  querySystemSummary(): Observable<any> {
    const url = `${this.restPath}/querySystemSummary/${this.getSessionId()}`;
    return this.http.get(url);
  }

  applyOcloudSoftware(body: {}): Observable<any> {
    const url = `${this.restPath}/applyOcloudSoftware/${this.getSessionId()}`;
    const bodyStr = JSON.stringify(body);
    return this.http.post(url, bodyStr);
  }

  queryPerformanceList(ocloudId: string, ocloudname: string): Observable<any> {
    const url = `${this.restPath}/queryPerformanceList/${this.getSessionId()}?ocloudId=${ocloudId}&ocloudname=${ocloudname}`;
    return this.http.get(url);
  }

  queryOverviewKpi(cloudId: string): Observable<any> {
    const url = `${this.restPath}/queryOverviewKpi/${this.getSessionId()}/${cloudId}`;
    return this.http.get(url);
  }

  queryFaultMessage(cloudName: string, nfName: string, acknowledgeOwner: string, severity: string, start: string, end: string, offset: number, limit: number): Observable<any> {
    const url = `${this.restPath}/queryFaultMessage/${this.getSessionId()}?ocloudname=${cloudName}&nfname=${nfName}&acknowledgeOwner=${acknowledgeOwner}&start=${start}&end=${end}&severity=${severity}&offset=${offset}&limit=${limit}`;
    return this.http.get(url);
  }

  // softwareType: 0 = O-Cloud; 1= NF(CU); 2=NF(DU); 3=NF(CU+DU); All
  querySoftwareList(fileName: string, type: string, version: string): Observable<any> {
    const url = `${this.restPath}/querySoftwareList/${this.getSessionId()}?fileName=${fileName}&type=${type}&version=${version}`;
    return this.http.get(url);
  }

  createSoftware(body: any): Observable<any> {
    const url = `${this.restPath}/createSoftware/${this.getSessionId()}`;
    const bodyStr = JSON.stringify(body);
    return this.http.post(url, bodyStr);
  }

  deleteSoftware(id: string): Observable<any> {
    const url = `${this.restPath}/deleteSoftware/${this.getSessionId()}/${id}`;
    return this.http.delete(url);
  }

  queryNfList(cloudId: string, cloudName: string, nfName: string, status: string): Observable<any> {
    const url = `${this.restPath}/queryNfList/${this.getSessionId()}/?cloudId=${cloudId}&ocloudname=${cloudName}&nfname=${nfName}&status=${status}`;
    return this.http.get(url);
  }

  actionNf(nfId: string, status: number): Observable<any> {
    const url = `${this.restPath}/actionNf/${this.getSessionId()}`;
    const bodyStr = JSON.stringify({ nfId: nfId, status: status });
    return this.http.post(url, bodyStr);
  }

  deleteNf(nfId: string, dmsId: string): Observable<any> {
    const url = `${this.restPath}/deleteNf/${this.getSessionId()}/${dmsId}/${nfId}`;
    return this.http.delete(url);
  }

  queryOcloudDmsList(cloudId: string): Observable<any> {
    const url = `${this.restPath}/queryOcloudDmsList/${this.getSessionId()}/${cloudId}`;
    return this.http.get(url);
  }

  createNf(body: any): Observable<any> {
    const url = `${this.restPath}/createNf/${this.getSessionId()}`;
    body['sessionid'] = this.getSessionId();
    const bodyStr = JSON.stringify(body);
    return this.http.post(url, bodyStr);
  }

  queryNfInfo(nfId: string): Observable<any> {
    const url = `${this.restPath}/queryNfInfo/${this.getSessionId()}/${nfId}`;
    return this.http.get(url);
  }

  queryNfPerformance(nfId: string): Observable<any> {
    const url = `${this.restPath}/queryNfPerformance/${this.getSessionId()}/${nfId}`;
    return this.http.get(url);
  }

  queryNfCapacitySummary(nfId: string): Observable<any> {
    const url = `${this.restPath}/queryNfCapacitySummary/${this.getSessionId()}/${nfId}`;
    return this.http.get(url);
  }

  queryNfCapacityList(nfId: string): Observable<any> {
    const url = `${this.restPath}/queryNfCapacityList/${this.getSessionId()}/${nfId}`;
    return this.http.get(url);
  }

  applyNfSoftware(body: any): Observable<any> {
    const url = `${this.restPath}/applyNfSoftware/${this.getSessionId()}`;
    const bodyStr = JSON.stringify(body);
    return this.http.post(url, bodyStr);
  }

  queryDmsAvaliableCapacity(dmsId: string): Observable<any> {
    const url = `${this.restPath}/queryDmsAvaliableCapacity/${this.getSessionId()}/${dmsId}`;
    return this.http.get(url);
  }

  createNfCapacity(body: any): Observable<any> {
    const url = `${this.restPath}/createNfCapacity/${this.getSessionId()}`;
    const bodyStr = JSON.stringify(body);
    return this.http.post(url, bodyStr);
  }

  deleteNfCapacity(dmsId: string, nfCapacityId: string): Observable<any> {
    const url = `${this.restPath}/deleteNfCapacity/${this.getSessionId()}/${dmsId}/${nfCapacityId}`;
    return this.http.delete(url);
  }

  queryNfOverviewKpi(nfId: string): Observable<any> {
    const url = `${this.restPath}/queryNfOverviewKpi/${this.getSessionId()}/${nfId}`;
    return this.http.get(url);
  }

  queryNfPerformanceList(ocloudId: string, ocloudName: string, nfId: string, nfName: string): Observable<any> {
    const url = `${this.restPath}/queryNfPerformanceList/${this.getSessionId()}?ocloudId=${ocloudId}&ocloudname=${ocloudName}&nfId=${nfId}&nfname=${nfName}`;
    return this.http.get(url);
  }

  queryOcPmAdvanceSearch(advancedForm: FormGroup): Observable<any> {
    const ocloudId = advancedForm.controls['globalId'].value;
    const ocloudName = advancedForm.controls['ocloudName'].value;
    const cpu = advancedForm.controls['cpu'].value;
    const memory = advancedForm.controls['memory'].value;
    const disk = advancedForm.controls['disk'].value;
    const network = advancedForm.controls['network'].value;
    const cpulimit = advancedForm.controls['cpulimit'].value;
    const memorylimit = advancedForm.controls['memorylimit'].value;
    const disklimit = advancedForm.controls['disklimit'].value;
    const networklimit = advancedForm.controls['networklimit'].value;
    const url = `${this.restPath}/queryOcPmAdvanceSearch/${this.getSessionId()}/&ocloudId=${ocloudId}&ocloudname=${ocloudName}&cpu=${cpu}&memory=${memory}&disk=${disk}&network=${network}&cpulimit=${cpulimit}&memorylimit=${memorylimit}&disklimit=${disklimit}&networklimit=${networklimit}`;
    return this.http.get(url);
  }

  queryNfPmAdvanceSearch(advancedForm: FormGroup): Observable<any> {
    const ocloudId = advancedForm.controls['globalId'].value;
    const ocloudName = advancedForm.controls['ocloudName'].value;
    const nfId = advancedForm.controls['nfId'].value;
    const nfName = advancedForm.controls['nfName'].value;
    const cpu = advancedForm.controls['cpu'].value;
    const memory = advancedForm.controls['memory'].value;
    const disk = advancedForm.controls['disk'].value;
    const network = advancedForm.controls['network'].value;
    const cpulimit = advancedForm.controls['cpulimit'].value;
    const memorylimit = advancedForm.controls['memorylimit'].value;
    const disklimit = advancedForm.controls['disklimit'].value;
    const networklimit = advancedForm.controls['networklimit'].value;
    const url = `${this.restPath}/queryNfPmAdvanceSearch/${this.getSessionId()}/&ocloudId=${ocloudId}&ocloudname=${ocloudName}}&nfId=${nfId}&nfname=${nfName}&cpu=${cpu}&memory=${memory}&disk=${disk}&network=${network}&cpulimit=${cpulimit}&memorylimit=${memorylimit}&disklimit=${disklimit}&networklimit=${networklimit}`;
    return this.http.get(url);
  }

  queryFMstatus(faultId: string): Observable<any> {
    const url = `${this.restPath}/queryFMstatus/${this.getSessionId()}/${faultId}`;
    return this.http.get(url);
  }

  queryFMstatusrecord(faultId: string): Observable<any> {
    const url = `${this.restPath}/queryFMstatusrecord/${this.getSessionId()}/${faultId}`;
    return this.http.get(url);
  }

  queryFMProcess(faultId: string, processStatus: number, processComment: string, acknowledgeOwner: string): Observable<any> {
    const url = `${this.restPath}/queryFMProcess/${this.getSessionId()}/${faultId}`;
    const bodyStr = JSON.stringify({
      processStatus: processStatus,
      processComment: processComment,
      acknowledgeOwner: acknowledgeOwner
    });
    return this.http.post(url, bodyStr, { observe: 'response' });
  }

  queryFMAdvanceSearch(globalId: string, cloudName: string, nfId: string, nfName: string, acknowledgeOwner: string, severity: string, start: string, end: string, offset: number, limit: number): Observable<any> {
    const url = `${this.restPath}/queryFMAdvanceSearch/${this.getSessionId()}/}?cloudId=${globalId}&cloudName=${cloudName}&nfId=${nfId}&nfname=${nfName}&start=${start}&end=${end}&severity=${severity}&acknowledgeOwner=${acknowledgeOwner}&offset=${offset}&limit=${limit}`;
    return this.http.get(url);
  }

  /* local file */
  systemSummary: SystemSummary = {
    ocloudCount: 2,
    nfCount: 10,
    totalCritical: 20,
    totalMajor: 10,
    totalMinor: 15,
    totalWarning: 30,
    avgCpu: "15%",
    totalMemory: "72 GB",
    avgStorage: "70.123 KBps",
    avgNetwork: "3.475 KBps"
  };

  ocloudSummary: OcloudSummary[] = [
    {
      id: "cloud000-0000-0000-0000-000000000000",
      name: "cloud0",
      dmsCount: 1,
      nfCount: 2,
      faultCount: 20
    },
    {
      id: "cloud000-0000-0000-0000-000000000001",
      name: "cloud1",
      dmsCount: 1,
      nfCount: 0,
      faultCount: 0
    },
    {
      id: "cloud000-0000-0000-0000-000000000002",
      name: "cloud2",
      dmsCount: 2,
      nfCount: 0,
      faultCount: 0
    },
    {
      id: "cloud000-0000-0000-0000-000000000003",
      name: "cloud3",
      dmsCount: 1,
      nfCount: 0,
      faultCount: 0
    },
    {
      id: "cloud000-0000-0000-0000-000000000004",
      name: "cloud4",
      dmsCount: 2,
      nfCount: 0,
      faultCount: 0
    },
    {
      id: "cloud000-0000-0000-0000-000000000005",
      name: "cloud5",
      dmsCount: 1,
      nfCount: 0,
      faultCount: 0
    },
    {
      id: "cloud000-0000-0000-0000-000000000006",
      name: "cloud6",
      dmsCount: 2,
      nfCount: 0,
      faultCount: 0
    }
    ,
    {
      id: "cloud000-0000-0000-0000-000000000007",
      name: "cloud7",
      dmsCount: 1,
      nfCount: 0,
      faultCount: 0
    },
    {
      id: "cloud000-0000-0000-0000-000000000008",
      name: "cloud8",
      dmsCount: 2,
      nfCount: 0,
      faultCount: 0
    },
    {
      id: "cloud000-0000-0000-0000-000000000009",
      name: "cloud9",
      dmsCount: 2,
      nfCount: 0,
      faultCount: 0
    }
  ];

  ocloudList: OCloudList[] = [
    {
      id: "cloud000-0000-0000-0000-000000000000",
      name: "cloud0",
      imsEndpoint: "http://10.172.61.30:5005/o2ims_infrastructureInventory/v1/",
      dmsCount: 1,
      nfCount: 2,
      deployStatus: "Deploy Finished"
    },
    {
      id: "cloud000-0000-0000-0000-000000000001",
      name: "cloud1",
      imsEndpoint: "http://10.172.61.31:5005/o2ims_infrastructureInventory/v1/",
      dmsCount: 1,
      nfCount: 0,
      deployStatus: "Deploy MaaS"
    },
    {
      id: "cloud000-0000-0000-0000-000000000002",
      name: "cloud2",
      imsEndpoint: "http://10.172.61.32:5005/o2ims_infrastructureInventory/v1/",
      dmsCount: 2,
      nfCount: 0,
      deployStatus: "Register VM on MaaS"
    },
    {
      id: "cloud000-0000-0000-0000-000000000003",
      name: "cloud3",
      imsEndpoint: "http://10.172.61.33:5005/o2ims_infrastructureInventory/v1/",
      dmsCount: 1,
      nfCount: 0,
      deployStatus: "Commission VM"
    },
    {
      id: "cloud000-0000-0000-0000-000000000004",
      name: "cloud4",
      imsEndpoint: "http://10.172.61.34:5005/o2ims_infrastructureInventory/v1/",
      dmsCount: 2,
      nfCount: 0,
      deployStatus: "Deploy Machines"
    },
    {
      id: "cloud000-0000-0000-0000-000000000005",
      name: "cloud5",
      imsEndpoint: "http://10.172.61.35:5005/o2ims_infrastructureInventory/v1/",
      dmsCount: 1,
      nfCount: 0,
      deployStatus: "Set Environment for k8s"
    },
    {
      id: "cloud000-0000-0000-0000-000000000006",
      name: "cloud6",
      imsEndpoint: "http://10.172.61.36:5005/o2ims_infrastructureInventory/v1/",
      dmsCount: 2,
      nfCount: 0,
      deployStatus: "Create k8s clusters"
    }
    ,
    {
      id: "cloud000-0000-0000-0000-000000000007",
      name: "cloud7",
      imsEndpoint: "http://10.172.61.37:5005/o2ims_infrastructureInventory/v1/",
      dmsCount: 1,
      nfCount: 0,
      deployStatus: "Deploy Node-Agent on each node"
    },
    {
      id: "cloud000-0000-0000-0000-000000000008",
      name: "cloud8",
      imsEndpoint: "http://10.172.61.38:5005/o2ims_infrastructureInventory/v1/",
      dmsCount: 2,
      nfCount: 0,
      deployStatus: "Deploy IMS"
    },
    {
      id: "cloud000-0000-0000-0000-000000000009",
      name: "cloud9",
      imsEndpoint: "http://10.172.61.39:5005/o2ims_infrastructureInventory/v1/",
      dmsCount: 2,
      nfCount: 0,
      deployStatus: "Running"
    },
    {
      id: "cloud000-0000-0000-0000-000000000009",
      name: "cloud9",
      imsEndpoint: "http://10.172.61.39:5005/o2ims_infrastructureInventory/v1/",
      dmsCount: 2,
      nfCount: 0,
      deployStatus: "Running"
    },
    {
      id: "33ebda65-f3aa-457a-9f7b-f587cd0efcc7",
      name: "cloud9",
      imsEndpoint: "http://10.172.61.39:5005/o2ims_infrastructureInventory/v1/",
      dmsCount: 2,
      nfCount: 0,
      deployStatus: "Failed Deployment"
    }

  ];

  ocloudInfo: OcloudInfo = {
    id: "33ebda65-f3aa-457a-9f7b-f587cd0efcc7",
    name: "cloud1",
    imsEndpoint: "http://10.172.61.30:5005/o2ims_infrastructureInventory/v1/",
    callbackUri: "https://10.0.2.16/callback/33ebda65",
    softwareVersion: "1.1.0",
    dms: [
      {
        id: "98cd5e2a-e9d5-3aa5-afdd-2c05d2be8e46",
        name: "k8s-cluster0",
        dmsEndpoint: "http://10.172.61.30:5005/o2dms/v1/98cd5e2a-e9d5-3aa5-afdd-2c05d2be8e46/"
      },
    ],
    nf: [
      {
        id: "47574686-3503-49c4-82ea-1d3312323df5",
        name: "nf1",
        dmsName: "k8s-cluster0",
        status: 0
      },
      {
        id: "47574686-3503-49c4-82ea-1d3312324c86",
        name: "nf2",
        dmsName: "k8s-cluster0",
        status: 1
      },
      {
        id: "47574686-3503-49c4-82ea-1d3312324c86",
        name: "nf2",
        dmsName: "k8s-cluster0",
        status: 2
      },
      {
        id: "47574686-3503-49c4-82ea-1d3312324c86",
        name: "nf2",
        dmsName: "k8s-cluster0",
        status: 3
      }
    ],
    fault: {
      critical: 10,
      major: 10,
      minor: 10,
      warning: 10
    },
    resourcepool: [
      {
        poolId: "pool0000- 0000 - 0000 - 0000 - 000000000000",
        poolName: "pool_0",
        node: [
          {
            nodeId: "n0000001",
            nodeName: "node1",
            cpu: [
              {
                id: "c0000001",
                name: "CPU1",
                product: "Intel(R) Xeon(R) CPU E5-2630 v4",
                capacity: "2200MHz"
              },
              {
                id: "c0000001",
                name: "CPU2",
                product: "Intel(R) Xeon(R) CPU E5-2630 v4",
                capacity: "2200MHz"
              },
              {
                id: "c0000001",
                name: "CPU1",
                product: "Intel(R) Xeon(R) CPU E5-2630 v4",
                capacity: "2200MHz"
              },
              {
                id: "c0000001",
                name: "CPU2",
                product: "Intel(R) Xeon(R) CPU E5-2630 v4",
                capacity: "2200MHz"
              }
            ],
            memory: { name: "memory", size: "40GB" },
            nic: [
              {
                id: "nic0000001",
                name: "NIC1",
                product: "I350 Gigabit Network Connection",
                capacity: "1Gbit/s"
              },
              {
                id: "nic0000002",
                name: "NIC2",
                product: "Ethernet Controller X710 for 10GbE SFP+",
                capacity: "10Gbit/s"
              },
              {
                id: "nic0000001",
                name: "NIC1",
                product: "I350 Gigabit Network Connection",
                capacity: "1Gbit/s"
              },
              {
                id: "nic0000002",
                name: "NIC2",
                product: "Ethernet Controller X710 for 10GbE SFP+",
                capacity: "10Gbit/s"
              }
            ],
            storage: {
              total: "120GB",
              items: [
                {
                  id: "disk001",
                  name: "SanDisk1",
                  size: "80GB"
                },
                {
                  id: "disk002",
                  name: "SanDisk2",
                  size: "40GB"
                },
                {
                  id: "disk001",
                  name: "SanDisk1",
                  size: "80GB"
                },
                {
                  id: "disk002",
                  name: "SanDisk2",
                  size: "40GB"
                }
              ]
            }
          },
          {
            nodeId: "n0000001",
            nodeName: "node1",
            cpu: [
              {
                id: "c0000001",
                name: "CPU3",
                product: "Intel(R) Xeon(R) CPU E5-2630 v4",
                capacity: "2200MHz"
              },
              {
                id: "c0000001",
                name: "CPU4",
                product: "Intel(R) Xeon(R) CPU E5-2630 v4",
                capacity: "2200MHz"
              }
            ],
            memory: { name: "memory", size: "40GB" },
            nic: [{
              id: "nic0000001",
              name: "NIC1",
              product: "I350 Gigabit Network Connection",
              capacity: "1Gbit/s"
            },
            {
              id: "nic0000002",
              name: "NIC2",
              product: "Ethernet Controller X710 for 10GbE SFP+",
              capacity: "10Gbit/s"
            }
            ],
            storage: {
              total: "120GB",
              items: [{
                id: "disk001",
                name: "SanDisk1",
                size: "80GB"
              },
              {
                id: "disk002",
                name: "SanDisk2",
                size: "40GB"
              }]
            }
          }, {
            nodeId: "n0000001",
            nodeName: "node1",
            cpu: [
              {
                id: "c0000001",
                name: "CPU5",
                product: "Intel(R) Xeon(R) CPU E5-2630 v4",
                capacity: "2200MHz"
              },
              {
                id: "c0000001",
                name: "CPU6",
                product: "Intel(R) Xeon(R) CPU E5-2630 v4",
                capacity: "2200MHz"
              }
            ],
            memory: { name: "memory", size: "40GB" },
            nic: [{
              id: "nic0000001",
              name: "NIC1",
              product: "I350 Gigabit Network Connection",
              capacity: "1Gbit/s"
            },
            {
              id: "nic0000002",
              name: "NIC2",
              product: "Ethernet Controller X710 for 10GbE SFP+",
              capacity: "10Gbit/s"
            }
            ],
            storage: {
              total: "120GB",
              items: [{
                id: "disk001",
                name: "SanDisk1",
                size: "80GB"
              },
              {
                id: "disk002",
                name: "SanDisk2",
                size: "40GB"
              }]
            }
          }
        ]
      },
      {
        poolId: "pool0000- 0000 - 0000 - 0000 - 000000000000",
        poolName: "pool_1",
        node: [
          {
            nodeId: "n0000001",
            nodeName: "node1",
            cpu: [
              {
                id: "c0000001",
                name: "CPU1",
                product: "Intel(R) Xeon(R) CPU E5-2630 v4",
                capacity: "2200MHz"
              },
              {
                id: "c0000001",
                name: "CPU1",
                product: "Intel(R) Xeon(R) CPU E5-2630 v4",
                capacity: "2200MHz"
              }
            ],
            memory: { name: "memory", size: "40GB" },
            nic: [{
              id: "nic0000001",
              name: "NIC1",
              product: "I350 Gigabit Network Connection",
              capacity: "1Gbit/s"
            },
            {
              id: "nic0000002",
              name: "NIC2",
              product: "Ethernet Controller X710 for 10GbE SFP+",
              capacity: "10Gbit/s"
            }
            ],
            storage: {
              total: "120GB",
              items: [{
                id: "disk001",
                name: "SanDisk1",
                size: "80GB"
              },
              {
                id: "disk002",
                name: "SanDisk2",
                size: "40GB"
              }]
            }
          },
          {
            nodeId: "n0000001",
            nodeName: "node1",
            cpu: [
              {
                id: "c0000001",
                name: "CPU1",
                product: "Intel(R) Xeon(R) CPU E5-2630 v4",
                capacity: "2200MHz"
              },
              {
                id: "c0000001",
                name: "CPU1",
                product: "Intel(R) Xeon(R) CPU E5-2630 v4",
                capacity: "2200MHz"
              }
            ],
            memory: { name: "memory", size: "40GB" },
            nic: [{
              id: "nic0000001",
              name: "NIC1",
              product: "I350 Gigabit Network Connection",
              capacity: "1Gbit/s"
            },
            {
              id: "nic0000002",
              name: "NIC2",
              product: "Ethernet Controller X710 for 10GbE SFP+",
              capacity: "10Gbit/s"
            }
            ],
            storage: {
              total: "120GB",
              items: [{
                id: "disk001",
                name: "SanDisk1",
                size: "80GB"
              },
              {
                id: "disk002",
                name: "SanDisk2",
                size: "40GB"
              }]
            }
          },
          {
            nodeId: "n0000001",
            nodeName: "node1",
            cpu: [
              {
                id: "c0000001",
                name: "CPU1",
                product: "Intel(R) Xeon(R) CPU E5-2630 v4",
                capacity: "2200MHz"
              },
              {
                id: "c0000001",
                name: "CPU1",
                product: "Intel(R) Xeon(R) CPU E5-2630 v4",
                capacity: "2200MHz"
              }
            ],
            memory: { name: "memory", size: "40GB" },
            nic: [{
              id: "nic0000001",
              name: "NIC1",
              product: "I350 Gigabit Network Connection",
              capacity: "1Gbit/s"
            },
            {
              id: "nic0000002",
              name: "NIC2",
              product: "Ethernet Controller X710 for 10GbE SFP+",
              capacity: "10Gbit/s"
            }
            ],
            storage: {
              total: "120GB",
              items: [{
                id: "disk001",
                name: "SanDisk1",
                size: "80GB"
              },
              {
                id: "disk002",
                name: "SanDisk2",
                size: "40GB"
              }]
            }
          }
        ]
      }
    ]
  };

  ocloudPerformance: OcloudPerformance = {
    // totalCpu: 20,
    // usedCpu: 18
    cpu: "17 %",
    memory: "26 GB",
    storage: "56.55 KBps",
    network: "0.123 KBps"
  }

  faultMessage: FaultMessage = {
    //totalMessageNumber: 1000,
     totalMessageNumber: 0,
    faultMessages: [
      {
        faultId: '1',
        timestamp: "2022/07/01 20: 00: 00",
        cloudId: "cloud00000000",
        nfId: "nf000000001",
        severity: "Critical",
        context: "主機錯誤",
        isCleared: false,
        processStatus: 0,
        processComment: "",
        cloudName: "cloud1",
        nfName: "nf1",
        acknowledgeOwner: "Sam"
      },
      {
        faultId: '2',
        timestamp: "2022 / 07 / 01 20: 01: 30",
        cloudId: "cloud00000001",
        nfId: "nf000000002",
        severity: "Major",
        context: "主機連線失敗",
        isCleared: true,
        processStatus: 1,
        processComment: "By sswu",
        cloudName: "cloud2",
        nfName: "nf2",
        acknowledgeOwner: "Sam"
      },
      {
        faultId: '3',
        timestamp: "2022 / 07 / 01 20: 01: 30",
        cloudId: "cloud00000001",
        nfId: "nf000000002",
        severity: "Minor",
        context: "無法連線到儲存空間",
        isCleared: true,
        processStatus: 1,
        processComment: "IO Changed",
        cloudName: "cloud2",
        nfName: "nf2",
        acknowledgeOwner: "Sam"
      },
      {
        faultId: '4',
        timestamp: "2022 / 07 / 01 20: 01: 30",
        cloudId: "cloud00000001",
        nfId: "nf000000002",
        severity: "Warning",
        context: "結束待命錯誤",
        isCleared: true,
        processStatus: 0,
        processComment: "",
        cloudName: "cloud2",
        nfName: "nf2",
        acknowledgeOwner: "Sam"
      },
      {
        faultId: '2',
        timestamp: "2022/07/01 20: 00: 00",
        cloudId: "cloud00000000",
        nfId: "nf000000001",
        severity: "Critical",
        context: "授權錯誤",
        isCleared: false,
        processStatus: 0,
        processComment: "",
        cloudName: "cloud2",
        nfName: "nf2",
        acknowledgeOwner: "Sam"
      },
      {
        faultId: '2',
        timestamp: "2022 / 07 / 01 20: 01: 30",
        cloudId: "cloud00000001",
        nfId: "nf000000002",
        severity: "Major",
        context: "主機 CPU 使用量",
        isCleared: true,
        processStatus: 1,
        processComment: "By sswu",
        cloudName: "cloud2",
        nfName: "nf2",
        acknowledgeOwner: "Sam"
      },
      {
        faultId: '2',
        timestamp: "2022 / 07 / 01 20: 01: 30",
        cloudId: "cloud00000001",
        nfId: "nf000000002",
        severity: "Minor",
        context: "網路連線中斷",
        isCleared: true,
        processStatus: 1,
        processComment: "IO Changed",
        cloudName: "cloud2",
        nfName: "nf2",
        acknowledgeOwner: "Sam"
      },
      {
        faultId: '2',
        timestamp: "2022 / 07 / 01 20: 01: 30",
        cloudId: "cloud00000001",
        nfId: "nf000000002",
        severity: "Warning",
        context: "網路上行冗餘遺失",
        isCleared: true,
        processStatus: 0,
        processComment: "",
        cloudName: "cloud2",
        nfName: "nf2",
        acknowledgeOwner: "Sam"
      },
      {
        faultId: '2',
        timestamp: "2022/07/01 20: 00: 00",
        cloudId: "cloud00000000",
        nfId: "nf000000001",
        severity: "Critical",
        context: "網路上行冗餘已降級",
        isCleared: false,
        processStatus: 0,
        processComment: "",
        cloudName: "cloud2",
        nfName: "nf2",
        acknowledgeOwner: "Sam"
      },
      {
        faultId: '2',
        timestamp: "2022 / 07 / 01 20: 01: 30",
        cloudId: "cloud00000001",
        nfId: "nf000000002",
        severity: "Major",
        context: "主機錯誤",
        isCleared: true,
        processStatus: 1,
        processComment: "By sswu",
        cloudName: "cloud2",
        nfName: "nf2",
        acknowledgeOwner: "Sam"
      }
    ]
  };

  fmAdvanceSearch: FaultMessage = {
    totalMessageNumber: 2023,
    // totalMessageNumber: 0,
    faultMessages: [
      {
        faultId: '1',
        timestamp: "2022/07/01 20: 00: 00",
        cloudId: "cloud00000000",
        nfId: "nf000000001",
        severity: "Critical",
        context: "主機錯誤",
        isCleared: false,
        processStatus: 0,
        processComment: "",
        cloudName: "cloud10",
        nfName: "nf1",
        acknowledgeOwner: "Sam"
      },
      {
        faultId: '2',
        timestamp: "2022 / 07 / 01 20: 01: 30",
        cloudId: "cloud00000001",
        nfId: "nf000000002",
        severity: "Major",
        context: "主機連線失敗",
        isCleared: true,
        processStatus: 1,
        processComment: "By sswu",
        cloudName: "cloud9",
        nfName: "nf2",
        acknowledgeOwner: "Sam"
      },
      {
        faultId: '3',
        timestamp: "2022 / 07 / 01 20: 01: 30",
        cloudId: "cloud00000001",
        nfId: "nf000000002",
        severity: "Minor",
        context: "無法連線到儲存空間",
        isCleared: true,
        processStatus: 1,
        processComment: "IO Changed",
        cloudName: "cloud8",
        nfName: "nf2",
        acknowledgeOwner: "Sam"
      },
      {
        faultId: '4',
        timestamp: "2022 / 07 / 01 20: 01: 30",
        cloudId: "cloud00000001",
        nfId: "nf000000002",
        severity: "Warning",
        context: "結束待命錯誤",
        isCleared: true,
        processStatus: 0,
        processComment: "",
        cloudName: "cloud7",
        nfName: "nf2",
        acknowledgeOwner: "Sam"
      },
      {
        faultId: '2',
        timestamp: "2022/07/01 20: 00: 00",
        cloudId: "cloud00000000",
        nfId: "nf000000001",
        severity: "Critical",
        context: "授權錯誤",
        isCleared: false,
        processStatus: 0,
        processComment: "",
        cloudName: "cloud6",
        nfName: "nf2",
        acknowledgeOwner: "Sam"
      },
      {
        faultId: '2',
        timestamp: "2022 / 07 / 01 20: 01: 30",
        cloudId: "cloud00000001",
        nfId: "nf000000002",
        severity: "Major",
        context: "主機 CPU 使用量",
        isCleared: true,
        processStatus: 1,
        processComment: "By sswu",
        cloudName: "cloud5",
        nfName: "nf2",
        acknowledgeOwner: "Sam"
      },
      {
        faultId: '2',
        timestamp: "2022 / 07 / 01 20: 01: 30",
        cloudId: "cloud00000001",
        nfId: "nf000000002",
        severity: "Minor",
        context: "網路連線中斷",
        isCleared: true,
        processStatus: 1,
        processComment: "IO Changed",
        cloudName: "cloud4",
        nfName: "nf2",
        acknowledgeOwner: "Sam"
      },
      {
        faultId: '2',
        timestamp: "2022 / 07 / 01 20: 01: 30",
        cloudId: "cloud00000001",
        nfId: "nf000000002",
        severity: "Warning",
        context: "網路上行冗餘遺失",
        isCleared: true,
        processStatus: 0,
        processComment: "",
        cloudName: "cloud3",
        nfName: "nf2",
        acknowledgeOwner: "Sam"
      },
      {
        faultId: '2',
        timestamp: "2022/07/01 20: 00: 00",
        cloudId: "cloud00000000",
        nfId: "nf000000001",
        severity: "Critical",
        context: "網路上行冗餘已降級",
        isCleared: false,
        processStatus: 0,
        processComment: "",
        cloudName: "cloud2",
        nfName: "nf2",
        acknowledgeOwner: "Sam"
      },
      {
        faultId: '2',
        timestamp: "2022 / 07 / 01 20: 01: 30",
        cloudId: "cloud00000001",
        nfId: "nf000000002",
        severity: "Major",
        context: "主機錯誤",
        isCleared: true,
        processStatus: 1,
        processComment: "By sswu",
        cloudName: "cloud1",
        nfName: "nf2",
        acknowledgeOwner: "Sam"
      }
    ]
  };

  performanceList: PerformanceList[] = [
    {
      id: "12345678-ABCD-1000-A000-00000001",
      name: "cloud1",
      cpuLoading: "65 %",
      memoryUsage: "2410923KB",
      diskUsage: "15000MB",
      networkThroughput: "640235KBps"
    },
    {
      id: "12345678-ABCD-1000-A000-00000002",
      name: "cloud2",
      cpuLoading: "65 %",
      memoryUsage: "2410923KB",
      diskUsage: "15000MB",
      networkThroughput: "640235KBps"
    },
    {
      id: "12345678-ABCD-1000-A000-00000003",
      name: "cloud3",
      cpuLoading: "35 %",
      memoryUsage: "2410923KB",
      diskUsage: "15000MB",
      networkThroughput: "640235KBps"
    },
    {
      id: "12345678-ABCD-1000-A000-00000004",
      name: "cloud4",
      cpuLoading: "35 %",
      memoryUsage: "2410923KB",
      diskUsage: "15000MB",
      networkThroughput: "640235KBps"
    },
    {
      id: "12345678-ABCD-1000-A000-00000005",
      name: "cloud5",
      cpuLoading: "35 %",
      memoryUsage: "2410923KB",
      diskUsage: "15000MB",
      networkThroughput: "640235KBps"
    },
    {
      id: "12345678-ABCD-1000-A000-00000006",
      name: "cloud6",
      cpuLoading: "65 %",
      memoryUsage: "2410923KB",
      diskUsage: "15000MB",
      networkThroughput: "640235KBps"
    },
    {
      id: "12345678-ABCD-1000-A000-00000007",
      name: "cloud7",
      cpuLoading: "35 %",
      memoryUsage: "2410923KB",
      diskUsage: "15000MB",
      networkThroughput: "640235KBps"
    },
    {
      id: "12345678-ABCD-1000-A000-00000008",
      name: "cloud8",
      cpuLoading: "35 %",
      memoryUsage: "2410923KB",
      diskUsage: "15000MB",
      networkThroughput: "640235KBps"
    },
    {
      id: "12345678-ABCD-1000-A000-00000009",
      name: "cloud9",
      cpuLoading: "35 %",
      memoryUsage: "2410923KB",
      diskUsage: "15000MB",
      networkThroughput: "640235KBps"
    },
    {
      id: "12345678-ABCD-1000-A000-000000010",
      name: "cloud10",
      cpuLoading: "65 %",
      memoryUsage: "2410923KB",
      diskUsage: "15000MB",
      networkThroughput: "640235KBps"
    },
    {
      id: "12345678-ABCD-1000-A000-000000011",
      name: "cloud11",
      cpuLoading: "35 %",
      memoryUsage: "2410923KB",
      diskUsage: "15000MB",
      networkThroughput: "640235KBps"
    },
    {
      id: "12345678-ABCD-1000-A000-000000012",
      name: "cloud12",
      cpuLoading: "35 %",
      memoryUsage: "2410923KB",
      diskUsage: "15000MB",
      networkThroughput: "640235KBps"
    },
    {
      id: "12345678-ABCD-1000-A000-000000013",
      name: "cloud13",
      cpuLoading: "35 %",
      memoryUsage: "2410923KB",
      diskUsage: "15000MB",
      networkThroughput: "640235KBps"
    }
  ];
  ocPmAdvanceSearchList: PerformanceList[] = [
    {
      id: "12345678-ABCD-1000-A000-00000001",
      name: "cloud1",
      cpuLoading: "65%",
      memoryUsage: "2410923KB",
      diskUsage: "150000MB",
      networkThroughput: "640235KBps"
    },
    {
      id: "12345678-ABCD-1000-A000-00000002",
      name: "cloud2",
      cpuLoading: "35%",
      memoryUsage: "1720402KB",
      diskUsage: "150000MB",
      networkThroughput: "242012KBps"
    }
  ];


  softwareList: SoftwareList[] = [
    {
      id: "s0011001",
      fileName: "Os_image_2.tar",
      version: "1.1.0",
      type: 0,
      description: "CU",
      md5: "dfa7e36b8932de22aeec348e9e0970bb"
    },
    {
      id: "s0011002",
      fileName: "Os_image_3.tar",
      version: "1.1.1",
      type: 0,
      description: "CU",
      md5: "0d4376a409626e63204052bb1cd0961d"
    },
    {
      id: "s0011003",
      fileName: "Os_image_4.tar",
      version: "1.1.3",
      type: 1,
      description: "O-Cloud",
      md5: "ca4e024465c1d5d8cbf64db196f3f043"
    },
    {
      id: "s0011004",
      fileName: "NF_image_5.tar",
      version: "1.2.0",
      type: 1,
      description: "O-Cloud",
      md5: "fe5e567884c3d5c7hfdf64dr597gd53f5"
    },
    {
      id: "s0011005",
      fileName: "NF_image_7.tar",
      version: "1.2.0",
      type: 2,
      description: "O-Cloud",
      md5: "dfa7e36b8932de22aeec348e9e0970bb"
    }
  ];

  nfList: Nf[] = [
    {
      globalId: "cloud000-0000-0000-0000-000000000001",
      nfId: "47574686-3503-49c4-82ea-1d3312323df5",
      nfname: "nf1",
      ocloudName: "cloud1",
      dmsId: 'aaa',
      status: 0,
    },
    {
      globalId: "cloud000-0000-0000-0000-000000000002",
      nfId: "47574686-3503-49c4-82ea-1d3312323df6",
      nfname: "nf2",
      ocloudName: "cloud2",
      dmsId: 'aaa',
      status: 1,
    },
    {
      globalId: "cloud000-0000-0000-0000-000000000003",
      nfId: "47574686-3503-49c4-82ea-1d3312323df7",
      nfname: "nf3",
      ocloudName: "cloud3",
      dmsId: 'aaa',
      status: 2,
    },
    {
      globalId: "cloud000-0000-0000-0000-000000000004",
      nfId: "47574686-3503-49c4-82ea-1d3312323df7",
      nfname: "nf4",
      ocloudName: "cloud4",
      dmsId: 'aaa',
      status: 3,
    }
  ];

  overviewKpi: OverviewKpi = {
    ocloudId: "12345678-ABCD-1000-A000-00000001",
    startTime: "2022-11-24 00:20",
    endTime: "2022-11-24 02:20",
    interval: 5,
    tickInterval: 30,
    cpuUsage: ["25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%"],
    cpuLoading: ["65%", "55%", "52%", "68%", "65%", "55%", "52%", "68%", "65%", "55%", "52%", "68%", "65%", "55%", "52%", "68%", "65%", "55%", "52%", "68%", "65%", "55%", "52%", "68%", "65%", "55%", "52%", "68%"],
    memoryUsage: ["2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB"],
    diskUsage: ["150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB"],
    diskRate: ["6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps"],
    interfaceUsage: ["50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%"],
    networkThroughput: ["640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps"],
    power: ["500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W"]
  };

  ocloudCpuUsage: OcloudCpuUsage = {
    ocloudId: "12345678-ABCD-1000-A000-00000001",
    startTime: "2022-11-23 00:00",
    endTime: "2022-11-24 00:00",
    interval: 15,
    tickInterval: 60,
    cpuUsage: ["25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%"]
  };

  ocloudCpuLoading: OcloudCpuLoading = {
    ocloudId: "12345678-ABCD-1000-A000-00000001",
    startTime: "2022-11-24 00:20",
    endTime: "2022-11-24 02:20",
    interval: 5,
    tickInterval: 30,
    cpuLoading: ["65%", "55%", "52%", "68%", "65%", "55%", "52%", "68%", "65%", "55%", "52%", "68%", "65%", "55%", "52%", "68%", "65%", "55%", "52%", "68%", "65%", "55%", "52%", "68%", "65%", "55%", "52%", "68%"]
  }

  ocloudMemoryUsage: OcloudMemoryUsage = {
    ocloudId: "12345678-ABCD-1000-A000-00000001",
    startTime: "2022-11-24 00:20",
    endTime: "2022-11-24 02:20",
    interval: 5,
    tickInterval: 30,
    memoryUsage: ["2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB"]
  }

  ocloudDiskUsage: OcloudDiskUsage = {
    ocloudId: "12345678-ABCD-1000-A000-00000001",
    startTime: "2022-11-24 00:20",
    endTime: "2022-11-24 02:20",
    interval: 5,
    tickInterval: 30,
    diskUsage: ["150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB"]
  }

  ocloudDiskRate: OcloudDiskRate = {
    ocloudId: "12345678-ABCD-1000-A000-00000001",
    startTime: "2022-11-24 00:20",
    endTime: "2022-11-24 02:20",
    interval: 5,
    tickInterval: 30,
    diskRate: ["6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps"]
  }

  ocloudInterfaceUsage: OcloudInterfaceUsage = {
    ocloudId: "12345678-ABCD-1000-A000-00000001",
    startTime: "2022-11-24 00:20",
    endTime: "2022-11-24 02:20",
    interval: 5,
    tickInterval: 30,
    interfaceUsage: ["50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%"]
  }

  ocloudNetworkThroughput: OcloudNetworkThroughput = {
    ocloudId: "12345678-ABCD-1000-A000-00000001",
    startTime: "2022-11-24 00:20",
    endTime: "2022-11-24 02:20",
    interval: 5,
    tickInterval: 30,
    networkThroughput: ["640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps"]
  }

  ocloudPower: OcloudPower = {
    ocloudId: "12345678-ABCD-1000-A000-00000001",
    startTime: "2022-11-24 00:20",
    endTime: "2022-11-24 02:20",
    interval: 5,
    tickInterval: 30,
    power: ["500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W"]
  }

  ocloudDmsList: OcloudDmsList = {
    id: "cloud000-0000-0000-0000-00000000001",
    name: "cloud1",
    dms: [
      {
        id: "9f58-96cf07543c40",
        name: "k8s-cluster0",
        cpu: 100,
        memory: "1000 GB",
        storage: "100 GB",
        network: 100
      },
      {
        id: "9f58-96cf07543c41",
        name: "k8s-cluster0",
        cpu: 30,
        memory: "200 GB",
        storage: "20 GB",
        network: 35
      },
      {
        id: "9f58-96cf07543c42",
        name: "k8s-cluster1",
        cpu: 10,
        memory: "13 GB",
        storage: "20 GB",
        network: 8
      }
    ]
  }

  nfInfo: NfInfo = {
    globalId: "cloud000-0000-0000-0000-000000000000",
    nfname: "nf1",
    nfId: "nf12345-ABCD-1000",
    fault: { critical: 1, major: 1, minor: 8, warning: 4 },
    descriptor: "nf1-desc",
    ocloudName: "cloud1",
    dmsName: "k8s-cluster0",
    artifactRepoUrl: "https://ylhsiehitri.github.io/helm-repo1",
    artifactName: "cu",
    type: "CU",
    status: 2,
    softwareVersion: "1.0.0"
  };

  nfPerformance: NfPerformance = {
    send: "0.8 Kbps",
    receive: "56 Kbps",
    memoryUsed: "18 %",
    throughput: "500 Kbps"
  };

  nfCapacitySummary: NfCapacitySummary = {
    totalCpu: 3,
    totalMemory: "40 GB",
    totalStorage: "20 GB",
    totalInterface: 2
  }

  nfCapacityList: NfCapacityList[] = [
    {
      nfCapacityId: "nf-0001",
      name: "NF-capacity1",
      cpu: 1,
      memory: "10 GB",
      storage: "20 GB",
      network: 1
    },
    {
      nfCapacityId: "nf-0002",
      name: "NF-capacity2",
      cpu: 1,
      memory: "30 GB",
      storage: "0",
      network: 0
    },
    {
      nfCapacityId: "nf-0001",
      name: "NF-capacity3",
      cpu: 0,
      memory: "0",
      storage: "0",
      network: 1
    }
  ];

  dmsAvaliableCapacity: DmsAvaliableCapacity = {
    dmsId: "dms_1-0_id",
    dmsName: "k8s-cluster0",
    cpu: 0,
    memory: "32 GB",
    storage: "13 GB",
    network: 3
  }

  nfPerformanceList: NfPerformanceList[] = [
    {
      nfname: "nf1",
      nfId: "NF1",
      ocloudId: "12345678-ABCD-1000-A000-00000001",
      ocloudName: "cloud1",
      cpuLoading: "65%",
      memoryUsage: "2410923KB",
      diskUsage: "150000MB",
      networkThroughput: "640235KBps"
    },
    {
      nfname: "nf2",
      nfId: "NF2",
      ocloudId: "12345678-ABCD-1000-A000-00000002",
      ocloudName: "cloud2",
      cpuLoading: "35%",
      memoryUsage: "1720402KB",
      diskUsage: "20500MB",
      networkThroughput: "242012KBps"
    },
    {
      nfname: "nf1",
      nfId: "NF1",
      ocloudId: "12345678-ABCD-1000-A000-00000001",
      ocloudName: "cloud1",
      cpuLoading: "65%",
      memoryUsage: "2410923KB",
      diskUsage: "150000MB",
      networkThroughput: "640235KBps"
    },
    {
      nfname: "nf2",
      nfId: "NF2",
      ocloudId: "12345678-ABCD-1000-A000-00000002",
      ocloudName: "cloud2",
      cpuLoading: "35%",
      memoryUsage: "1720402KB",
      diskUsage: "20500MB",
      networkThroughput: "242012KBps"
    },
    {
      nfname: "nf1",
      nfId: "NF1",
      ocloudId: "12345678-ABCD-1000-A000-00000001",
      ocloudName: "cloud1",
      cpuLoading: "65%",
      memoryUsage: "2410923KB",
      diskUsage: "150000MB",
      networkThroughput: "640235KBps"
    },
    {
      nfname: "nf2",
      nfId: "NF2",
      ocloudId: "12345678-ABCD-1000-A000-00000002",
      ocloudName: "cloud2",
      cpuLoading: "35%",
      memoryUsage: "1720402KB",
      diskUsage: "20500MB",
      networkThroughput: "242012KBps"
    }
  ];

  nfPmAdvanceSearchList: NfPerformanceList[] = [
    {
      nfname: "nf1",
      nfId: "nf12345-ABCD-1000",
      ocloudId: "12345678-ABCD-1000-A000-00000001",
      ocloudName: "cloud1",
      cpuLoading: "65%",
      memoryUsage: "2410923KB",
      diskUsage: "150000MB",
      networkThroughput: "640235KBps"
    },
    {
      nfname: "nf2",
      nfId: "nf12345-ABCD-1001",
      ocloudId: "12345678-ABCD-1000-A000-00000002",
      ocloudName: "cloud2",
      cpuLoading: "35%",
      memoryUsage: "1720402KB",
      diskUsage: "20500MB",
      networkThroughput: "242012KBps"
    }
  ];

  nfOverviewKpi: NfOverviewKpi = {
    nfId: "47574686-3503-49c4-82ea-1d3312323df5",
    startTime: "2023-04-20 00:20",
    endTime: "2023-04-20 02:20",
    interval: 5,
    tickInterval: 30,
    cpuUsage: ["25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%"],
    cpuLoading: ["65%", "55%", "52%", "68%", "65%", "55%", "52%", "68%", "65%", "55%", "52%", "68%", "65%", "55%", "52%", "68%", "65%", "55%", "52%", "68%", "65%", "55%", "52%", "68%", "65%", "55%", "52%", "68%"],
    memoryUsage: ["2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB"],
    diskUsage: ["150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB"],
    diskRate: ["6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps"],
    interfaceUsage: ["50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%"],
    networkThroughput: ["640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps"],
    power: ["500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W"]
  };

  nfCpuUsage: NfCpuUsage = {
    nfId: "12345678-ABCD-1000-A000-00000001",
    startTime: "2022-11-23 00:00",
    endTime: "2022-11-24 00:00",
    interval: 15,
    tickInterval: 60,
    cpuUsage: ["25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%", "25%"]
  };

  nfCpuLoading: NfCpuLoading = {
    nfId: "12345678-ABCD-1000-A000-00000001",
    startTime: "2022-11-24 00:20",
    endTime: "2022-11-24 02:20",
    interval: 5,
    tickInterval: 30,
    cpuLoading: ["65%", "55%", "52%", "68%", "65%", "55%", "52%", "68%", "65%", "55%", "52%", "68%", "65%", "55%", "52%", "68%", "65%", "55%", "52%", "68%", "65%", "55%", "52%", "68%", "65%", "55%", "52%", "68%"]
  }

  nfMemoryUsage: NfMemoryUsage = {
    nfId: "12345678-ABCD-1000-A000-00000001",
    startTime: "2022-11-24 00:20",
    endTime: "2022-11-24 02:20",
    interval: 5,
    tickInterval: 30,
    memoryUsage: ["2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB", "2410923KB", "2382843KB", "2209998KB"]
  }

  nfDiskUsage: NfDiskUsage = {
    nfId: "12345678-ABCD-1000-A000-00000001",
    startTime: "2022-11-24 00:20",
    endTime: "2022-11-24 02:20",
    interval: 5,
    tickInterval: 30,
    diskUsage: ["150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB", "150000MB"]
  }

  nfDiskRate: NfDiskRate = {
    nfId: "12345678-ABCD-1000-A000-00000001",
    startTime: "2022-11-24 00:20",
    endTime: "2022-11-24 02:20",
    interval: 5,
    tickInterval: 30,
    diskRate: ["6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps", "6402KBps", "6218KBps", "6092KBps"]
  }

  nfInterfaceUsage: NfInterfaceUsage = {
    nfId: "12345678-ABCD-1000-A000-00000001",
    startTime: "2022-11-24 00:20",
    endTime: "2022-11-24 02:20",
    interval: 5,
    tickInterval: 30,
    interfaceUsage: ["50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%", "50%"]
  }

  nfNetworkThroughput: NfNetworkThroughput = {
    nfId: "12345678-ABCD-1000-A000-00000001",
    startTime: "2022-11-24 00:20",
    endTime: "2022-11-24 02:20",
    interval: 5,
    tickInterval: 30,
    networkThroughput: ["640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps", "640235KBps"]
  }

  nfPower: NfPower = {
    nfId: "12345678-ABCD-1000-A000-00000001",
    startTime: "2022-11-24 00:20",
    endTime: "2022-11-24 02:20",
    interval: 5,
    tickInterval: 30,
    power: ["500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W", "500W"]
  }

  fmStatus: FmStatus = {
    timestamp: "2022/07/01 20:01:30",
    cloudId: "cloud00000001",
    nfId: "nf000000002",
    severity: "MAJOR",
    context: "CPU Error",
    isCleared: true,
    processStatus: 1,
    processComment: "cpu lack of cores",
    acknowledgeOwner: "Sam"
  }

  fmStatusRecordList: FmStatusRecord[] = [
    {
      timestamp: "2022/07/01 20: 01: 30",
      processStatus: 1,
      processComment: "cpu lack of cores",
      acknowledgeOwner: "Edith"
    },
    {
      timestamp: "2022/07/06 20: 01: 30",
      processStatus: 0,
      processComment: "added cpu cores",
      acknowledgeOwner: "Sam"
    },
    {
      timestamp: "2022/07/02 20: 01: 30",
      processStatus: 0,
      processComment: "added cpu cores",
      acknowledgeOwner: "Sam"
    },
    {
      timestamp: "2022/07/03 20: 01: 30",
      processStatus: 1,
      processComment: "cpu lack of cores",
      acknowledgeOwner: "Edith"
    },
    {
      timestamp: "2022/07/04 20: 01: 30",
      processStatus: 0,
      processComment: "added cpu cores",
      acknowledgeOwner: "Sam"
    },
    {
      timestamp: "2022/07/05 20: 01: 30",
      processStatus: 1,
      processComment: "cpu lack of cores",
      acknowledgeOwner: "Edith"
    }
  ];
}
