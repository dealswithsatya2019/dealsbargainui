import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { LoginformService } from 'src/app/services/forms/loginform.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
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
  stepNo: number = 1;
  exp1: boolean = true;
  exp2: boolean = false;
  exp3: boolean = false;
  exp4: boolean = false;
  exp5: boolean = false
  userName: string = "";
  public productDetails: any[];
  public product: Product;
  public cname: string;
  public scname: string;
  public pid: string;

  constructor(public loginformService: LoginformService, public _socioAuthServ: AuthService, private _Activatedroute: ActivatedRoute, public _productservice: ProductService, public _router: Router) { }

  ngOnInit() {
    this.setStep(1);
    let sessioninfo = sessionStorage.getItem("f_login_form");
    this.loginformService.response = sessioninfo;
    if (sessioninfo != null) {
      this.setStep(2);
    }
    // this._Activatedroute.paramMap.subscribe((params: ParamMap) => {
    //   this.cname = params.get('cname');
    //   this.scname = params.get('scname');
    //   this.pid = params.get('pid');
    // });

    // this._productservice.getHttpProductDetailsById(this.cname, this.scname, this.pid, 'us').subscribe(
    //   (results: searchreponse) => {
    //     this.productDetails = results.responseObject[0];
    //     this.product = this.productDetails[0];
    //   });
    paypal
      .Buttons({
        style: {
          layout: 'horizontal'
        },
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: this.productDetails[0].description,
                amount: {
                  currency_code: "USD",
                  value: this.productDetails[0].price,
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

  loginFacebook() {
    this._socioAuthServ.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      (response) => {
        this.loginformService.response = response;
        sessionStorage.setItem("f_login_form", JSON.stringify(response));
        this.userName = response.name;
        this.setStep(2);
        this.exp1 = false;
        this.exp2 = true;
      }
    );
  }

  loginGmail() {
    this._socioAuthServ.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (response) => {
        this.loginformService.response = response;
        sessionStorage.setItem("f_login_form", JSON.stringify(response));
        this.userName = response.name;
        this.setStep(2);
        this.exp1 = false;
        this.exp2 = true;
      }
    );
  }

  setStep(stepNo) {
    this.stepNo = stepNo;
    if (this.stepNo == 1) {
      this.exp1 = true;
      this.exp2 = this.exp3 = this.exp4 = this.exp5 = false;
    } else if (this.stepNo == 2) {
      this.exp2 = true;
      this.exp1 = this.exp3 = this.exp4 = this.exp5 = false;
    } else if (this.stepNo == 3) {
      this.exp3 = true;
      this.exp2 = this.exp1 = this.exp4 = this.exp5 = false;
    } else if (this.stepNo == 4) {
      this.exp4 = true;
      this.exp2 = this.exp3 = this.exp1 = this.exp5 = false;
    } else if (this.stepNo == 5) {
      this.exp5 = true;
      this.exp2 = this.exp3 = this.exp4 = this.exp1 = false;
    }
  }

  signOut(): void {
    this._socioAuthServ.signOut();
    this.loginformService.response = null;
    sessionStorage.removeItem("f_login_form");
    this.setStep(1);
  }

}
