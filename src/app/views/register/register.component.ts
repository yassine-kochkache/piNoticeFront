import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { GlobalServiceService } from '../../services/global-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
  formGroup : FormGroup
  passwordConfirmation :String
  myFiles:any[]
  constructor(private _globalService:GlobalServiceService, private _datePipe:DatePipe, private router: Router,private toasterService: ToasterService) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup ({
      firstName:new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required ,Validators.email]),
      password: new FormControl(null, Validators.required),
      birthDate: new FormControl(null, Validators.required),
      phone: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      avatar: new FormControl(null, Validators.required),
    })
  }
  register(){
    if(this.formGroup.valid && this.formGroup.value.password == this.passwordConfirmation){
      const dob = this._datePipe.transform(this.formGroup.value.birthDate,"MM.dd.yyyy")
      let formData = new FormData();
      formData.append(
        "firstName",
        this.formGroup.value.firstName.trim().toLowerCase()
      );
      formData.append(
        "lastName",
        this.formGroup.value.lastName.trim().toLowerCase()
      );
      formData.append("email", this.formGroup.value.email.trim().toLowerCase());
      formData.append("password", this.formGroup.value.password);
      formData.append("birthDate", dob);
      formData.append("phone", this.formGroup.value.phone);
      formData.append("address", this.formGroup.value.address.trim());
      formData.append("avatar", this.formGroup.value.avatar);

      this._globalService.postData('/register',formData).subscribe((res)=>{
        console.log(res);
        this.toasterService.pop("success","Success","You've registred successfully")
        this.router.navigate(['/login'])

        
      },err=>{
        this.toasterService.pop("error","Error",err.error.message)
        console.log(err);
        
      })
    }else{
      this.toasterService.pop("warning","Warning","Please fill all your informations")
    }
  }
  chooseFile(element){
    element.click()
  }
  selectFile(event){
    this.myFiles =[]
    if(event.files.length!=0){
      document.getElementById('chooseBtn').innerHTML="<span class='pi pi-check'></span>" + event.files[0].name;      
      this.formGroup.patchValue({
        avatar: event.files[0]
      })
    }
    console.log(this.formGroup.value);
    
  }
}
