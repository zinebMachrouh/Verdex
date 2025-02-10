import { Component } from '@angular/core';
import {RequestListComponent} from "../../../modules/request/components/request-list/request-list.component";
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from "../../../modules/auth/services/auth.service";
import {resolve} from "@angular/compiler-cli";
import {userResolver} from "../../../modules/auth/resolvers/user.resolver";
import {$locationShim} from "@angular/common/upgrade";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RequestListComponent,
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  user : any;

  constructor(private authService: AuthService, private router : Router, private route: ActivatedRoute) {
    this.user = this.route.snapshot.data['user'];
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
