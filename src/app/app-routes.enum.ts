export class AppRoutes{
    static readonly Base = '';
    static readonly AppLanding = 'applanding';
    static readonly Login='login';
    static readonly Signup='login/signup';
    static readonly Content='home';
    static readonly ProductList='product/:cname/:scname';
    static readonly ProductDetails='productdetails/:cname/:scname/:pid';
    static readonly DealsList='dealslist/:dealtype';
    static readonly UserProfile = 'myprofile';
    static readonly ProfileInfo = 'profileinfo';
    static readonly UserPersonalInfo = 'personalinfo';
    static readonly UserOrders ='orders';
    static readonly UserWhishlist ='wishlist';
    static readonly UserAddresses ='addresses';
    static readonly UserReviewAndRatings ='review-ratings';
    static readonly UserChangePassword ='change-passowrd';
    static readonly UserCheckout = 'checkout';
    static readonly Coupons = 'coupons';
    static readonly Unsubscribe ='unsubscribe';
    static readonly Aboutus = 'aboutus';
    static readonly MarketReview = 'marketreview';
    static readonly TermsOfUse = 'termsofuse';
    static readonly PrivacyPolicy = 'privacypolicy';
    static readonly SiteMap = 'sitemap';
    static readonly ShippingPolicy = 'shippingpolicy';
    static readonly Compensation = 'compensation';
    static readonly MyAccount = 'myaccount';
    static readonly ReturnPolicy = 'returnpolicy';
    static readonly PaymentMethods = 'paymentmethods';
    static readonly ShippingGuide = 'contactus';
    static readonly productpurchase = 'productpurchase';
    static readonly mycart = 'mycart';
    static readonly LocationWeShip = 'locationweship';
    static readonly EstimatedDeliverytime = 'estimateddeliverytime';
    static readonly OrderItemDetails = 'odp/:orderid/:countryname';
    
}