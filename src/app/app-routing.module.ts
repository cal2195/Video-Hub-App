import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideoPlayerComponent } from './components/home/videoplayer/videoplayer.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'video',
        component: VideoPlayerComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
