import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavComponent } from './nav';
import { FooterComponent } from './footer';
import { NoContentComponent } from './no-content';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    NavComponent,
    FooterComponent,
    NoContentComponent,
    CommonModule
  ],
  declarations: [
    NavComponent,
    FooterComponent,
    NoContentComponent
  ],
})
export class CoreModule { }
