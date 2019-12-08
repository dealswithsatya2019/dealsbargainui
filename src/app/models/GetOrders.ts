import { Product } from './product';

export class GetOrederReq {

    order_tracking_id: string = "";
    id: string = "";
    user_id: number;
    address_id: string = "";
    net_amount: number;
    transaction_fee: number;
    coupon_applied: string = "";
    coupon_id: string = "";
    payment_channel: string = "";
    order_id_by_payment_channel: string = "";
    payment_channel_description: string = "";
    user_payment_request_status: string = "";
    user_payment_request_date: string = "";
    created_on: string = ""
    items_info: Product[];

}