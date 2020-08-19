import { Bill } from "./../../shared/models/bill.model";
import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-bill-card",
  templateUrl: "./bill-card.component.html",
  styleUrls: ["./bill-card.component.scss"],
})
export class BillCardComponent implements OnInit {
  @Input() bill: Bill;
  @Input() currency: any;

  euro: number;
  dollar: number;

  constructor() {}

  ngOnInit() {
    this.euro = this.bill.value / this.getCurrencyRate("EUR");
    this.dollar = this.bill.value / this.getCurrencyRate("USD");
  }

  getCurrencyRate(currency: string): number {
    let rate = 0;
    this.currency.forEach((item: any) => {
      if (item.cc === currency) {
        rate = item.rate;
      }
    });
    return rate;
  }
}
