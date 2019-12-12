import { Component, OnInit } from '@angular/core';
import { IMaps } from './models/IMaps';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttCommonService } from './services/httpcommon.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = "DBUI";
  imapsObj: IMaps;
  error: any;
  public listOfWhitelistAPIS: string[] = environment.WHITELIST_IPS.split(',');
  public isWhitelisted = false;
  public isloader = true;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;

  constructor(public _router: Router, private httpService: HttCommonService) { }

  ngOnInit() {
    this.httpService.getMapsServiceImaps()
      .subscribe(
        (data: IMaps) => {
          this.imapsObj = data;
          console.log("My ip is ", this.imapsObj.ip);
          console.log("Result ,", this.listOfWhitelistAPIS.some(e => e === this.imapsObj.ip));
          console.log("Country name ",this.imapsObj.country_name);
          this.isloader = false;
          if (this.imapsObj.country_name == "United States" || this.imapsObj.country_name == "Canada"
            || (this.listOfWhitelistAPIS.some(e => e === this.imapsObj.ip))) {
            this.isWhitelisted = true;
          }
        },
        error => this.error = error
      );
  }
}
