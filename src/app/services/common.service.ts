import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { MUser } from '../models/MUser';
import { map } from 'rxjs/operators';
import { environment, ExportExcelLogoCellMerge } from '../../environments/environment';
import { Common } from '../shared/common';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DatePipe } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class CommonService {
    
    private http = inject(HttpClient);
    private authenticationService = inject(AuthenticationService);
    private datePipe = inject(DatePipe);

    constructor() {  }
    public ExportExcelLogoCellMerge: string = `${ExportExcelLogoCellMerge}`;
    
    cms: string = environment.CMSUrl + '/api/';
    private user = this.authenticationService.currentUserValue as MUser;
    public getUserName(){
        if (this.user != null) {
          return this.user.UserName;
        }
        return "";
      }
    public GetStandardDateFormat() {
        if (this.user != null) {
            return this.user.standardDateFormat;
        }
        return "dd-MM-yyyy HH:mm:ss";
    }
    public GetStandardDateOnlyFormat() {
      if (this.user != null) {
        //return this.user.standardDateOnlyFormat;
      }
      return "dd-MM-yyyy";
    }
    public GetUserName() {

        if (this.user != null) {
            return this.user.UserName;
        }
        return "";
    }

    public GetClientLogoUrl() {
      debugger
      var user = this.authenticationService.currentUserValue as MUser;
      //return this.http.get<any>(`${environment.CMSUrl}/Shared/GetClientLogo?userid=` + user.userId)
      return this.http.get<any>(`${environment.CMSUrl}/api/Common/GetClientLogo?clientid`)
        .pipe(map(value => {
          return value;
        }));
    }
    public GetUserId() {
        if (this.user != null) {
            return this.user.UserID;
        }
        return 0;
    }
    CheckNullOrUndefined(value: string | null) {
        return typeof value === "undefined" || value == '' || value == null
      }
    public DisclaimerString: string = 'Disclaimer : This is system generated report or content. It does not required any signature. This report is totally dependent on data inserted or executed from To the source Application.';
  
    public ExporttoExcelWithImage(headerdata: any[], gridheader: any[], griddata: any) {

        debugger
        headerdata[2].field=this.datePipe.transform(new Date(), this.GetStandardDateFormat());
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet(headerdata[1].field);
        let titleRow = worksheet.addRow(headerdata[1].field);
        titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
    
        // Blank Row
        worksheet.addRow([]);
    
        //Additional Header If Required
    
        //Add Header data

        if (!this.CheckNullOrUndefined(headerdata[0].field)) {
          let logo = workbook.addImage({
            base64:headerdata[0].field,
            //  (headerdata[0].field).replace("data:image/png;base64,",""),
            extension: 'png',
          });
          // worksheet.addImage(logo, { tl: { col: 8.1, row: 5 }, ext: { width: 140,height: 90 }});
          worksheet.addImage(logo, 'A1:C3');
          
        }
        
    
        worksheet.addRow('');
    
        for (let i = 1; i < headerdata.length; i++)
          worksheet.addRow([headerdata[i].title + headerdata[i].field]);
    
        var lastRow = worksheet.addRow('');
        //Grid Header
        
        var arrHead: any[] = [];
        gridheader.filter(function (elements) {
          arrHead.push(elements.title == undefined ? "" : elements.title);
        });
        var datarow = Object.keys(arrHead).map(it => arrHead[0][it + 1]);
        let row = worksheet.addRow(datarow);
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'BFBFBF' }
        }
        // var data2 = [];
        var data: any[][] = [];
        console.log(griddata, gridheader)
        if(griddata != "undefined" && griddata.length > 0){
          griddata.forEach((item: { [x: string]: any; }) => {
            let row: any[]  = [];
            gridheader.forEach(header =>  {
                if(item[header.field]){
                  row[header.field] = item[header.field]
                } else {
                  row[header.field] = ""
                }
               row.push(row[header.field] )
            });
            worksheet.addRow(row);
            data.push(row);
          });
          console.log(data);
        }
      //   if(griddata != "undefined" && griddata.hasOwnProperty("data") && griddata.data != "undefined"  && griddata.data.total > 0){
      //       alert(2)
      //       griddata.data.data.forEach(d => {
      //         console.log(d)
      //         var displaydatarow = [];
      //         console.log('gridheader', gridheader)
      //         console.log('d', d)
      //         alert(3)
      //         gridheader.filter(function (element1) {
      //           alert(4)
      //           console.log(element1)
      //           console.log(d[element1.field])
      //           displaydatarow.push(d[element1.field]);
      //         });
      //         console.log(displaydatarow)
      //         worksheet.addRow(displaydatarow);
      //         data.push(displaydatarow)
      //   });
        
      // }
    
      var DisclaimerRow = worksheet.addRow('');
      var DisclaimerRowNo = DisclaimerRow.number + 1;
      worksheet.mergeCells("A" + DisclaimerRowNo + ":" + "J" + DisclaimerRowNo);
      worksheet.getCell("A" + DisclaimerRowNo).value = this.DisclaimerString;
      worksheet.getRow(DisclaimerRowNo).font = {
        name: 'Calibri',
        size: 11,
        bold: true
      };
    
        workbook.xlsx.writeBuffer().then((data: BlobPart) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, headerdata[1].field + `.xlsx`);
          
        });
        
      }
    public getHeaders(gridlistid: { columnList: { columns: { _results: string | any[]; }; }; }){
        var headers=[];
        for(let i=0;i<gridlistid.columnList.columns._results.length;i++)
        {
          var _col =gridlistid.columnList.columns._results[i];
          if(_col.field != undefined && _col.title != undefined && _col.title !="Action" && (_col.hidden == undefined || _col.hidden == false))
          {
            if(_col.title!="Select All")
            {
              if(gridlistid.columnList.columns._results[i].template == undefined){
                //headers.push({ "title": _col.title, "field": _col.field,"width" : _col.width });
                headers.push({ "title": _col.title, "field": _col.field });
              }
              else {
                //headers.push({ "title":_col.title, "field": "str" + _col.field,"width" : _col.width});
                headers.push({ "title": _col.title, "field": _col.field });
              }
          }
          }
          else if(_col.title=="Sr. No" && (_col.hidden == undefined || _col.hidden == false)){
            headers.push({ "title": _col.title, "field": "srno" });
          }
    
        }
        return headers;
      }
      public getGridFilter(operator: string,searchvalue: any,headers: any[]){
        operator= operator=="" ? "contains" : operator;
        var gridfilter: { field: any; operator: string; value: any; }[]= [];
        headers.filter(function (columndetails) {
          gridfilter.push({field:columndetails.field,operator:operator,value:searchvalue});
        });
        return gridfilter;
      }
      public containsItem(chkKey: any[], item: any): boolean {
        return chkKey.indexOf(item['organizationstructureid']) > -1;
      }
  
      public isIndeterminate(chkKey: any[], items: any[] = []): boolean {
        let idx = 0;
        let item;
  
        while (item = items[idx]) { 
          if (this.isIndeterminate(item.items) || this.containsItem(chkKey, item)) { return true; }
          idx += 1;
        }
        return false;
      }
}
