import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { GlobalServiceService } from '../../services/global-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  formGroup : FormGroup
  passwordForm : FormGroup
  displayForgottenPassword:boolean

  constructor(private toasterService: ToasterService, private _globalService: GlobalServiceService, private router:Router) { }

  ngOnInit(): void {
    // this.showSuccess();
    this.formGroup= new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    })
    this.passwordForm= new FormGroup({
      email: new FormControl(null,Validators.required)
    })
  }

  login(){
    if(this.formGroup.valid){
      this._globalService.postData('/login',this.formGroup.value).subscribe(res=>{
        localStorage.setItem('token',JSON.stringify(res.token))
        this.toasterService.pop('success', 'Logged In', "you've logged in successfully");
        this.router.navigate(['/home']);  
      },err=>{
        console.log(err);
        this.toasterService.pop('error', 'Error', err.error.message);
      })
    }else{      
      this.toasterService.pop("warning","Warning","Please enter your email and password")
    }
  }
  registerPage(){
    this.router.navigate(['/register'])
  }
  forgottenPassword(){
    if(this.passwordForm.valid){
      this._globalService.postData('/forgottenPassword',this.passwordForm.value).subscribe(res=>{
        this.toasterService.pop('success', 'Success', "Email sent successfully");
        this.hideDialog()
      },err=>{
        console.log(err);
        this.toasterService.pop('error', 'Error', err.error.message);
      })
    }else{
      this.toasterService.pop("warning","Warning","Please enter your email")
    }
  }
  showForgottenPassword(){
    this.displayForgottenPassword=true    
  }
  hideDialog(){
    this.displayForgottenPassword=false
    this.passwordForm.reset()
  }
 }
