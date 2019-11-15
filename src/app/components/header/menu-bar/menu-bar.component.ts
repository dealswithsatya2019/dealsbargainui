import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { ProductService } from 'src/app/services/product.service';
import { AuthResopnse } from 'src/app/models/AuthResponse';
import { MenuCategories } from 'src/app/models/MenuCategories';
import { searchreponse } from 'src/app/models/searchResponse';
//import { ProductListRouteInfoService } from 'src/app/services/routing-services/product-list-route-info.service';
import { AuthResopnse2 } from 'src/app/models/ApiResponse2';
import { ProductRouteInfo } from 'src/app/models/ProductRouteInfo';
// import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent implements OnInit {

  public menuCategories : MenuCategories[];

  //constructor(public _productservice: ProductService, public _productListRouteInfo:ProductListRouteInfoService) { }
  constructor(public _productservice: ProductService) { }

  ngOnInit() {
    this.getAllCategoriesMenuInfo();
  }

  @ViewChild(MatMenuTrigger, { static: false }) HoverMenuTrigger: MatMenuTrigger;
  openOnMouseOver() {
    this.HoverMenuTrigger.toggleMenu();
  }

  mainMenus=[
    "Apparel",
    "Automotive",
    "Books",
    "Electronics",
    "Games & Movies & Music",
    "Health",
    "Home & Garden",
    "Toys",
    "Sports",
    "Menu",
    "Women"
  ];

  menus = [
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
    },{
      cname: "Men",
      scnames:[]
    },{
      cname: "Women",
      scnames :[]
    }
  ];

  /*getAllCategoriesMenuInfo(){
    try {
    for(let i=0;i<this.mainMenus.length ;i++){  //How to properly iterate here!!
      this._productservice.getSubCategories(this.mainMenus[i],'us').subscribe(
        (authResponse: AuthResopnse2) => {
          this.menuCategories.push(authResponse.responseObjects);
        }
      );
    }
  } catch (error) {
    console.log(error);   
  }
   
  }*/

   getAllCategoriesMenuInfo(){
    try {
      this._productservice.getCategoryMenuInfo('','us').subscribe(
        (authResponse: searchreponse) => {
          this.menuCategories = authResponse.responseObjects;
        }
     //,
      //error =>{
        //console.error('============================='+error);
      //} 
    );
    } catch (error) {
      console.log(error);   
    }
  }
  
  getSubgetgories(cname){
    try {
        this._productservice.getSubCategories(cname,'us').subscribe(
          (authResponse: AuthResopnse2) => {
            this.menuCategories.push(authResponse.responseObjects);
          }
        );
    } catch (error) {
      console.log(error);   
    }
  }


  routeToProductListPage(cname,scname){
    let productRouteInfo: ProductRouteInfo = new ProductRouteInfo(cname,scname,'');
    /*this._productListRouteInfo.addToCart(productRouteInfo);*/
    sessionStorage.setItem("product_list", JSON.stringify(productRouteInfo));
    this._productservice.routeProductList();
  }
}
