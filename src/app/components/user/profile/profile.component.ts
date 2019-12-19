import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{ //,AfterViewInit {

  constructor(public userservice : UserService,
    public _socioAuthServ: AuthService,
    public _router: Router) { }
  //css : "3px double yellow";
  ngOnInit() {
    
    /*
    this.router.navigate([
  // NOTE: No relative-path navigation is required because we are accessing
  // the parent's "activatedRoute" instance. As such, this will be executed
  // as if we were doing this in the parent view component.
  {
    outlets: {
      editArea: ['addRootPartner']
    }
  }
],
  {
    relativeTo: this.activatedRoute.parent // <--- PARENT activated route.
  }
);
    */
  }

  /*ngAfterViewInit(){
    this._router.navigate(['myprofile', { outlets: { 'profileoutlet': ['profileinfo'] } }]);
  }*/


  funUpdate() {
    console.log(JSON.stringify(this.userservice.form.value));
    this.userservice.response = JSON.parse(JSON.stringify(this.userservice.form.value));
  }
}
