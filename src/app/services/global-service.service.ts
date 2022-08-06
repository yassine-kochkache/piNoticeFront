import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class GlobalServiceService {
  baseUrl = environment.baseUrl

  constructor(private http:HttpClient) { }

  getData(url):Observable<any>{
    return this.http.get<any>(this.baseUrl+url);
  }
  postData(url,data):Observable<any>{
    return this.http.post(this.baseUrl+url,data);
  }
  putData(url,data):Observable<any>{
    return this.http.put(this.baseUrl+url,data);
  }
  deleteData(url):Observable<any>{
    return this.http.delete(this.baseUrl+url);
  }

}
