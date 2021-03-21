import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const usersModule = () => import('./users/users.module').then(x => x.UsersModule);

const routes: Routes = [
    
    { path: '', loadChildren: usersModule },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }