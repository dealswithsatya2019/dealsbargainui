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
import { DealslistComponent } from './components/content/dealslist/dealslist.component';
import { SocialshareComponent } from './components/content/socialshare/socialshare.component';
import { JwSocialButtonsModule } from 'jw-angular-social-buttons';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SignupComponent } from './components/header/signup/signup.component';



const facebook_oauth_client_id: string = '1091355284387654';
let config = new AuthServiceConfig([
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(facebook_oauth_client_id)
    
  },
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("694985533669-oscsbl1s43mho6pgepf4hjm2duhoeb6n.apps.googleusercontent.com")
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
    DealslistComponent,
    SocialshareComponent,
    SignupComponent
  ],
  entryComponents:[LoginComponent,SocialshareComponent],
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
    ScrollingModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA , NO_ERRORS_SCHEMA],
  providers: [HttCommonService, ProductService, UserService,{ provide: AuthServiceConfig, useFactory: ProvideConfig}],
  bootstrap: [AppComponent]
})
export class AppModule { }
