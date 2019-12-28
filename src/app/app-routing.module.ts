import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutes } from 'src/app/app-routes.enum';
import { AppLandingComponent } from 'src/app/components/app-landing.component';
import { ContentComponent } from 'src/app/components/content/content.component';
import { ProductlistComponent } from 'src/app/components/content/productlist/productlist.component';
import { ProductdetailsComponent } from 'src/app/components/content/productdetails/productdetails.component';
import { ProfileComponent } from 'src/app/components/user/profile/profile.component';
import { WishlistComponent } from 'src/app/components/user/wishlist/wishlist.component';
import { OrdersComponent } from 'src/app/components/user/orders/orders.component';
import { CheckoutComponent } from 'src/app/components/user/checkout/checkout.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AboutusComponent } from './components/footer/aboutus.component';
import { MarketreviewsComponent } from './components/footer/marketreviews.component';
import { TermsofuseComponent } from './components/footer/termsofuse.component';
import { PrivacypolicyComponent } from './components/footer/privacypolicy.component';
import { SitemapComponent } from './components/footer/sitemap.component';
import { ShippingpolicyComponent } from './components/footer/shippingpolicy.component';
import { CompensationComponent } from './components/footer/compensation.component';
import { ReturnpolicyComponent } from './components/footer/returnpolicy.component';
import { ContactusComponent } from './components/footer/contactus.component';
import { PaymentmethodsComponent } from './components/footer/paymentmethods.component';
import { ShippingguideComponent } from './components/footer/shippingguide.component';
import { LocationweshiptoComponent } from './components/footer/locationweshipto.component';
import { EstimateddeliverytimeComponent } from './components/footer/estimateddeliverytime.component';
import { MyaccountComponent } from './components/footer/myaccount.component';
import { ProductpurchaseComponent } from './components/content/productpurchase.component';
import { CartdetailsComponent } from './components/content/cartdetails.component';
import { AddressesComponent } from 'src/app/components/user/addresses/addresses.component';
import { ReviewRatingsComponent } from 'src/app/components/user/review-ratings/review-ratings.component';
import { ChangePasswordComponent } from 'src/app/components/user/change-password/change-password.component';
import { UnsubscribeComponent } from 'src/app/components/user/unsubscribe/unsubscribe.component';
import { LoginComponent } from './components/header/login/login.component';
import { SignupComponent } from './components/header/signup/signup.component';
import { MyprofileComponent } from 'src/app/components/user/myprofile/myprofile.component';
import { CouponsComponent } from 'src/app/components/content/coupons/coupons.component';
import { OrderItemDetailsComponent } from './components/content/order-item-details/order-item-details.component';

const routes: Routes = [
  {
    path: AppRoutes.Base,
    component: ContentComponent,
    pathMatch: 'full'
  },
  {
    path: AppRoutes.AppLanding,
    component: AppLandingComponent
  },
  { 
    path: AppRoutes.Content,
    component: ContentComponent
  },
  {
    path: AppRoutes.Coupons,
    component: CouponsComponent,
  },  
  {
    path: AppRoutes.UserProfile,
    component: ProfileComponent,
    canActivate: [AuthGuard] ,
    data: { 
      datepropsample: 'datavaluesample'
    } ,
    children: [
      {
        path: AppRoutes.ProfileInfo,
        component: MyprofileComponent,
        canActivate: [AuthGuard],
        pathMatch: 'full'
      },
      {
        path: AppRoutes.ProfileInfo,
        component: MyprofileComponent,
        outlet: 'profileoutlet',
        canActivate: [AuthGuard] 
      },
      {
        path: AppRoutes.UserWhishlist, 
        component: WishlistComponent,
        outlet: 'profileoutlet',
        canActivate: [AuthGuard] 
      },
      //{ path: 'balance', loadChildren: () => import(`./balance/balance.module`).then(m => m.BalanceModule) },
      {
        path: AppRoutes.UserOrders, 
        component: OrdersComponent,
        outlet: 'profileoutlet',
        canActivate: [AuthGuard] 
      },
      { path: AppRoutes.UserAddresses, 
        component: AddressesComponent ,
        outlet: 'profileoutlet',
        canActivate: [AuthGuard]
      },
      { path: AppRoutes.UserReviewAndRatings, 
          component: ReviewRatingsComponent ,
          outlet: 'profileoutlet',
          canActivate: [AuthGuard]
      },
      { path: AppRoutes.UserChangePassword, 
          component: ChangePasswordComponent ,
          outlet: 'profileoutlet',
          canActivate: [AuthGuard]
      },
      { path: AppRoutes.Unsubscribe, 
          component: UnsubscribeComponent ,
          outlet: 'profileoutlet',
          canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: AppRoutes.UserWhishlist,
    component: WishlistComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: AppRoutes.UserOrders,
    component: OrdersComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: AppRoutes.UserCheckout,
    component: CheckoutComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: AppRoutes.ProductList,
    component: ProductlistComponent
  },
  
  {
    path: AppRoutes.ProductDetails,
    component: ProductdetailsComponent
  },
  {
    path: AppRoutes.DealsList,
    component: ProductlistComponent
  },
  {
    path: AppRoutes.Aboutus,
    component: AboutusComponent,
    
  },{
    path: AppRoutes.MarketReview,
    component: MarketreviewsComponent,
    
  },{
    path: AppRoutes.TermsOfUse,
    component: TermsofuseComponent,
    
  },{
    path: AppRoutes.PrivacyPolicy,
    component: PrivacypolicyComponent,
    
  },{
    path: AppRoutes.SiteMap,
    component: SitemapComponent,
    
  },{
    path: AppRoutes.ShippingPolicy,
    component: ShippingpolicyComponent,
    
  },{
    path: AppRoutes.Compensation,
    component: CompensationComponent,
    
  },{
    path: AppRoutes.MyAccount,
    component: MyaccountComponent,
    
  },{
    path: AppRoutes.ReturnPolicy,
    component: ReturnpolicyComponent,
    
  },{
    path: AppRoutes.Contactus,
    component: ContactusComponent,
    
  },{
    path: AppRoutes.PaymentMethods,
    component: PaymentmethodsComponent,
    
  },{
    path: AppRoutes.ShippingGuide,
    component: ShippingguideComponent,
    
  },{
    path: AppRoutes.LocationWeShip,
    component: LocationweshiptoComponent,
    
  },{
    path: AppRoutes.EstimatedDeliverytime,
    component: EstimateddeliverytimeComponent,
    
  },{
    path: AppRoutes.productpurchase,
    component: ProductpurchaseComponent,
    
  },{
    path: AppRoutes.mycart,
    component: CartdetailsComponent
  },
  {
    path: AppRoutes.Login,
    component: LoginComponent
  },
  {
    path: AppRoutes.Signup,
    component: SignupComponent
  },{
    path : AppRoutes.OrderItemDetails,
    component:OrderItemDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
