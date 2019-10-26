import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { MatDialog } from '@angular/material';
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
export class ProductdetailsComponent implements OnInit {

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
    this._productservice.getHttpProductDealsByType('f', 'us', 0, 50).subscribe(
      (results: searchreponse) => {
        this.similarProducts = results.responseObjects;
      });
  }

}
