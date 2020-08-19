import { Component, OnInit, OnDestroy } from "@angular/core";
import { combineLatest, Subscription } from "rxjs";
import { DatePipe } from "@angular/common";

import { BillService } from "./../shared/services/bill.service";
import { Bill } from "./../shared/models/bill.model";

@Component({
  selector: "app-bill-page",
  templateUrl: "./bill-page.component.html",
  styleUrls: ["./bill-page.component.scss"],
})
export class BillPageComponent implements OnInit, OnDestroy {
  sub1: Subscription;
  sub2: Subscription;

  date: any;
  currency: any;
  bill: Bill;

  isLoaded = false;

  constructor(private billService: BillService, private datePipe: DatePipe) {}

  ngOnInit() {
    this.date = new Date();
    this.date = this.datePipe.transform(this.date, "yyyyMMdd");
    this.sub1 = combineLatest([
      this.billService.getBill(),
      this.billService.getCurrency(this.date),
    ]).subscribe((data: [Bill, any]) => {
      this.bill = data[0];
      this.currency = data[1];
      this.isLoaded = true;
    });
  }

  onRefresh() {
    this.isLoaded = false;
    this.sub2 = this.billService
      .getCurrency(this.date)
      .subscribe((currency: any) => {
        this.currency = currency;
        this.isLoaded = true;
      });
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
  }
}
