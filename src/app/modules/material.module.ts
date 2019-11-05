import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  MatToolbarModule,
  MatMenuModule,
  MatButtonModule, 
  MatIconModule, 
  MatSidenavModule,
  MatListModule, 
  MatSliderModule,
  MatSlideToggleModule,
  MatNativeDateModule,
  MatTooltipModule
} from  '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatBadgeModule} from '@angular/material/badge';
import {MatStepperModule} from '@angular/material/stepper'; 

const MaterialComponents = [
  MatToolbarModule,
  MatMenuModule,
  MatButtonModule, 
  MatIconModule, 
  MatSidenavModule,
  MatListModule, 
  MatSliderModule,
  MatTooltipModule,
  MatSlideToggleModule,MatButtonModule,MatDialogModule,MatFormFieldModule,
  MatInputModule,MatGridListModule,MatRadioModule,MatSelectModule,MatDatepickerModule,
  MatNativeDateModule,MatCheckboxModule,MatExpansionModule,MatBadgeModule,MatStepperModule
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MaterialComponents,
    MatAutocompleteModule
  ],
  exports:[
    MaterialComponents,
    MatAutocompleteModule
  ]
  
})
export class MaterialModule { }
