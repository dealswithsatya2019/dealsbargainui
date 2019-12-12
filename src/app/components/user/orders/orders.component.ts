import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MyordersService } from 'src/app/services/myorders.service';
import { GetOrederReq } from 'src/app/models/GetOrders';
import { searchreponse } from 'src/app/models/searchResponse';
import { ProductService } from 'src/app/services/product.service';
import { environment } from 'src/environments/environment';
import { Product } from 'src/app/models/product';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit,OnDestroy {

  subscriptions : Subscription = new Subscription();
  public ordersListInfo : Array<GetOrederReq> = [];
  public PRICE_PREFIX: string = environment.PRICE_PREFIX;
  constructor(public _myordersService: MyordersService, 
    public _productservice: ProductService,
    public _alertService: AlertService) { }

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

  public cancelOrder(orderTrackingId, orderDetailsId, productInfo : Product){
    this.subscriptions.add(this._myordersService.cancelOrReturn(orderTrackingId, orderDetailsId, productInfo.category, productInfo.subcategory, productInfo.item_id, productInfo.master_suplier,'us','cancelled').subscribe(
      (data: searchreponse) => {
        if(data.statusCode == 200){
          this._alertService.raiseAlert("Item was successfully cancelled.");
        }else{
          this._alertService.raiseAlert("Unable to cancel the item.");
          console.log(data);
        }
      },
      (error) =>{
        this._alertService.raiseAlert("Unable to cancel the item.");
        console.log(error);
      }
    ));
  }

  public returnOrder(orderTrackingId, orderDetailsId,productInfo : Product){
    this.subscriptions.add(this._myordersService.cancelOrReturn(orderTrackingId, orderDetailsId, productInfo.category, productInfo.subcategory, productInfo.item_id, productInfo.master_suplier,'us','return').subscribe(
      (data: searchreponse) => {
        if(data.statusCode == 200){
          this._alertService.raiseAlert("Item was successfully returned.");
        }else{
          this._alertService.raiseAlert("Unable to return the item.");
          console.log(data);
        }
      },
      (error) =>{
        this._alertService.raiseAlert("Unable to return the item.");
        console.log(error);
      }
    ));
  }
  
}
