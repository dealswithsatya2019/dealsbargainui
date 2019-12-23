import { Component, OnInit, ViewChild, Renderer2, Input, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig, MatMenuTrigger } from '@angular/material';
import { AuthService } from 'angularx-social-login';
import { LoginComponent } from './login/login.component';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { apirequest } from 'src/app/models/apirequest';
import { Product } from 'src/app/models/product';
import { searchreponse } from 'src/app/models/searchResponse';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { fuzzysearch } from 'src/app/models/fuzzysearch';
import { hits } from 'src/app/models/hits';
import { hitsmain } from 'src/app/models/hitsmain';
import { environment } from 'src/environments/environment';
import { CartService } from 'src/app/services/cart.service';
import { WhishlistService } from 'src/app/services/whishlist.service';
import { ProductService } from 'src/app/services/product.service';
import { MyprofileService } from 'src/app/services/myprofile.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  public menuFlag: boolean = false;
  public inputValue: string = '';
  // This value will be updated only after debounce
  public debouncedInputValue = this.inputValue;
  searchMoviesCtrl = new FormControl();
  filteredMovies: Product[] = [];
  public searchResponseObj: searchreponse;
  isLoading = false;
  errorMsg: string;
  classes: string;
  private APIEndpoint: string = environment.APIEndpoint;
  @ViewChild(MatMenuTrigger, { static: false }) clickHoverMenuTrigger: MatMenuTrigger;
  @Input('class') panelClass: string = "megaMenu";
  openOnMouseOver() {
    this.clickHoverMenuTrigger.toggleMenu();
  }
  constructor(public dialog: MatDialog, public userservice: UserService, public _socioAuthServ: AuthService,
    public _router: Router, private http: HttpClient, private renderer: Renderer2, public cartService: CartService,
    public _whishlistService: WhishlistService, public _productservice: ProductService,
    public _profileInfoService: MyprofileService) { }

  url = this.APIEndpoint + '/products/search';

  /*menus = [
    {
      cname: "Apparel",
      scnames: ["Accessories", "Apparel", "Jewelry & watches", "Shoes"]
    },
    {
      cname: "Automotive",
      scnames: ["Law enforcement", "Industrial", "Food service", "Automotive", "Office maintenance", "Janitorial & lunchroom", "Business", " Tool"]
    },
    {
      cname: "Books",
      scnames: ["Computers", " Art", " Self-help", "Cooking", "House  &  home", "Architecture", "Reference", "Calendar", "Magazines", "Blank book/journal/diary", "Mathematics", "Sports  &  recreation", "Non-classifiable", "Biography  &  autobiography", "Accessories", "Education", "Technology", "Games", "Juvenile diary", "blank book", "journal", "Crafts  &  hobbies", "Gardening"]
    },

    {
      cname: "Electronics",
      scnames: ["Home automation & security", "Furniture", "stands & mounts", "Tv & video", "Office electronics", "Clocks/Clock Radio", "Camera & photo", "Home audio", "Two-way", "scanners & monitors", "Automotive electronics", "Optics", "Speakers", "Portable audio & video", "Office products & supplies", "Gps", "Batteries", "Ipod", "mp3 & media players", "Headphones", "Accessories", "Marine", "Computer", "General", "Cell Phones & Accessories", "iPad", "Tablets", "eReaders", "Phone & telecom"]
    },
    {
      cname: "Games & Movies & Music",
      scnames: ["Video games", "Video", "Music"]
    },
    {
      cname: "Health",
      scnames: ["Hair", "Vitamins & supplements", "Cosmetics & makeup", "Nutrition", "Adult-Mature", "Bath & shower", "Skincare", "Massage & relaxation", "Natural", "homeopathic & alternative", "Gift Sets", "Exercise equipment", "Green tea healthcare", "Sexual Wellness", "Healthcare", "Perfume & fragrances", "Personal appliance & tools", "Shavers & hair removal"]
    },
    {
      cname: "Home & Garden",
      scnames: ["Hair", "Vitamins & supplements", "Cosmetics & makeup", "Nutrition", "Adult-Mature", "Bath & shower", "Skincare", "Massage & relaxation", "Natural", "homeopathic & alternative", "Gift Sets", "Exercise equipment", "Green tea healthcare", "Sexual Wellness", "Healthcare", "Perfume & fragrances", "Personal appliance & tools", "Shavers & hair removal"]
    },
    {
      cname: "Toys",
      scnames: ["Kid & baby", "Toy"]
    },
    {
      cname: "Sports",
      scnames: ["Camping & hiking", "Cycling & wheel sports", "Lawn games", "Fencing", "Tennis & racquet sports", "Badminton", "Electronics", "Water polo", "Game room", "Wrestling", "Sports medicine", "Cricket", "Martial arts", "Archery", "Swimming", "Motor sports", "General sports", "Cheerleading", "Skating", "Golf", "Boxing", "Volleyball", "Bowling", "Snowshoeing", "Pilates", "Kayaking", "Surfing", "Baseball", "Running", "Yoga", "Row", "Softball", "Water sports", "Equestrian sports", "Climbing", "Airsoft", "Fishing", "Sports electronics & gadgets", "Basketball", "Boating", "Accessories", "Paintball", "Diving", "Disc sports", "Gymnastics", "Hunting", "Hockey", "Soccer", "Snow skiing", "Fan gear", "Snowmobiling", "Football", "Rv equipment", "Track & field", "Skateboarding", "Exercise & fitness", "Ballet & dance"]
    }
  ];*/
  ngOnInit() {
    let access_token = sessionStorage.getItem("sn");
    if (access_token != undefined) {
      this.userservice.setAuthToken(access_token);
      this._profileInfoService.funSetUserProfile();
      this._whishlistService.updateWhishlist();
    }
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    this.searchMoviesCtrl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          //   let p = new Product();
          // p.item_id =  "H5qdgrzCqObj9ev6lDzjlQ==";
          // p.item_name =  "7 inches";
          // p.item_sku =  "D110456~7";
          // p.master_suplier =  "doba";
          // p.product_id =  "H5qdgrzCqObj9ev6lDzjlQ==";
          // p.subcategory =  "Necklaces";
          // p.category = "fashion";
          if (this.searchResponseObj != null && this.searchResponseObj != undefined) {
            this.filteredMovies = this.searchResponseObj.responseObjects;
          }
        }),
        switchMap(value => this.http.post(this.url,
          { "countryCode": "us", "categoryName": "", "searchquery": value, "pageNo": 1, "pageSize": 10 },
          options)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((data: fuzzysearch) => {
        this.filteredMovies = [];
        this.filteredMovies = data.responseObjects;
        // this.filteredMovies = new Product[];
        // let p = new Product();
        // p.item_id =  "H5qdgrzCqObj9ev6lDzjlQ==";
        // p.item_name =  "7 inches";
        // p.item_sku =  "D110456~7";
        // p.master_suplier =  "doba";
        // p.product_id =  "H5qdgrzCqObj9ev6lDzjlQ==";
        // p.subcategory =  "Necklaces";
        // p.category = "fashion";
        // this.filteredMovies.push(p);
        console.log("Fuzzy Search API Response", this.filteredMovies);
      });
  }

  public searchFromOption(hitObj: Product) {
    console.log("selected Value : " + hitObj);
    let req = {
      "cname": hitObj.category,
      "scname": hitObj.subcategory,
      "pid": hitObj.item_id
    }
    // this.searchMoviesCtrl = new FormControl();
    this._productservice.routeProductDetails(req);

  }

  public singleProduct: Product;

  public search() {
    console.log("filter value ", this.searchMoviesCtrl.value);
    this.singleProduct = this.filteredMovies.filter(item => item.item_name == this.searchMoviesCtrl.value)[0];
    if (this.singleProduct != undefined) {
      console.log("selected Value : " + this.singleProduct);
      let req = {
        "cname": this.singleProduct.category,
        "scname": this.singleProduct.subcategory,
        "pid": this.singleProduct.item_id
      }
      // this.searchMoviesCtrl = new FormControl();
      this._productservice.routeProductDetails(req);
    }
  }

  // funSignIn() {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;
  //   dialogConfig.width = '400px';
  //   dialogConfig.height = '500px';
  //   this.dialog.open(LoginComponent, dialogConfig);
  // }
  signOut(): void {
    this.userservice.resetDetails();
    this.cartService.clearCart();
    sessionStorage.removeItem("sn");
    this._whishlistService.clearWhislist();
    this._socioAuthServ.signOut();
    this._router.navigateByUrl("/");
  }
  gotoHomePage() {
    this._router.navigate(['/']);
  }
  toggleMenu() {
    this.menuFlag = !this.menuFlag;
  }
}
