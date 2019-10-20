import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-productdetails',
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.scss']
})
export class ProductdetailsComponent implements OnInit {

  constructor(private _Activatedroute: ActivatedRoute, public _productservice: ProductService,public _router: Router,public dialog: MatDialog) { }
  productname: any;
  scname: any;
  sub;
  products: any[];
  ngOnInit() {
    this.sub = this._Activatedroute.paramMap.subscribe(params => {
      this.productname = params.get('productname');
      this._productservice.getProductlist(this.productname, "", 'us', 0, 20).subscribe(
        data => {
          const arr = [];
          data.responseObjects.forEach((productDet) => {
            const obj = {};
            obj['name'] = productDet.item_name;
            obj['image_uri'] = "https://d1k0ppjronk6up.cloudfront.net/products/1529/images_b75_image2_844.jpg";
            obj['actual_price'] = productDet.custom_price;
            obj['offer_price'] = productDet.prepay_price;
            arr.push(obj);
          });
          this.products = arr;
        });
    });

  }

  // products =[{"date":"2019-10-01 07:26:14","supliercategory":"7912:=Catalog||8336:=Electronics & computer||8384:=Computer||8400:=Laptops and Notebooks","suplier_name":"1000000815","description":"EMC for 14+2 configuration - solid state drive - 1.6 TB - SAS 6Gb/s","title":"EMC for 14+2 configuration - solid state drive - 1.6 TB - SAS 6Gb/s","min_street_price":0.0,"price":12668.17,"product_id":19285933,"msrp":12403.19,"suplier_id":1000000815,"map":0.0,"ship_cost":8.66,"image_uri":"https://d1k0ppjronk6up.cloudfront.net/products/1000000815/0c_b3_0cb3099a_d11c_4a71_85d6_7093dba32b82.jpg","supplier_deal_price":0.0,"item_id":44373198,"actual_price":12668.17,"name":"EMC for 14+2 configuration - solid state drive - 1.6 TB - SAS 6Gb/s","brand_name":"EMC","message":"CSVRecord [comment=null, mapping=null, recordNumber=244965, values=[19285933, 44373198, 20, in-stock, available, EMC for 14+2 configuration - solid state drive - 1.6 TB - SAS 6Gb/s, EMC for 14+2 configuration - solid state drive - 1.6 TB - SAS 6Gb/s, 5.00, 8.66, 0.00, 12668.17, 12668.17, 12306.22, , 12403.19, , , , HL6FM1600FBT1, HL6FM1600FBT1, HL6FM1600FBT1, , , , , EMC, EMC, 0, 1000000815, Refurb Factory LLC, 7912:=Catalog||8336:=Electronics & computer||8384:=Computer||8400:=Laptops and Notebooks, Primary:0c_b3_0cb3099a_d11c_4a71_85d6_7093dba32b82.jpg:75:75, 0, 0, 0.00, 0.00, 0.00, 2.02, 12.02, 6.02, 12.02, 1.01, 0.00, 0.00, 0.00, 0, , 0, , 0, 2019-02-01 15:27:39.0, 2019-05-29 19:46:37.0, , , 2019-02-01 15:27:39.0, 2019-05-29 19:46:37.0, 2017-09-07 16:01:18.0, 2017-09-07 16:01:18.0, 2019-02-01 15:27:39.0, 2019-05-29 19:46:37.0, 0, US, new, , , , EMC for 14+2 configuration - solid state drive - 1.6 TB - SAS 6Gb/s, ]]","master_suplier":"doba","offer_price":12306.22,"category":"Electronics & computer","subcategory":"Computer","drop_ship_fee":5.0,"status":"in-stock"}];

  showProductDetails(){

    
  }

}
