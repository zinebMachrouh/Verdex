import { Component } from '@angular/core';
import {RequestListComponent} from "../../../modules/request/components/request-list/request-list.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RequestListComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
