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
    component: ProfileComponent
  },
  {
    path: AppRoutes.UserWhishlist,
    component: WishlistComponent
  },
  {
    path: AppRoutes.UserOrders,
    component: OrdersComponent
  },
  {
    path: AppRoutes.UserCheckout,
    component: CheckoutComponent
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
    component: DealslistComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
