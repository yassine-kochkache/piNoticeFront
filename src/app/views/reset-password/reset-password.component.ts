import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { GlobalServiceService } from '../../services/global-service.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetForm: FormGroup;
  // passwordRegex = "^(?=.*[0-9])(?=.*[a-zA-Z])[^]*([a-zA-Z0-9]+[^]*)$";
  token: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _globalService: GlobalServiceService,
    private toaster: ToasterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resetForm = new FormGroup(
      {
        password: new FormControl("", [
          Validators.required,
          // Validators.pattern(this.passwordRegex),
          Validators.minLength(4),
        ]),
        confirmPassword: new FormControl("", Validators.required),
        token: new FormControl(this.activatedRoute.snapshot.params.token),
      },
      { validators: [this.checkPasswords] }
    );
  }
  checkPasswords: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    let pass = group.get("password").value;
    let confirmPass = group.get("confirmPassword").value;
    return pass === confirmPass ? null : { notSame: true };
  };
  submitForm(form) {
    console.log(form);
    
    if (form.status === "VALID") {
      this._globalService.postData('/resetPassword',form.value).subscribe(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.log(err);
          this.toaster.pop("error", "Error", err.status);
        },
        () => {
          this.toaster.pop(
            "success",
            "Success",
            "Password updated successfully"
          );
          this.router.navigate(["/login"]);
        }
      );
    } else {
      this.toaster.pop("error", "Error", "Ivalid password!");
    }
  }
}
