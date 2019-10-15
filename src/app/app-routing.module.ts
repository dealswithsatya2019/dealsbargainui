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
import { DealslistComponent } from 'src/app/components/content/dealslist/dealslist.component';
import { AuthGuard } from 'src/app/guards/auth.guard';


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
    path: AppRoutes.UserProfile,
    component: ProfileComponent,
    canActivate: [AuthGuard] ,
    data: { 
      datepropsample: 'datavaluesample'
    } 
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
    component: ProductlistComponent,
    canActivate: [AuthGuard] 
  },
  
  {
    path: AppRoutes.ProductDetails,
    component: ProductdetailsComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: AppRoutes.DealsList,
    component: DealslistComponent,
    canActivate: [AuthGuard] 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
