import { Component, OnDestroy, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { navItems } from '../../_nav';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalServiceService } from '../../services/global-service.service';
import { ToasterService } from 'angular2-toaster';
import jwtDecode from "jwt-decode";
import { environment } from '../../../environments/environment';
import {ConfirmationService} from 'primeng/api';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.css']
})
export class DefaultLayoutComponent implements OnDestroy, OnInit {
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  filterValue: String = ""
  showAdd: boolean = false
  eventTypeList: any[]
  formgroup: FormGroup
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
  showImage
  selectedImageUrl
  constructor(private router:Router,private confirmationService:ConfirmationService,private _TS: ToasterService, private _globalService: GlobalServiceService, @Inject(DOCUMENT) _document?: any) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
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
    this.formgroup = new FormGroup({

      title: new FormControl(null, Validators.required),
      description: new FormControl(null),
      image: new FormControl(""),
      eventType: new FormControl(null, Validators.required)

    })
    this.getAllData()
  }
  ngOnDestroy(): void {
    this.changes.disconnect();
  }
  showAddDialog() {
    this.showAdd = true
  }
  hideDialog() {
    this.showAdd = false
    this.formgroup.reset()
    this.editData = false
    this.selectedPost = {}
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
    this._globalService.getData('/fullEvents').subscribe((res) => {
      this.allPosts = res
      this.allpostsBeforeFilter=res
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
      this.allPosts=this.allPosts.filter((res) => {
        return (res.title.toLocaleLowerCase().match(this.globalFilter.toLocaleLowerCase()) || res.description?.toLocaleLowerCase().match(this.globalFilter.toLocaleLowerCase()));
      });
    }else{
      this.allPosts = this.allpostsBeforeFilter
      if(this.selectedValues.length != 0){
        this.filterChange()
      }
    }
  }
  filterChange(){
    this.postPagination=1
    if(this.selectedValues.length == 0) {
      this.allPosts= this.allpostsBeforeFilter
      if(this.globalFilter!=""){
        this.postFilter()
      }
    }else{
      this.allPosts= this.allpostsBeforeFilter
      if(this.globalFilter!=""){
        this.postFilter()
      }
      this.allPosts= this.allPosts.filter(el => this.selectedValues.includes(el.eventType))
    }
  }
  resetFilter(){
    this.globalFilter=""
    this.selectedValues=[]
    this.allPosts=this.allpostsBeforeFilter
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
        this._TS.pop("success","Success",'Event type added successfully')
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
  logout(){
    localStorage.removeItem("token")
    this.router.navigate(['/login'])
  }
  navigateProfile(user){    
    this.router.navigate(['/profile',user._id])
  }
  navigateToHome(){
    this.router.navigate(['/home'])
  }
  openImageDialog(item){
    this.showImage=true
    this.selectedImageUrl = item.image
  }
}
