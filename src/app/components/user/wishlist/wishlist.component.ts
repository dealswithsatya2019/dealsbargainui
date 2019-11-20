import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  @Input() public actionType : string = 'list';
  constructor() { }

  ngOnInit() {
  }

}
