export class ProductRouteInfo {
    cname: string;
    scmenuname: string;
    scname: string;
    pid: string;
    constructor(public params: any){
        if(params.cname!=undefined){
            this.cname = params.cname;
        }
        
        if(params.scmenuname!=undefined){
            this.scmenuname = params.scmenuname;
        }
        
        if(params.scname!=undefined){
            this.scname = params.scname;
        }
        
        if(params.pid!=undefined){
            this.pid = params.pid;
        }
    }
    
}