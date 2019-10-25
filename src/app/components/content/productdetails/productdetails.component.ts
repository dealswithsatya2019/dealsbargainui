import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { MatDialog } from '@angular/material';
import { async } from '@angular/core/testing';
import { Product } from 'src/app/models/product';
import { searchreponse } from 'src/app/models/searchResponse';
import { Swiper, Navigation, Pagination, Scrollbar, Autoplay, Thumbs } from 'swiper/js/swiper.esm.js';
Swiper.use([Navigation, Pagination, Scrollbar, Autoplay, Thumbs]);

declare let paypal: any;

@Component({
  selector: 'app-productdetails',
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.scss']
})
export class ProductdetailsComponent implements OnInit,AfterViewInit {

  @ViewChild('paypal', { static: true })
  paypalElement: ElementRef;
  paidFor: boolean = false;
  public similarProducts : Product[];
  public myThumbnail="https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg";
  public myFullresImage="https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg";

  product = {
    price: 0.01,
    description: "Kappa",
    image_uri: "https://d1k0ppjronk6up.cloudfront.net/products/1529/images_b75_image2_844.jpg",
    offer_per: 10,
    name: "Kappa Variety Puzzles & Games Book Case Pack 48",
    status: "",
    brand_name: "Kappa",
    master_suplier: "",
    actual_price: 0.01,
    offer_price: 0.01,
    drop_ship_fee: "0.001$",
    title: "Kappa Variety Puzzles & Games Book Case Pack 48"
  }

  constructor(private _Activatedroute: ActivatedRoute, public _productservice: ProductService, public _router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: this.product.description,
                amount: {
                  currency_code: "USD",
                  value: this.product.price
                }
              }
            ]
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          this.paidFor = true;
          console.log("order :", order);
        },
        onError: err => {
          console.log("Error :", err);
        }

      })
      .render(this.paypalElement.nativeElement);
    /**
     productname: any;
      scname: any;
      sub;
      products: any[];
      public similarProducts : Product[];
      ngOnInit() {
        this.sub = this._Activatedroute.paramMap.subscribe(params => {
          this.productname = params.get('productname');
          this._productservice.getProductlist("apparel", "", 'us', 0, 20).subscribe(
            data => {
              const arr = [];
              data.responseObjects.forEach((productDet) => {
                const obj = {};
                obj['name'] = productDet.item_name;
                obj['image_uri'] = "https://d1k0ppjronk6up.cloudfront.net/products/1529/images_b75_image2_844.jpg";
                obj['actual_price'] = productDet.custom_price;
                obj['offer_price'] = productDet.prepay_price;
                arr.push(obj);
              });
              this.products = arr;
            });
        });
    
     */
    this._productservice.getHttpProductDealsByType('f', 'us', 0, 50).subscribe(
      (results: searchreponse) => {
        this.similarProducts = results.responseObjects;
      });
  }

  ngAfterViewInit() {

    setTimeout(() => {
      var swiper = new Swiper('.similar', {
        autoplay: {
          delay: 3000,
        },
        spaceBetween:20,
        speed: 500,
        slidesPerView:5,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
      })
      }, 1000);

      setTimeout(() => {
      var galleryThumbs = new Swiper('.gallery-thumbs', {
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
      });
      var galleryTop = new Swiper('.gallery-top', {
        spaceBetween: 10,
        // navigation: {
        //   nextEl: '.swiper-button-next',
        //   prevEl: '.swiper-button-prev',
        // },
        thumbs: {
          swiper: galleryThumbs
        }
      });
    }, 1000);
  }

  

}
