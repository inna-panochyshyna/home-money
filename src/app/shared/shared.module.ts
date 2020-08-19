import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  imports: [ReactiveFormsModule, FormsModule],
  exports: [ReactiveFormsModule, FormsModule, LoaderComponent],
  declarations: [LoaderComponent],
})
export class SharedModule {}
