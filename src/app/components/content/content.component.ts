import { Component, OnInit, AfterViewInit, OnChanges } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { searchreponse } from 'src/app/models/searchResponse';
import { SocialshareComponent } from './socialshare/socialshare.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { Swiper, Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/js/swiper.esm.js';
import { encode } from 'punycode';
import { CartService } from 'src/app/services/cart.service';
Swiper.use([Navigation, Pagination, Scrollbar, Autoplay]);

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements AfterViewInit, OnInit {
  public flashDeals: Product[];
  public hotDeals: Product[];
  public todayDeals: Product[];
  constructor(private _Activatedroute: ActivatedRoute, public _productservice: ProductService, public _router: Router, public dialog: MatDialog,public cart: CartService) {
  }


  showProductDetails(params) {
    this._productservice.routeProductDetails(params);
  }

  ngAfterViewInit() {

    setTimeout(() => {
      var swiper = new Swiper('.banner-container', {
        autoplay: {
          delay: 3000,
        },
        spaceBetween: 20,
        speed: 500,
        slidesPerView: 3,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
          },
          600: {
            slidesPerView: 2,
          },
          991: {
            slidesPerView: 3,
          },
          1366: {
            slidesPerView: 4,
          },
          1500: {
            slidesPerView: 5,
          }
        }
      })
    }, 1000);
  }

  ngOnInit() {
    this._productservice.getHttpProductDealsByType('f', 'us', 0, 50).subscribe(
      (results: searchreponse) => {
        this.flashDeals = results.responseObjects;
      });
    this._productservice.getHttpProductDealsByType('h', 'us', 0, 50).subscribe(
      (results: searchreponse) => {
        this.hotDeals = results.responseObjects;
      });
    this._productservice.getHttpProductDealsByType('t', 'us', 0, 50).subscribe(
      (results: searchreponse) => {
        this.todayDeals = results.responseObjects;
      });
  }

  openShare(event: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.closeOnNavigation = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '150px';
    dialogConfig.height = '150px';
    let x = event.x - 50;
    let y = event.y - 50;
    dialogConfig.position = { left: x + 'px', top: y + "px" };
    this.dialog.open(SocialshareComponent, dialogConfig);
  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
  }


  public parseToUrl(value: string) {
    if (value != undefined) {
      return encodeURI(value);
    } else {
      return value;
    }
  }

  public addToCart(product: Product) {
    this.cart.addToCart(product);
    this._router.navigateByUrl('/mycart');
  }

}
