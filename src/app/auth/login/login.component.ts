import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { AuthService } from "./../../shared/services/auth.service";
import { Message } from "./../../shared/models/message.model";
import { User } from "./../../shared/models/user.model";
import { UsersService } from "./../../shared/services/users.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  message: Message;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.message = new Message("danger", "");
    this.route.queryParams.subscribe((params: Params) => {
      if (params["canLogin"]) {
        this.showMessage("Now you can login", "success");
      } else if (params["accessDenied"]) {
        this.showMessage(
          "To work with the system you need to login",
          "warning"
        );
      }
    });
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  private showMessage(text: string, type: string = "danger") {
    this.message = new Message(type, text);
    window.setTimeout(() => {
      this.message.text = "";
    }, 7000);
  }

  onSubmit() {
    const formData = this.form.value;
    this.usersService.getUserByEmail(formData.email).subscribe((user: User) => {
      if (user) {
        if (user.password === formData.password) {
          this.message.text = "";
          localStorage.setItem("user", JSON.stringify(user));
          this.authService.login();
          this.router.navigate(["/system", "bill"]);
        } else {
          this.showMessage("Wrong password");
        }
      } else {
        this.showMessage("This user does not exist!");
      }
    });
    this.form.reset();
  }
}
