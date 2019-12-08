import { OrderItenInfo } from '../modules/OrderItemInfo';

export class CreateOrederReq {

    public address_id: string;
    public net_amount: number;
    public transaction_fee: number;
    public coupon_applied: string;
    public coupon_id: string;
    public payment_channel: string;
    public order_id_by_payment_channel: string;
    public payment_channel_description : string;
    public user_payment_request_status : string;
    items_info: OrderItenInfo[];

}