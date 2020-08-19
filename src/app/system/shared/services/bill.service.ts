import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Bill } from "./../models/bill.model";
import { BaseApi } from "./../../../shared/core/base-api";

@Injectable()
export class BillService extends BaseApi {
  constructor(public http: HttpClient) {
    super(http);
  }

  getBill(): Observable<Bill> {
    return this.get("bill");
  }

  getCurrency(date: string): Observable<any> {
    return this.http.get(
      `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${date}&json`
    );
  }

  updateBill(bill: Bill): Observable<Bill> {
    return this.put("bill", bill);
  }
}
