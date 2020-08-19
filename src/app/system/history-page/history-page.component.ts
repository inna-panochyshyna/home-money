import { Component, OnInit } from "@angular/core";
import { Subscription, combineLatest } from "rxjs";
import { mergeMap } from "rxjs/operators";

import { Category } from "./../shared/models/category.model";
import { AppEvent } from "../shared/models/event.model";
import { Bill } from "../shared/models/bill.model";
import { EventsService } from "./../shared/services/events.services";
import { CategoriesService } from "./../shared/services/categories.service";
import { BillService } from "./../shared/services/bill.service";

@Component({
  selector: "app-history-page",
  templateUrl: "./history-page.component.html",
  styleUrls: ["./history-page.component.scss"],
})
export class HistoryPageComponent implements OnInit {
  isLoaded = false;
  categories: Category[] = [];
  events: AppEvent[] = [];
  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  confirmMessage =
    "Are sure you want to delete this item ? This will change your account";

  constructor(
    private categoryService: CategoriesService,
    private eventsService: EventsService,
    private billService: BillService
  ) {}

  ngOnInit() {
    this.sub1 = combineLatest(
      this.categoryService.getCategories(),
      this.eventsService.getEvents()
    ).subscribe((data: [Category[], AppEvent[]]) => {
      this.categories = [...data[0]];
      this.events = [...data[1]];
      this.events.forEach((e: AppEvent) => {
        e.catName = this.categories.find(
          (c: Category) => c.id === e.category
        ).name;
      });
      this.isLoaded = true;
    });
  }

  onDeleteEvent(e: AppEvent, index: number) {
    if (window.confirm(this.confirmMessage)) {
      this.sub2 = this.billService.getBill().subscribe((bill: Bill) => {
        let value = 0;
        if (e.type === "outcome") {
          value = bill.value + e.amount;
        } else {
          value = bill.value - e.amount;
        }
        this.sub3 = this.billService
          .updateBill({ value, currency: bill.currency })
          .pipe(mergeMap(() => this.eventsService.deleteEvents(e.id)))
          .subscribe(() => {
            this.events.splice(index, 1);
          });
      });
    }
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
    if (this.sub2) this.sub2.unsubscribe();
  }
}
