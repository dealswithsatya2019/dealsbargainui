import { KeyValuePair } from 'src/app/models/KeyValuePair';

export class ProductDetails {
    product_id:number =-1;
    item_id: number =-1;
    title: string = '';
    item_name: string ='';
    status: string ='';
    drop_ship_fee: string = ''; //0.00
    ship_cost: string =''; //11.67
    price: number; //31.67
    custom_price: string =''; //31.67
    prepay_price: string =''; //30.75
    min_street_price: string =''; // 0.00
    msrp: string =''; //71.40
    supplier_deal_price: string =''; // 0.00
    supplier_deal_startdate: string =''; //"2019-10-29 03:08:43",
    supplier_deal_enddate: string =''; //"2019-10-29 03:08:43",
    master_suplier: string =''; //"doba",
    category: string =''; //"Electronics & computer",
    subcategory: string =''; //"General",
    image: string =''; //"https://d1k0ppjronk6up.cloudfront.net/products/2155/images_4x3_large_m_t_MT623.jpg",
    thumbnail_image: string[] =[]; //"",
    brand_name: string =''; //"bulk buys",
    suplier_id: string =''; //2155,
    suplier_name: string =''; //"2155",
    supliercategory: string =''; //"7912:=Catalog||8336:=Electronics & computer||2168394:=General",
    discount: string =''; //"0.00",
    discount_amount: number; //"0.00",
    description: string =''; //"These bright tacks are sure to draw attention to important items on a bulletin board. Package contains 40 1/4" round thumb tacks in bright yellow.",
    product_sku: string =''; //"MT623",
    item_sku: string =''; //"MT623~60",
    mpn: string =''; //"",
    upc: string =''; //"802062514149",
    isbn: string =''; //"0000000000000",
    manufacturer: string =''; //"",
    case_pack_quantiy: number=0; //16000,
    country_of_origin: string =''; //"",
    condition: string =''; //"new",
    warranty: string =''; //"2 years",
    details: string =''; //"",
    attributes: string =''; //"Case Pack:=Y||Case Quantity:=60||Colors:=yellow||Materials:=metal",
    other: string =''; //"",
    date: string =''; //"2019-10-29 03:08:43"
    qty_avail : string ='';
    cart_id :string ='';
    map :string ='';
    quantity :string ='';
    message:string ='';
    created_on :string ='';
    fuzzy_title :string ='';
    product_attributes: Array<KeyValuePair> =[];
    dealtype: string ='';
    deal_price: string = ''; 
    deals_bargain_supplier_deal_price: number;
    deals_bargain_deal_price: number;
    display_name_category: string ='';
    display_name_middle_subcategory: string = '';
    display_name_subcategory: string = '';
}