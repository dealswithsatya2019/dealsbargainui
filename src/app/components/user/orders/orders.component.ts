import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MyordersService } from 'src/app/services/myorders.service';
import { GetOrederReq } from 'src/app/models/GetOrders';
import { searchreponse } from 'src/app/models/searchResponse';
import { ProductService } from 'src/app/services/product.service';
import { environment } from 'src/environments/environment';
import { Product } from 'src/app/models/product';
import { AlertService } from 'src/app/services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {

  subscriptions: Subscription = new Subscription();
  public ordersListInfo: Array<GetOrederReq> = [];
  public PRICE_PREFIX: string = environment.PRICE_PREFIX;
  private deliverydate_configurable_days = environment.DeliveryDate_Configurable_days;
  constructor(public _myordersService: MyordersService,
    public _productservice: ProductService,
    public _alertService: AlertService,
    public _router: Router) { }

  ngOnInit() {
    this.getOrdersList();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


  public getOrdersList() {
    this.subscriptions.add(this._myordersService.getOrders('us').subscribe(
      (data: searchreponse) => {
        if (data.responseObjects && data.responseObjects.length > 0) {
          this.ordersListInfo = data.responseObjects;
        }
      },
      (error) => {
        console.log(error);
      }
    ));
  }

  showProductDetails(params) {
    this._productservice.routeProductDetails(params);
  }

  public cancelOrder(orderTrackingId, orderDetailsId, productInfo: Product) {
    this.subscriptions.add(this._myordersService.cancelOrReturn(orderTrackingId, orderDetailsId, productInfo.category, productInfo.subcategory, productInfo.item_id, productInfo.master_suplier, 'us', 'cancelled').subscribe(
      (data: searchreponse) => {
        if (data.statusCode == 200) {
          this._alertService.raiseAlert("Item was successfully cancelled.");
          this._router.navigate(['myprofile', { outlets: { 'profileoutlet': ['orders'] } }]);
        } else {
          this._alertService.raiseAlert("Unable to cancel the item.");
          console.log(data);
        }
      },
      (error) => {
        this._alertService.raiseAlert("Unable to cancel the item.");
        console.log(error);
      }
    ));
  }

  public returnOrder(orderTrackingId, orderDetailsId, productInfo: Product) {
    this.subscriptions.add(this._myordersService.cancelOrReturn(orderTrackingId, orderDetailsId, productInfo.category, productInfo.subcategory, productInfo.item_id, productInfo.master_suplier, 'us', 'return').subscribe(
      (data: searchreponse) => {
        if (data.statusCode == 200) {
          this._alertService.raiseAlert("Item was successfully returned.");
          this._router.navigate(['myprofile', { outlets: { 'profileoutlet': ['orders'] } }]);
        } else {
          this._alertService.raiseAlert("Unable to return the item.");
          console.log(data);
        }
      },
      (error) => {
        this._alertService.raiseAlert("Unable to return the item.");
        console.log(error);
      }
    ));
  }

  showOrderDetails(index: number, orderDetails: GetOrederReq) {
    if (orderDetails != null && orderDetails != undefined && orderDetails.items_info != null && orderDetails.items_info.length >= index) {
      let product: Product = orderDetails.items_info[index];
      // let id = orderDetails.order_id_by_payment_channel + "_" + product.item_id + "_" + product.category + "_" + product.subcategory + "_" + orderDetails.user_id;
      let id = product.order_details_id
      this._router.navigate(['/odp', id, "us"]);
    }
  }

  getDeliveredDate(orderInfo : GetOrederReq) : Date{
    let createdDate = new Date(orderInfo.created_on);
    //var convertDate = this.datepipe.transform(e.target.value, 'yyyy-MM-dd');
    console.log(createdDate);
    createdDate.setHours(createdDate.getHours() + (this.deliverydate_configurable_days * 24));
    return createdDate;
  }
}
