import { Subscription } from "rxjs";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { NgForm } from "@angular/forms";

import { Category } from "../../shared/models/category.model";
import { CategoriesService } from "../../shared/services/categories.service";
import { Message } from "./../../../shared/models/message.model";

@Component({
  selector: "app-edit-category",
  templateUrl: "./edit-category.component.html",
  styleUrls: ["./edit-category.component.scss"],
})
export class EditCategoryComponent implements OnInit, OnDestroy {
  @Input() categories: Category[] = [];
  @Output() onCategoryEdit = new EventEmitter<Category>();

  currentCategoryId = 1;
  currentCategory: Category;
  message: Message;
  sub1: Subscription;

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit() {
    this.message = new Message("success", "");
    this.onCategoryChange();
  }

  onCategoryChange() {
    this.currentCategory = this.categories.find(
      (c) => c.id === +this.currentCategoryId
    );
  }

  submitForm(form: NgForm) {
    let { name, limit } = form.value;
    if (limit < 0) limit *= -1;
    const category = new Category(name, limit, +this.currentCategoryId);
    this.sub1 = this.categoriesService
      .updateCategory(category)
      .subscribe((category: Category) => {
        this.onCategoryEdit.emit(category);
        this.message.text = "Category was edited successfully";
        window.setTimeout(() => {
          this.message.text = "";
        }, 7000);
      });
  }

  ngOnDestroy() {
    if (this.sub1) this.sub1.unsubscribe();
  }
}
