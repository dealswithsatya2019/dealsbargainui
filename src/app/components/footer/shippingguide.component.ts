import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-shippingguide',
  templateUrl: './shippingguide.component.html',
  styleUrls: ['./shippingguide.component.scss']
})
export class ShippingguideComponent implements OnInit {

  subscriptions = new Subscription();
  private APIEndpoint: string = environment.APIEndpoint;
  constructor(public http: HttpClient,private cartService: CartService){

  }
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

  saveContact: FormGroup = new FormGroup({
    filename: new FormControl(null),
    contact: new FormControl(""),
    subject: new FormControl(""),
    ordernumber: new FormControl(""),
    description: new FormControl(""),
    content: new FormControl(""),
    countryCode : new FormControl("us")
  });

  content: any;
  fileSelect(event) {
    this.content = event.target.files[0];
    this.fileToBase64(event, (result: any, headers: any) => {
      this.content = result;
      console.log("file ",this.content);
    });
  }

  public fileToBase64(event, callback) {
    let url: any;
    let header: any;
    if (event.target.files && event.target.files[0]) {
      const srcFile = event.target.files[0];
      const reader = new FileReader();
      const textReader = new FileReader();
      reader.readAsDataURL(srcFile); // read file as data url
      reader.onload = (event: any) => { // called once readAsDataURL is completed
        url = (<FileReader>event.target).result;
        const index = url.indexOf(',') + 1;
        url = url.slice(index);
        if (typeof callback === 'function') {
        }
      };
      textReader.onload = function (e) {
        header = textReader.result;
        header = header.split('\n');
        header = header[0].split('|');
        callback(url, header);
      };
      textReader.readAsText(srcFile);
    }
  }

  funSave() {
    this.saveContact.controls.content.setValue(this.content);
    let contactReqInfo = JSON.parse(JSON.stringify(this.saveContact.value));
    console.log("form dataa ",contactReqInfo);
    this.saveContactusReq(contactReqInfo);
  }

  public saveContactusReq(contactReqInfo: string) {
    this.subscriptions.add(this.http.post(this.APIEndpoint + "/contactus", contactReqInfo,
      { headers: { 'Content-Type': 'application/json'} }).subscribe(data => {
        let jsonobj = JSON.parse(JSON.stringify(data));
        if (jsonobj.statusCode == 200) {
          this.cartService.raiseAlert("The request has been raised successfully.");
        } else {
          this.cartService.raiseAlert("Failed to creat the request, Please send a mail.");
        }
      }));
  }    

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


}
