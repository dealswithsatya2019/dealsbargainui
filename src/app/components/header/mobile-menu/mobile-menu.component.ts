import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { ProductService } from 'src/app/services/product.service';
import { AuthResopnse } from 'src/app/models/AuthResponse';
import { MenuCategories } from 'src/app/models/MenuCategories';
import { searchreponse } from 'src/app/models/searchResponse';
import { AuthResopnse2 } from 'src/app/models/ApiResponse2';
import { ProductRouteInfo } from 'src/app/models/ProductRouteInfo';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss']
})
export class MobileMenuComponent implements OnInit {
  public menuCategories : MenuCategories[];
  public menuSubCategories : MenuCategories;
  subscription : Subscription;
  constructor(public _productservice: ProductService) { }

  ngOnInit() {
    this.getAllCategoriesMenuInfo();
    
  }

  @ViewChild(MatMenuTrigger, { static: false }) HoverMenuTrigger: MatMenuTrigger;
  openOnMouseOver() {
    this.HoverMenuTrigger.toggleMenu();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

   getAllCategoriesMenuInfo(){
    try {
      this.subscription = this._productservice.getCategoryMenuInfo('','us').subscribe(
        (authResponse: searchreponse) => {
          this.menuCategories = authResponse.responseObjects;
        }
    );
    } catch (error) {
      console.log(error);   
    }
  }
  
  getSubgetgories(cname){
    try {
        this._productservice.getSubCategories(cname,'us').subscribe(
          (authResponse: AuthResopnse2) => {
            this.menuSubCategories = authResponse.responseObjects;
          }
        );
    } catch (error) {
      console.log(error);   
    }
  }


  routeToProductListPage(params){
    
    this._productservice.routeProductList(params);
    document.getElementById('menuhide').style.display="none";
  }
}
