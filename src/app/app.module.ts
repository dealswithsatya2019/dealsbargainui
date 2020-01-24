import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './modules/material.module';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContentComponent } from './components/content/content.component';
import { AppLandingComponent } from './components/app-landing.component';
import { LoginComponent } from './components/header/login/login.component';
import { MenuBarComponent } from './components/header/menu-bar/menu-bar.component';
import {SocialLoginModule,AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider} from 'angularx-social-login';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './components/user/profile/profile.component';
import { WishlistComponent } from './components/user/wishlist/wishlist.component';
import { FlexLayoutModule } from "@angular/flex-layout";
import { ProductlistComponent } from './components/content/productlist/productlist.component';
import { ProductdetailsComponent } from './components/content/productdetails/productdetails.component';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from './user.service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttCommonService } from 'src/app/services/httpcommon.service';
import { OrdersComponent } from 'src/app/components/user/orders/orders.component';
import { CheckoutComponent } from './components/user/checkout/checkout.component';
import { SocialshareComponent } from './components/content/socialshare/socialshare.component';
import { JwSocialButtonsModule } from 'jw-angular-social-buttons';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SignupComponent } from './components/header/signup/signup.component';
import { AboutusComponent } from './components/footer/aboutus.component';
import { MarketreviewsComponent } from './components/footer/marketreviews.component';
import { TermsofuseComponent } from './components/footer/termsofuse.component';
import { PrivacypolicyComponent } from './components/footer/privacypolicy.component';
import { SitemapComponent } from './components/footer/sitemap.component';
import { ShippingpolicyComponent } from './components/footer/shippingpolicy.component';
import { BlogComponent } from './components/footer/blog.component';
import { ReturnpolicyComponent } from './components/footer/returnpolicy.component';
import { ContactusComponent } from './components/footer/contactus.component';
import { PaymentmethodsComponent } from './components/footer/paymentmethods.component';
import { ShippingguideComponent } from './components/footer/shippingguide.component';
import { LocationweshiptoComponent } from './components/footer/locationweshipto.component';
import { EstimateddeliverytimeComponent } from './components/footer/estimateddeliverytime.component';
import { MyaccountComponent } from './components/footer/myaccount.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { ProductpurchaseComponent } from './components/content/productpurchase.component';
import { CartdetailsComponent } from './components/content/cartdetails.component';
import { RateproductComponent } from './components/content/rateproduct/rateproduct.component';
import { GalleryModule } from '@ngx-gallery/core';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { MyprofileComponent } from 'src/app/components/user/myprofile/myprofile.component';
import { PersonalInfoComponent } from './components/user/personal-info/personal-info.component';
import { AddressesComponent } from './components/user/addresses/addresses.component';
import { ReviewRatingsComponent } from './components/user/review-ratings/review-ratings.component';
import { ChangePasswordComponent } from './components/user/change-password/change-password.component';
import { UnsubscribeComponent } from './components/user/unsubscribe/unsubscribe.component';
import { ForgotpasswordComponent } from './components/header/forgotpassword/forgotpassword.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CouponsComponent } from './components/content/coupons/coupons.component';
import { MobileMenuComponent } from './components/header/mobile-menu/mobile-menu.component';
import { OrderItemDetailsComponent } from './components/content/order-item-details/order-item-details.component';
import { DatePipe } from '@angular/common';
import { ProductRatingsListComponent } from './components/content/product-ratings-list/product-ratings-list.component';


const facebook_oauth_client_id: string = '1091355284387654';
// const facebook_oauth_client_id: string = '824908174620082';
let config = new AuthServiceConfig([
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(facebook_oauth_client_id)
    
  },
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    // provider: new GoogleLoginProvider("224431478623-1q8qdp6m80l4bmtrn8ki481eqeof2eeq.apps.googleusercontent.com")
    provider: new GoogleLoginProvider("289799752800-r1snalln82q8qrtljta5d8e45901571d.apps.googleusercontent.com")
    
  }
  
]);

export function ProvideConfig() {
  return config;
}


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ContentComponent,
    AppLandingComponent,
    LoginComponent,
    MenuBarComponent,
    OrdersComponent,
    ProfileComponent,
    WishlistComponent,
    ProductlistComponent,
    ProductdetailsComponent,
    CheckoutComponent,
    SocialshareComponent,
    SignupComponent,
    AboutusComponent,
    MarketreviewsComponent,
    TermsofuseComponent,
    PrivacypolicyComponent,
    SitemapComponent,
    ShippingpolicyComponent,
    BlogComponent,
    ReturnpolicyComponent,
    ContactusComponent,
    PaymentmethodsComponent,
    ShippingguideComponent,
    LocationweshiptoComponent,
    EstimateddeliverytimeComponent,
    MyaccountComponent,
    ProductpurchaseComponent,
    CartdetailsComponent,
    RateproductComponent,
    MyprofileComponent,
    PersonalInfoComponent,
    AddressesComponent,
    ReviewRatingsComponent,
    ChangePasswordComponent,
    UnsubscribeComponent,
    ForgotpasswordComponent,
    CouponsComponent,
    MobileMenuComponent,
    OrderItemDetailsComponent,
    ProductRatingsListComponent,
    
  ],
  entryComponents:[LoginComponent,SignupComponent,SocialshareComponent,RateproductComponent,ForgotpasswordComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    AppRoutingModule,
    SocialLoginModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule, 
    ReactiveFormsModule,
    JwSocialButtonsModule,
    ScrollingModule,
    NgxImageZoomModule.forRoot(),
    GalleryModule,
    LightboxModule.withConfig({
      panelClass: 'fullscreen',
      keyboardShortcuts: true,
    }),
    NgxStarRatingModule,
    InfiniteScrollModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA , NO_ERRORS_SCHEMA],
  providers: [HttCommonService, ProductService, UserService,DatePipe, { provide: AuthServiceConfig, useFactory: ProvideConfig}],
  bootstrap: [AppComponent]
})
//providers: [HttCommonService, ProductService, UserService,ProductListRouteInfoService, { provide: AuthServiceConfig, useFactory: ProvideConfig}],
export class AppModule { }
