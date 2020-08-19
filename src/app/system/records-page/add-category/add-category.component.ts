import { Category } from "./../../shared/models/category.model";
import { Component, Output, EventEmitter, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";

import { CategoriesService } from "./../../shared/services/categories.service";
import { Subscription } from 'rxjs';

@Component({
  selector: "app-add-category",
  templateUrl: "./add-category.component.html",
  styleUrls: ["./add-category.component.scss"],
})
export class AddCategoryComponent implements OnDestroy {
  @Output() onCategoryAdd = new EventEmitter<Category>();

  sub1: Subscription;

  constructor(private categoriesService: CategoriesService) {}

  submitForm(form: NgForm) {
    let { name, limit } = form.value;
    if (limit < 0) limit *= -1;
    const category = new Category(name, limit);
    this.sub1 = this.categoriesService
      .addCategory(category)
      .subscribe((category: Category) => {
        form.reset();
        this.onCategoryAdd.emit(category);
      });
  }

  ngOnDestroy() {
    if (this.sub1) this.sub1.unsubscribe();
  }
}
