import { NgForm } from "@angular/forms";
import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { DatePipe } from "@angular/common";
import { mergeMap } from "rxjs/operators";
import { Subscription } from "rxjs";

import { Category } from "../../shared/models/category.model";
import { AppEvent } from "../../shared/models/event.model";
import { EventsService } from "./../../shared/services/events.services";
import { Bill } from "../../shared/models/bill.model";
import { Message } from "src/app/shared/models/message.model";
import { BillService } from "./../../shared/services/bill.service";

@Component({
  selector: "app-add-event",
  templateUrl: "./add-event.component.html",
  styleUrls: ["./add-event.component.scss"],
})
export class AddEventComponent implements OnInit, OnDestroy {
  @Input() categories: Category[] = [];

  sub1: Subscription;
  sub2: Subscription;
  types = [
    { type: "income", label: "Income" },
    { type: "outcome", label: "Outcome" },
  ];
  message: Message;

  constructor(
    private datePipe: DatePipe,
    private eventsService: EventsService,
    private billService: BillService
  ) {}

  ngOnInit() {
    this.message = new Message("danger", "");
  }

  private showMessage(text: string) {
    this.message.text = text;
    window.setTimeout(() => {
      this.message.text = "";
    }, 7000);
  }

  submitForm(form: NgForm) {
    let { amount, description, category, type } = form.value;
    let date = this.datePipe.transform(new Date(), "dd.MM.yyyy HH:mm:ss");
    if (amount < 0) amount *= -1;
    const event = new AppEvent(type, amount, +category, date, description);
    this.sub1 = this.billService.getBill().subscribe((bill: Bill) => {
      let value = 0;
      if (type === "outcome") {
        if (amount > bill.value) {
          this.showMessage(
            `There is not enough money in the account. You are missing ${-(
              amount - bill.value
            )} UAH`
          );
          return;
        } else {
          value = bill.value - amount;
        }
      } else {
        value = bill.value + amount;
      }
      this.sub2 = this.billService
        .updateBill({ value, currency: bill.currency })
        .pipe(mergeMap(() => this.eventsService.addEvent(event)))
        .subscribe(() => {
          form.setValue({
            type: "outcome",
            amount: 1,
            category: 1,
            description: " ",
          });
        });
    });
  }

  ngOnDestroy() {
    if (this.sub1) this.sub1.unsubscribe();
    if (this.sub2) this.sub2.unsubscribe();
  }
}
