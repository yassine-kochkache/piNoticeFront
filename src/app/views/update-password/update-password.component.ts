import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { GlobalServiceService } from '../../services/global-service.service';
import jwtDecode from 'jwt-decode';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {

 
  resetForm: FormGroup;
  connecteduser
  decodedToken
  // passwordRegex = "^(?=.*[0-9])(?=.*[a-zA-Z])[^]*([a-zA-Z0-9]+[^]*)$";
  token: any;
  baseUrl =environment.baseUrl
  constructor(
    private activatedRoute: ActivatedRoute,
    private _globalService: GlobalServiceService,
    private toaster: ToasterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.decodedToken = jwtDecode<any>(
      JSON.parse(localStorage.getItem("token"))
    );
    this._globalService.getData('/users/'+this.decodedToken.userId).subscribe(res=>{
      this.connecteduser=res
      console.log(this.connecteduser);
      
      },err=>{
        console.log(err);
        
      })
    this.resetForm = new FormGroup(
      {
        oldPassword : new FormControl(null,Validators.required),
        newPassword: new FormControl("", [
          Validators.required,
          Validators.minLength(4),
        ]),
        confirmPassword: new FormControl("", Validators.required),
      },
      { validators: [this.checkPasswords] }
    );
  }
  checkPasswords: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    let pass = group.get("newPassword").value;
    let confirmPass = group.get("confirmPassword").value;
    return pass === confirmPass ? null : { notSame: true };
  };
  submitForm(form) {
    console.log(form);
    
    if (form.status === "VALID") {
      this._globalService.putData('/users/reset-password/'+this.connecteduser._id,form.value).subscribe(
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
          this.router.navigate(["/home"]);
        }
      );
    } else {
      this.toaster.pop("warning", "Warning", "Ivalid password!");
    }
  }
  logout(){
    localStorage.removeItem("token")
    this.router.navigate(['/login'])
  }
  navigateProfile(){    
    this.router.navigate(['/profile',this.decodedToken.userId])
  }
}
