import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { Cava01Component }       from "./pages/cava01/cava01.component";
import { Maze01Component }       from "./pages/maze01/maze01.component";
import { Scene01Component }      from "./pages/scene01/scene01.component";
import { Terrain01Component }    from "./pages/terrain01/terrain01.component";
import { TunnelTool01Component } from "./pages/tunneltool01/tunneltool01.component";
import { WelcomeComponent }      from './pages/welcome/welcome.component';
import { DashboardComponent }    from './pages/dashboard/dashboard.component';


const routes: Routes = [
    { path: '', component: WelcomeComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'scene01', component: Scene01Component},
    { path: 'terrain01', component: Terrain01Component},
    { path: 'cava01', component: Cava01Component},
    { path: 'maze01', component: Maze01Component},
    { path: 'tunneltool01', component: TunnelTool01Component},

];

/*
    http://sigpac.gva.es/visor/
    Zona urbanizacion
    http://sigpac.gva.es/visor/?&visible=Inicio-SigPac;1/2.000.000;1/200.000;Ortofotos;1/25.000&x=-58499.00&y=4775459.00&level=18&srid=3857
    Parcela SIGPAC Urbanizacion
    http://sigpac.gva.es/visor/?&visible=ortofotoICV_2017;Inicio-SigPac;1/2.000.000;1/200.000;1/25.000;Recinto;Parcela&x=-58526.00&y=4775472.00&level=18&srid=3857

    Video Sacar coordenadas de croquis de recinto
    https://www.youtube.com/watch?v=atO_ntuBZ8M

http://sigpac.gva.es/18serviciosvisor/LayerInfo.aspx?layer=parcela&id=46,196,0,0,3,9000

https://mygeodata.cloud/result

http://kmltools.appspot.com/geoconv


 */
/*

<!-- northmost -->

<utmpoint>
 <datum>ETRS89</datum>
 <zone>30</zone>
 <x>713.286,07</x>
 <y>4.361.271,03</y>
</utmpoint>
<utmpoint>
 <datum>ETRS89</datum>
 <zone>30</zone>
 <x>713.309,05</x>
 <y>4.361.259,68</y>
</utmpoint>
<utmpoint>
 <datum>ETRS89</datum>
 <zone>30</zone>
 <x>713.318,34</x>
 <y>4.361.241,05</y>
</utmpoint>
<utmpoint>
 <datum>ETRS89</datum>
 <zone>30</zone>
 <x>713.275,01</x>
 <y>4.361.202,09</y>
</utmpoint>

<!-- curva -->
<utmpoint>
 <datum>ETRS89</datum>
 <zone>30</zone>
 <x>713.252,80</x>
 <y>4.361.236,49</y>
</utmpoint>
<utmpoint>
 <datum>ETRS89</datum>
 <zone>30</zone>
 <x>713.253,47</x>
 <y>4.361.245,72</y>
</utmpoint>
<utmpoint>
 <datum>ETRS89</datum>
 <zone>30</zone>
 <x>713.265,87</x>
 <y>4.361.248,83</y>
</utmpoint>
<utmpoint>
 <datum>ETRS89</datum>
 <zone>30</zone>
 <x>713.278,22</x>
 <y>4.361.253,77</y>
</utmpoint>
<utmpoint>
 <datum>ETRS89</datum>
 <zone>30</zone>
 <x>713.281,33</x>
 <y>4.361.258,46</y>
</utmpoint>

<!-- northmost -->
<utmpoint>
 <datum>ETRS89</datum>
 <zone>30</zone>
 <x>713.285,15</x>
 <y>4.361.271,00</y>
</utmpoint>
 */



@NgModule(
    {
        imports: [ RouterModule.forRoot( routes ) ],
        exports: [ RouterModule ]
    } )
export class AppRouters {}
