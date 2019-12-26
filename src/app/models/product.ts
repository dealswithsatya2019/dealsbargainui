export class Product {
    product_id: string;
    item_id: string;
    title: string;
    condition: string;
    item_name: string;
    item_sku: string;
    price: number;
    deal_price: string;
    discount: string;
    category: string;
    subcategory: string;
    image: string;
    brand_name: string;
    description: string;
    date: string;
    others: string;
    dealtype: string;
    master_suplier: string;
    deal_type: string ="0";
    supplier_deal_price : string ="";
    discount_amount: number;
    quantity : number = 0;
    ship_cost : number  = 0;
    custom_price : number  = 0;
    prepay_price : number = 0;
    cart_id : string = "";
    deals_bargain_supplier_deal_price: string ="";
    deals_bargain_deal_price: number;
    wishlistId: string ="";
    display_name_category: string ="";
    display_name_subcategory: string ="";
    display_name_middle_subcategory: string ="";
    errorCode : number ;
    errorMsg : string = "";
    transaction_fees : number;
 }