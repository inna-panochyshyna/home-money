import { combineLatest, Subscription } from "rxjs";
import { Component, OnInit, OnDestroy } from "@angular/core";

import { BillService } from "./../shared/services/bill.service";
import { CategoriesService } from "../shared/services/categories.service";
import { EventsService } from "./../shared/services/events.services";
import { Bill } from "../shared/models/bill.model";
import { Category } from "./../shared/models/category.model";
import { AppEvent } from "./../shared/models/event.model";

@Component({
  selector: "app-planning-page",
  templateUrl: "./planning-page.component.html",
  styleUrls: ["./planning-page.component.scss"],
})
export class PlanningPageComponent implements OnInit, OnDestroy {
  isLoaded = false;
  bill: Bill;
  categories: Category[] = [];
  events: AppEvent[] = [];

  sub1: Subscription;

  constructor(
    private billService: BillService,
    private categoriesService: CategoriesService,
    private eventsService: EventsService
  ) {}

  ngOnInit() {
    this.sub1 = combineLatest([
      this.billService.getBill(),
      this.categoriesService.getCategories(),
      this.eventsService.getEvents(),
    ]).subscribe((data) => {
      this.bill = data[0];
      this.categories = data[1];
      this.events = data[2];
      this.isLoaded = true;
    });
  }

  getCategoryCost(cat: Category): number {
    const catEvents = this.events.filter(
      (e) => e.category === cat.id && e.type === "outcome"
    );
    return catEvents.reduce((total, e) => {
      total += e.amount;
      return total;
    }, 0);
  }

  private getPercent(cat: Category): number {
    const percent = (100 * this.getCategoryCost(cat)) / cat.limit;
    return percent > 100 ? 100 : percent;
  }

  getCategoryPercent(cat: Category): string {
    return this.getPercent(cat) + "%";
  }

  getCategoryColor(cat: Category): string {
    const percent = this.getPercent(cat);
    return percent < 60 ? 'success' : percent >= 100 ? "danger" : "warning";
  }

  ngOnDestroy() {
    if (this.sub1) this.sub1.unsubscribe();
  }
}
