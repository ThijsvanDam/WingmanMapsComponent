import { DynamicMapComponent } from './dynamic-map/dynamic-map.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'map', component: DynamicMapComponent},
  { path: '', redirectTo: '/map', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
