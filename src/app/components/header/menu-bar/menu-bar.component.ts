import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
// import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @ViewChild(MatMenuTrigger, { static: false }) HoverMenuTrigger: MatMenuTrigger;
  openOnMouseOver() {
    this.HoverMenuTrigger.toggleMenu();
  }
  
  menus = [
    {
      cname: "Apparel",
      scnames: ["Accessories", "Apparel", "Jewelry & watches", "Shoes"]
    },
    {
      cname: "Automotive",
      scnames: ["Law enforcement", "Industrial", "Food service", "Automotive", "Office maintenance", "Janitorial & lunchroom", "Business", " Tool"]
    },
    {
      cname: "Books",
      scnames: ["Computers", " Art", " Self-help", "Cooking", "House  &  home", "Architecture", "Reference", "Calendar", "Magazines", "Blank book/journal/diary", "Mathematics", "Sports  &  recreation", "Non-classifiable", "Biography  &  autobiography", "Accessories", "Education", "Technology", "Games", "Juvenile diary", "blank book", "journal", "Crafts  &  hobbies", "Gardening"]
    },

    {
      cname: "Electronics",
      scnames: ["Home automation & security", "Furniture", "stands & mounts", "Tv & video", "Office electronics", "Clocks/Clock Radio", "Camera & photo", "Home audio", "Two-way", "scanners & monitors", "Automotive electronics", "Optics", "Speakers", "Portable audio & video", "Office products & supplies", "Gps", "Batteries", "Ipod", "mp3 & media players", "Headphones", "Accessories", "Marine", "Computer", "General", "Cell Phones & Accessories", "iPad", "Tablets", "eReaders", "Phone & telecom"]
    },
    {
      cname: "Games & Movies & Music",
      scnames: ["Video games", "Video", "Music"]
    },
    {
      cname: "Health",
      scnames: ["Hair", "Vitamins & supplements", "Cosmetics & makeup", "Nutrition", "Adult-Mature", "Bath & shower", "Skincare", "Massage & relaxation", "Natural", "homeopathic & alternative", "Gift Sets", "Exercise equipment", "Green tea healthcare", "Sexual Wellness", "Healthcare", "Perfume & fragrances", "Personal appliance & tools", "Shavers & hair removal"]
    },
    {
      cname: "Home & Garden",
      scnames: ["Hair", "Vitamins & supplements", "Cosmetics & makeup", "Nutrition", "Adult-Mature", "Bath & shower", "Skincare", "Massage & relaxation", "Natural", "homeopathic & alternative", "Gift Sets", "Exercise equipment", "Green tea healthcare", "Sexual Wellness", "Healthcare", "Perfume & fragrances", "Personal appliance & tools", "Shavers & hair removal"]
    },
    {
      cname: "Toys",
      scnames: ["Kid & baby", "Toy"]
    },
    {
      cname: "Sports",
      scnames: ["Camping & hiking", "Cycling & wheel sports", "Lawn games", "Fencing", "Tennis & racquet sports", "Badminton", "Electronics", "Water polo", "Game room", "Wrestling", "Sports medicine", "Cricket", "Martial arts", "Archery", "Swimming", "Motor sports", "General sports", "Cheerleading", "Skating", "Golf", "Boxing", "Volleyball", "Bowling", "Snowshoeing", "Pilates", "Kayaking", "Surfing", "Baseball", "Running", "Yoga", "Row", "Softball", "Water sports", "Equestrian sports", "Climbing", "Airsoft", "Fishing", "Sports electronics & gadgets", "Basketball", "Boating", "Accessories", "Paintball", "Diving", "Disc sports", "Gymnastics", "Hunting", "Hockey", "Soccer", "Snow skiing", "Fan gear", "Snowmobiling", "Football", "Rv equipment", "Track & field", "Skateboarding", "Exercise & fitness", "Ballet & dance"]
    }
  ];
}
