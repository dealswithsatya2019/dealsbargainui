import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialshareComponent } from '../socialshare/socialshare.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { searchreponse } from 'src/app/models/searchResponse';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.scss']
})
export class ProductlistComponent implements OnInit {

  constructor(private _Activatedroute: ActivatedRoute, public _productservice: ProductService,public _router: Router,public dialog: MatDialog) { }
  cname: any;
  scname: any;
  sub;
  products: any[];
  ngOnInit() {
    this.sub = this._Activatedroute.paramMap.subscribe(params => {
      console.log('params'+params);
      this.cname = params.get('cname');
      this.scname = params.get('scname');
      this._productservice.getProductlist(this.cname, this.scname, 'us', 0, 20).subscribe(
        /*data => {
          const arr = [];
          data.responseObjects.forEach((productDet) => {
            const obj = {};
            obj['name'] = productDet.item_name;
            obj['image_uri'] = productDet.image;
            obj['actual_price'] = productDet.custom_price;
            obj['offer_price'] = productDet.prepay_price;
            
            arr.push(obj);

          });
          this.products = arr;*/
          (results: searchreponse) => {
            this.products=results.responseObjects;
        });
    });

  }

  showProductDetails(params) {
    this._productservice.routeProductDetails(params);
  }

  /*public products = [
    {
      name: "Bata, Reebok, Nike and popular brand shoes",
      image_uri: '../../../assets/img/1.jpeg',
      offer_per:'50%'
    },
    {
      name: "Watch",
      image_uri: '../../../assets/img/2.jpeg',
      offer_per:'20%'
    },
    {
      name: "T-Shirt",
      image_uri: '../../../assets/img/9.jpeg'
    },
    {
      name: "Bluetooth Headset",
      image_uri: '../../../assets/img/4.jpeg'
    },
    {
      name: "Speakers",
      image_uri: '../../../assets/img/5.jpeg'
    },
    {
      name: "Awesome deals on luggage bags",
      image_uri: '../../../assets/img/3.jpeg'
    },
    {
      name: "Huge discounts on mobiles",
      image_uri: '../../../assets/img/6.jpeg'
    },
    {
      name: "Huge discounts on mobiles",
      image_uri: '../../../assets/img/8.jpeg'
    },
    {
      name: "Huge discounts on mobiles",
      image_uri: '../../../assets/img/10.jpeg'
    },
    {
      name: "Speakers",
      image_uri: '../../../assets/img/11.jpeg'
    },
    {
      name: "Huge discounts on mobiles",
      image_uri: '../../../assets/img/8.jpeg'
    },
    {
      name: "Huge discounts on mobiles",
      image_uri: '../../../assets/img/10.jpeg'
    },
    {
      name: "Speakers",
      image_uri: '../../../assets/img/11.jpeg'
    }

  ];

*/

openShare(event : any) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.closeOnNavigation = true;
  dialogConfig.autoFocus = true;
  dialogConfig.width = '200px';
  dialogConfig.height = '150px';
  let x = event.x-50;
  let y = event.y-50;
  dialogConfig.position = {left:x+'px',top:y+"px"};
  this.dialog.open(SocialshareComponent, dialogConfig);
}
}
