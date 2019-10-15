import { Component, OnInit, AfterViewInit,OnChanges } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { searchreponse } from 'src/app/models/searchResponse';
import { SocialshareComponent } from './socialshare/socialshare.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { Swiper, Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/js/swiper.esm.js';
Swiper.use([Navigation, Pagination, Scrollbar, Autoplay]);

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements AfterViewInit, OnInit  { 
  public flashDeals : Product[];
  public hotDeals : Product[];
  public todayDeals : Product[];
  constructor(private _Activatedroute: ActivatedRoute, public _productservice: ProductService, public _router: Router,public dialog: MatDialog) {    
   }
  

  showProductDetails() {
    this._router.navigate(['/productdetails']);
  }

  public banners = [
    {
      image_uri: "../../assets/img/banner1.jpg"
    },
    {
      image_uri: "../../assets/img/banner5.jpg"
    },
    {
      image_uri: "../../assets/img/PLBJD50.jpg"
    }
  ];
    
  ngAfterViewInit() {

    setTimeout(() => {
      var swiper = new Swiper('.banner-container', {
        // autoplay: {
        //   delay: 3000,
        // },
        spaceBetween:20,
        speed: 500,
        slidesPerView:3,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints:{
          0:{
            slidesPerView:1,
          },
          768:{
            slidesPerView:2,
          },
          991:{
            slidesPerView:2,
          },
          1366:{
            slidesPerView:3,
          },
          1500:{
            slidesPerView:4,
          }
        }
      })
      }, 1000);
  }

  ngOnInit() {
    this._productservice.getHttpProductDealsByType('f', 'us', 0, 50).subscribe(
      (results: searchreponse) => {
        this.flashDeals=results.responseObjects;
      });
    this._productservice.getHttpProductDealsByType('h', 'us', 0, 50).subscribe(
      (results: searchreponse) => {
        this.hotDeals=results.responseObjects;
      });
    this._productservice.getHttpProductDealsByType('t', 'us', 0, 50).subscribe(
      (results: searchreponse) => {
        this.todayDeals=results.responseObjects;
      });    
  }
  public products = [
    {
      name: "Bata, Reebok, Nike and popular brand shoes",
      image_uri: '../../../assets/img/1.jpeg',
      offer_per: '50%'
    },
    {
      name: "Watch",
      image_uri: '../../../assets/img/2.jpeg',
      offer_per: '20%'
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
    }

  ];

  public hotdeals = [];
  public flashdeals = [];

openShare(event : any) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.closeOnNavigation = true;
  dialogConfig.autoFocus = true;
  dialogConfig.width = '150px';
  dialogConfig.height = '150px';
  let x = event.x-50;
  let y = event.y-50;
  dialogConfig.position = {left:x+'px',top:y+"px"};
  this.dialog.open(SocialshareComponent, dialogConfig);
}

}
