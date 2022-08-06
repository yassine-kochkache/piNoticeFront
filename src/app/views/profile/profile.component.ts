import { Component, OnInit } from '@angular/core';
import { GlobalServiceService } from '../../services/global-service.service';
import jwtDecode from "jwt-decode";
import { environment } from '../../../environments/environment';
import {  Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ToasterService } from 'angular2-toaster';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  filterValue: String = ""
  showAdd: boolean = false
  eventTypeList: any[]
  formgroup: FormGroup
  userForm :FormGroup
  decodedToken: any
  allPosts: any[]
  baseUrl = environment.baseUrl
  editData: boolean = false
  selectedPost: any ={}
  postPerPage= 5
  postPagination = 1
  allpostsBeforeFilter:any[]
  selectedValues: string[] = [];
  allEventTypes : any[]
  globalFilter : String ="";
  showEventTypeDialog:boolean = false
  eventTypeTitle=""
  connecteduser
  profileUser
  paramId
  showUpdateProfile
  showUpdateImage
  profileImage
  showImage
  selectedImageUrl
  constructor(private _datePipe: DatePipe, private router:Router,private confirmationService:ConfirmationService,private _TS: ToasterService, private _globalService: GlobalServiceService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  ngOnInit(): void {
    this.paramId = this.router.url.split('/').pop()    
    this.decodedToken = jwtDecode<any>(
      JSON.parse(localStorage.getItem("token"))
    );

    this._globalService.getData('/users/'+this.decodedToken.userId).subscribe(res=>{
      this.connecteduser=res      
      },err=>{
        console.log(err);
        
      })
    this.formgroup = new FormGroup({
      title: new FormControl(null, Validators.required),
      description: new FormControl(null),
      image: new FormControl(""),
      eventType: new FormControl(null, Validators.required)
    })

    this.userForm = new FormGroup({
      firstName : new FormControl(null,Validators.required),
      lastName : new FormControl(null,Validators.required),
      email : new FormControl(null,[Validators.required,Validators.email]),
      birthDate : new FormControl(null,Validators.required),
      phone : new FormControl(null,Validators.required),
      address : new FormControl(null)
    })
    this.getAllData()
  }
  logout(){
    localStorage.removeItem("token")
    this.router.navigate(['/login'])
  }
  openAddEventTypeDialog(){
    this.showEventTypeDialog=true
  }
  addNewPostType(){
    if(this.eventTypeTitle!=""){
      const data ={
        title:this.eventTypeTitle
      }
      this._globalService.postData('/eventType', data).subscribe((res)=>{
        this._TS.pop("success","Success",'Post type added successfully')
        this._globalService.getData('/eventType').subscribe(res=>{
          this.eventTypeList=res
          this.hideEventTypeDialog()
        })
      })
    }else{
      this._TS.pop("warning","Warning","Please enter your post type title")
    }
  }
  hideEventTypeDialog(){
    this.eventTypeTitle=""
    this.showEventTypeDialog=false
  }
  showAddDialog() {
    this.showAdd = true
  }
  hideDialog() {
    this.showAdd = false
    this.formgroup.reset()
    this.editData = false
    this.selectedPost = {}
    this.showUpdateProfile=false
    this.showUpdateImage=false
    this.showImage=false
    this.selectedImageUrl=""
  }
  submitData() {
    if (this.formgroup.valid) {
      let dataToSubmit = this.formgroup.value
      let formData = new FormData();
      if (this.editData == true) {
          formData.append(
            "title",
            this.formgroup.value.title
          )
          formData.append(
            "description",
            this.formgroup.value.description
          )
          formData.append(
            "eventType",
            this.formgroup.value.eventType
          )
          formData.append(
            "image",
            this.formgroup.value.image
          )
        if (this.formgroup.value.image != "" && this.formgroup.value.image !=null) {          
          this._globalService.putData(`/events/image/${this.selectedPost._id}`, formData).subscribe(res => { 
            this._globalService.putData(`/events/${this.selectedPost._id}`, dataToSubmit).subscribe(res => {
              this._TS.pop('success', 'Success', 'Post added successfully')
              this.getAllData();
              this.hideDialog()
            }, err => {
              console.log(err);
              this._TS.pop('error', 'Error', err.error?.message)
    
            })
          }, err => {
          })
        }else{
          this._globalService.putData(`/events/${this.selectedPost._id}`, dataToSubmit).subscribe(res => {
            this._TS.pop('success', 'Success', 'Post added successfully')
            this.getAllData();
            this.hideDialog()
          }, err => {
            console.log(err);
            this._TS.pop('error', 'Error', err.error?.message)
  
          })
        }

      } else {
        if (this.formgroup.value.image == "") {
          dataToSubmit = this.formgroup.value
        } else {
          let formData = new FormData();
          formData.append(
            "title",
            this.formgroup.value.title
          )
          formData.append(
            "description",
            this.formgroup.value.description
          )
          formData.append(
            "eventType",
            this.formgroup.value.eventType
          )
          formData.append(
            "image",
            this.formgroup.value.image
          )
          dataToSubmit = formData
        }
        this._globalService.postData(`/events/${this.decodedToken.userId}`, dataToSubmit).subscribe(res => {
          this._TS.pop('success', 'Success', 'Post added successfully')
          this.getAllData();
          this.hideDialog()
        }, err => {
          console.log(err);
          this._TS.pop('error', 'Error', err.error?.message)

        })
      }

    } else {
      this._TS.pop('warning', 'Warning', 'Please fill the title and event type')
    }

  }
  getAllData() {
    this._globalService.getData('/users/'+this.paramId).subscribe((res) => {
      this.profileUser=res
      this.allpostsBeforeFilter= this.profileUser.events
    }, err => {
      console.log(err);

    })
    this._globalService.getData('/eventType').subscribe(res=>{
      this.eventTypeList=res      
    })
  }
  selectFile(event) {
    this.formgroup.patchValue({
      image: event.currentFiles[0]
    })
  }
  clearFile(event) {
    this.formgroup.patchValue({
      image: ""
    })
  }
  openEdit(post) {
    this.editData = true
    this.selectedPost = { ...post }
    this.showAdd = true

  }
  deletePost(post) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this post?',
      accept: () => {
        this._globalService.deleteData(`/events/${post._id}/${this.decodedToken.userId}`).subscribe((res)=>{
          this._TS.pop("success","Success","Post deleted successfully")
          this.getAllData()
        },err=>{
          console.log(err);
          
        })  
      }
  });
  }
  downloadFile(filename) {
    const filePath = `${this.baseUrl}/event-pics/${filename}`
    window.open(filePath);
  }
  pageChangedDonnation(event:any){
    this.postPagination = event
  }
    postFilter(){
    this.postPagination=1
    if(this.globalFilter!=""){
      this.connecteduser.events=this.connecteduser.events.filter((res) => {
        return (res.title.toLocaleLowerCase().match(this.globalFilter.toLocaleLowerCase()) || res.description?.toLocaleLowerCase().match(this.globalFilter.toLocaleLowerCase()));
      });
    }else{
      this.connecteduser.events = this.allpostsBeforeFilter
      if(this.selectedValues.length != 0){
        this.filterChange()
      }
    }
  }
  filterChange(){
    this.postPagination=1
    if(this.selectedValues.length == 0) {
      this.profileUser.events= this.allpostsBeforeFilter
      if(this.globalFilter!=""){
        this.postFilter()
      }
    }else{
      this.profileUser.events= this.allpostsBeforeFilter
      if(this.globalFilter!=""){
        this.postFilter()
      }
      this.profileUser.events= this.profileUser.events.filter(el => this.selectedValues.includes(el.eventType))
    }
  }
  resetFilter(){
    this.globalFilter=""
    this.selectedValues=[]
    this.profileUser.events=this.allpostsBeforeFilter
  }
  navigateProfile(){    
    this.router.navigate(['/profile',this.decodedToken.userId])
  }
  showUpdateProfileFunc(){
    this.showUpdateProfile =true
    this.connecteduser.birthDate = this._datePipe.transform(this.connecteduser.birthDate,'dd/MM/yyy')
    this.userForm.patchValue(this.connecteduser)    
  }
  updateProfile(){    
    if(this.userForm.valid){
      this._globalService.putData('/users/'+this.connecteduser._id,this.userForm.value).subscribe(res=>{
        this._TS.pop('success','Success','Profile info updated successfully')
        this._globalService.getData('/users/'+this.decodedToken.userId).subscribe(res=>{
          this.connecteduser=res      
          },err=>{
            console.log(err);
          })        
        this.hideDialog()
      })
    }else{
      this._TS.pop('warning',"Warning","Please check your inputs")
    }
  }
  openUpdateImageDial(){
    this.showUpdateImage=true
  }
  seletProfileImage(event) {
      this.profileImage = event.currentFiles[0]
  }
  clearProfileImage(event) {
    this.profileImage =""
  }
  updateProfileImage(){
    if(this.profileImage!=""&& this.profileImage){
      let formData = new FormData()
      formData.append('avatar',this.profileImage)
      this._globalService.putData('/users-avatar/'+this.connecteduser._id,formData).subscribe((res)=>{
        this._globalService.getData('/users/'+this.decodedToken.userId).subscribe(res=>{
          this.connecteduser=res      
          },err=>{
            console.log(err);
          })    
          this.getAllData()
          this.hideDialog()
          this._TS.pop('success','Success','User image updated successfully')
      },err=>{
        console.log(err);
        
      })
    }else{
      this._TS.pop('warning',"Warning","Please select and imgage")
    }
  }
  openImageDialog(item){
    this.showImage=true
    this.selectedImageUrl = item.image
  }
}
