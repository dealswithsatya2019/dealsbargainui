import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AddressesService } from 'src/app/services/addresses.service';
import { searchreponse } from 'src/app/models/searchResponse';
import { addressResponse } from 'src/app/models/addressResponse';
import { address } from 'src/app/models/address';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent implements OnInit {

  constructor(public _addressesService: AddressesService) { }

  subscription: Subscription;
  addresses1: address[];
  addresses: [
    {
        "address_id": "95FlHyQ8D9ocxfjBIj8gMg==",
        "fullname":"Veeru B",
"address_type":"work",
        "city": "HYD",
        "country": "IND",
        "default_addreess": "n",
        "other": "Work",
        "delivery_to": "Work",
        "mobile_number": "00000001",
        "state": "TLG",
        "status": "active",
        "street": "123",
        "zipcode": "00112233",
        "user_id": "562080",
        "created_on": "2019-11-14 23:37:15"
    },{
      "address_id": "85FlHyQ8D9ocxfjBIj8gMg==",
      "fullname":"Veerendra B",
"address_type":"home",
    "city": "HYD",
    "country": "INDIA",
    "default_addreess": "y",
    "other": "testing",
    "delivery_to": "testing",
    "mobile_number": "9988776655",
    "state": "Telangana",
    "street": "KPHB",
    "zipcode": "500083",
    "countrycode": "in",
    "created_on": "2019-12-05 23:37:15"
    }
];
  ngOnInit() {
    this.getAddressList();
  }


  getAddressList() {
    this.subscription = this._addressesService.getAddressList('us').subscribe(
      (results: addressResponse) => {
        this.addresses1 = results.responseObjects;
      },
      (error) => {
        console.log('====================================');
        console.log(error);
      }
    );
  }
}
