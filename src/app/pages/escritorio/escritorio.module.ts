import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { EscritorioPageRoutingModule } from './escritorio-routing.module';

import { EscritorioPage } from './escritorio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EscritorioPageRoutingModule
  ],
  declarations: [EscritorioPage]
})
export class EscritorioPageModule {}
