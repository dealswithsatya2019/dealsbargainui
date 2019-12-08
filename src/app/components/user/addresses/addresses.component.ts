import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AddressesService } from 'src/app/services/addresses.service';
import { searchreponse } from 'src/app/models/searchResponse';
import { addressResponse } from 'src/app/models/addressResponse';
import { address } from 'src/app/models/address';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';
import { HttCommonService } from 'src/app/services/httpcommon.service';
import { HttpClient } from '@angular/common/http';
import { AlertService } from 'src/app/services/alert.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent implements OnInit,OnDestroy {
 
  constructor(
    public userservice: UserService,
    public _router: Router,
    public http: HttpClient,
    public httpService: HttCommonService,
    public _addressesService: AddressesService,
    public _alertService: AlertService) {
  }
  public statesArr = JSON.parse(environment.STATES);
  public isUpdateAddress: boolean;
  exp1: boolean = true;
  exp2: boolean = false;
  subscription: Subscription;
  public addressInfo: addressResponse;
  public address: address;
  subscriptions : Subscription = new Subscription();
  public selectedAddressId: string;

  addressform: FormGroup = new FormGroup({
    countrycode: new FormControl('us'),
    fullname: new FormControl('', [Validators.required]),
    mobile_number: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}')]),
    zipcode: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    street: new FormControl(''),
    address: new FormControl('', [Validators.required, Validators.maxLength(25)]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    landmark: new FormControl(''),
    altphone: new FormControl(''),
    address_type: new FormControl('', [Validators.required]),
    country: new FormControl('United States', [Validators.required]),

  });

  updateaddressform: FormGroup = new FormGroup({
    countrycode: new FormControl('us'),
    fullname: new FormControl('', [Validators.required]),
    mobile_number: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}')]),
    zipcode: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    street: new FormControl(''),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    landmark: new FormControl(''),
    altphone: new FormControl(''),
    address_id: new FormControl(''),
    country: new FormControl('United States', [Validators.required]),
    address_type: new FormControl('', [Validators.required]),
  });


  ngOnInit() {
    this.getAddresses();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  funSave() {
    let addressInfo = JSON.parse(JSON.stringify(this.addressform.value));
    console.log("addressInfo :", addressInfo);
    this.subscriptions.add(this._addressesService.saveAddress(addressInfo).subscribe(
      data => {
        let jsonobj = JSON.parse(JSON.stringify(data));
        if (jsonobj.statusCode == 200) {
          this._alertService.raiseAlert("The address "+addressInfo.fullname+"has been saved successfully.");
          this.getAddresses();
          this.exp1 = false;
          this.exp1 = false;
        } else {
          this._alertService.raiseAlert("Failed to create the address, Please send a mail.");
        }
      },
      (error) =>{
        console.log(error);
      }
    ));
  }

  public getAddresses() {
    this.subscriptions.add(this._addressesService.getAddressList().subscribe(data => {
      this.addressInfo = data;
      this.selectedAddressId = null;
      if (this.addressInfo.statusCode == 404) {
        this.exp1 = true;
        this.exp2 = false;
      } else {
        this.exp1 = false;
        this.exp2 = false;
        this.isUpdateAddress = false;
      }
    }));
  }

  public updateAddressService(addressId: string) {
    console.log("address id", addressId);
    this.updateaddressform.controls.address_id.setValue(addressId);
    let addressInfo = JSON.parse(JSON.stringify(this.updateaddressform.value));
    console.log("addressInfo update :", addressInfo);
    this.subscriptions.add(this._addressesService.updateAddress(addressInfo).subscribe(data => {
      this.addressInfo = data;
      if (this.addressInfo.statusCode == 201) {
        this.getAddresses();
        this._alertService.raiseAlert("The selected address has been updated successfully.");
      } else {
        this._alertService.raiseAlert("The selected address update has been failed. Please provide proper information");
      }
    }));
    this.isUpdateAddress = false;
    this.exp1 = false;
    this.exp2 = false;

  }

  public deleteAddressService(addressId: string) {
    this.subscriptions.add(this._addressesService.deleteAddress(addressId).subscribe(data => {
    this.exp1 = true;
    this.exp2 = false;
    this.isUpdateAddress = false;
    this.selectedAddressId = null;
      this.addressInfo = data;
      if (this.addressInfo.statusCode == 200) {
        this._alertService.raiseAlert("The selected address has been deleted successfully.");
        this.getAddresses();
      } else {
        this._alertService.raiseAlert("Failed to delete the address. Please send a mail");
      }
    }));
  }

  public cancelUpdateAddress(addressId: string){
    this.isUpdateAddress = false;
    this.exp2 = false;
  }

  public showAddressInfo(addressId) {
    this.isUpdateAddress = true;
    this.exp1 = false;
    this.exp2 = true;
    this.address = (this.addressInfo.responseObjects.filter(itemLoop => itemLoop.address_id == addressId))[0];
    this.updateaddressform.controls.fullname.setValue(this.address.fullname);
    this.updateaddressform.controls.mobile_number.setValue(this.address.mobile_number);
    this.updateaddressform.controls.altphone.setValue(this.address.altphone);
    this.updateaddressform.controls.address.setValue(this.address.address);
    this.updateaddressform.controls.city.setValue(this.address.city);
    this.updateaddressform.controls.country.setValue(this.address.country);
    this.updateaddressform.controls.state.setValue(this.address.state);
    this.updateaddressform.controls.zipcode.setValue(this.address.zipcode);
    this.updateaddressform.controls.address_type.setValue(this.address.address_type);
    this.updateaddressform.controls.landmark.setValue(this.address.landmark);
    this.updateaddressform.controls.address_id.setValue(this.address.address_id);
  }
}
