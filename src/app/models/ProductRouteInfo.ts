export class ProductRouteInfo {
    cname: string;
    scname: string;
    productId: string;
    constructor(public _cname:string,public _scname:string,public _productId:string){
        this.cname = _cname;
        this.scname = _scname;
        this.productId = _productId;
    }
}