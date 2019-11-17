import { Component, OnInit, AfterViewInit, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { searchreponse } from 'src/app/models/searchResponse';
import { SocialshareComponent } from './socialshare/socialshare.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { Swiper, Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/js/swiper.esm.js';
import { CartService } from 'src/app/services/cart.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ProductDetailsRouteInfoService } from 'src/app/services/routing-services/product-details-route-info.service';
Swiper.use([Navigation, Pagination, Scrollbar, Autoplay]);
import { environment } from 'src/environments/environment';
import { ProductRouteInfo } from 'src/app/models/ProductRouteInfo';
import { ProductListRouteInfoService } from 'src/app/services/routing-services/product-list-route-info.service';


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})

export class ContentComponent implements AfterViewInit, OnInit {
  public flashDeals: Product[];
  public hotDeals: Product[];
  public todayDeals: Product[];
  public snackBarConfig : MatSnackBarConfig;
  public PRICE_PREFIX: string = environment.PRICE_PREFIX;
  constructor(private _snackBar: MatSnackBar, private _Activatedroute: ActivatedRoute, public _productservice: ProductService, public _router: Router, public dialog: MatDialog, public cart: CartService,
    public _productListRouteInfo:ProductListRouteInfoService) {
  }


  showProductDetails(cname,scname,pid){
    let productRouteInfo: ProductRouteInfo = new ProductRouteInfo(cname,scname,pid);
    sessionStorage.setItem("product_details", JSON.stringify(productRouteInfo));
    this._productListRouteInfo.addToCart(productRouteInfo);
    this._productservice.routeProductDetails();
  }

  ngAfterViewInit() {

    setTimeout(() => {
      var swiper = new Swiper('.flash-deals', {
        autoplay: {
          delay: 3000,
        },
        speed: 500,
        slidesPerView: 1,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
      })
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
          1200: {
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
    this.snackBarConfig = new MatSnackBarConfig();
    this.snackBarConfig.horizontalPosition = "center";
    this.snackBarConfig.verticalPosition = "top";
    this.snackBarConfig.duration = 2000;
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
    // type MatSnackBarHorizontalPosition = 'start' | 'center' | 'end' | 'left' | 'right';
    // type MatSnackBarVerticalPosition = 'top' | 'bottom';
    // this.snackBar.open(this.message, this.action ? this.actionButtonLabel : undefined, config);
    // this._router.navigateByUrl('/mycart');
    // this._snackBar.open("The item has been added to cart.", "", this.snackBarConfig);

  }

}
