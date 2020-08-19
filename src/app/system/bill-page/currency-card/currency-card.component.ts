import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-currency-card",
  templateUrl: "./currency-card.component.html",
  styleUrls: ["./currency-card.component.scss"],
})
export class CurrencyCardComponent implements OnInit {
  @Input() currency: any;

  rateEuro: number;
  rateDollar: number;

  constructor() {}

  ngOnInit() {
    this.rateEuro = this.getCurrencyRate("EUR");
    this.rateDollar = this.getCurrencyRate("USD");
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
