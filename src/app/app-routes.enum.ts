export class AppRoutes{
    static readonly Base = '';
    static readonly AppLanding = 'applanding';
    static readonly Login='login';
    static readonly Content='content';
    static readonly ProductList='productlist/:cname/:scname';
    static readonly ProductDetails='productdetails/:productname';
    static readonly DealsList='dealslist/:dealtype';
    static readonly UserProfile = 'myprofile';
    static readonly UserOrders ='orders';
    static readonly UserWhishlist ='wishlist';
    static readonly UserCheckout = 'checkout';
}