import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MyordersService } from 'src/app/services/myorders.service';
import { GetOrederReq } from 'src/app/models/GetOrders';
import { searchreponse } from 'src/app/models/searchResponse';
import { ProductService } from 'src/app/services/product.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit,OnDestroy {

  subscriptions : Subscription = new Subscription();
  public ordersListInfo : Array<GetOrederReq> = [];
  public PRICE_PREFIX: string = environment.PRICE_PREFIX;
  constructor(public _myordersService: MyordersService, public _productservice: ProductService) { }

  ngOnInit() {
    this.getOrdersList();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


  public getOrdersList() {
    this.subscriptions.add(this._myordersService.getOrders('us').subscribe(
      (data: searchreponse) => {
        if(data.statusCode == 404){
          this.ordersListInfo = data.responseObjects;
        }
      },
      (error) =>{
        console.log(error);
      }
    ));
  }

  showProductDetails(params) {
    this._productservice.routeProductDetails(params);
  }

}
