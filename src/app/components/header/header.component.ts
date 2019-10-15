import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogConfig, MatMenuTrigger } from '@angular/material';
import { AuthService } from 'angularx-social-login';
import { LoginComponent } from './login/login.component';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { apirequest } from 'src/app/models/apirequest';
import { Product } from 'src/app/models/product';
import { searchreponse } from 'src/app/models/searchResponse';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { fuzzysearch } from 'src/app/models/fuzzysearch';
import { hits } from 'src/app/models/hits';
import { hitsmain } from 'src/app/models/hitsmain';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public menuFlag: boolean = false;
  public inputValue: string = '';
  // This value will be updated only after debounce
  public debouncedInputValue = this.inputValue;
  searchMoviesCtrl = new FormControl();
  filteredMovies: hits[];
  isLoading = false;
  errorMsg: string;

  @ViewChild(MatMenuTrigger, { static: false }) clickHoverMenuTrigger: MatMenuTrigger;
  openOnMouseOver() {
    this.clickHoverMenuTrigger.toggleMenu();
  }
  constructor(public dialog: MatDialog, public userservice: UserService, public _socioAuthServ: AuthService,
    public _router: Router, private http: HttpClient, private renderer: Renderer2) { }
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  options = { headers: this.headers };
  // url = 'http://34.233.128.163/api/v1/products/search/';
  url = 'http://34.233.128.163/api/v1/dashboard/fuzzysearch';
  public searchResponseObj: searchreponse;
  public products: Product[] = [];
  public hits: hits[] = [];
  public hitsMain: hitsmain;


  ngOnInit() {
    this.userservice.response = JSON.parse(sessionStorage.getItem("f_login_form"));
    this.searchMoviesCtrl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.filteredMovies = this.hits;
        }),
        switchMap(value => this.http.post(this.url, { "countryCode": "us", "categoryName": "none", "searchquery": value.toLowerCase() }, this.options)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((data: fuzzysearch) => {
        this.hitsMain = data.hits;
        this.filteredMovies = this.hitsMain.hits;
        console.log(this.filteredMovies);
      });
  }

  public search() {
    this.http.post(this.url, { "countryCode": "us", "categoryName": "apparel", "searchquery": this.searchMoviesCtrl.value }, this.options).subscribe((results: searchreponse) => {
      this.products = results.responseObjects;
    });
  }

  funSignIn() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.height = '600px';
    this.dialog.open(LoginComponent, dialogConfig);
  }
  signOut(): void {
    this._socioAuthServ.signOut();
    this.userservice.response = null;
    sessionStorage.removeItem("f_login_form");
  }
  gotoHomePage() {
    this._router.navigate(['/']);
  }
  toggleMenu() {
    this.menuFlag = !this.menuFlag;
  }
}
