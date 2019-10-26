import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
declare let paypal: any;
@Component({
  selector: 'app-productpurchase',
  templateUrl: './productpurchase.component.html',
  styleUrls: ['./productpurchase.component.scss']
})
export class ProductpurchaseComponent implements OnInit {

  @ViewChild('paypal', { static: true })
  paypalElement: ElementRef;
  paypalFor: boolean = false;
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

  constructor() { }

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
          this.paypalFor = true;
          console.log("order :", order);
        },
        onError: err => {
          console.log("Error :", err);
        }

      })
      .render(this.paypalElement.nativeElement);
  }

}
