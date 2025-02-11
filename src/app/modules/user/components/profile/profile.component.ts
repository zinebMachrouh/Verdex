import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ProfileService } from "../../services/profile.service";
import { Clipboard } from "@angular/cdk/clipboard";
import { v4 as uuidv4 } from 'uuid';
import {RequestService} from "../../../request/services/request.service";
import {AuthService} from "../../../auth/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnChanges {
  @Input() isVisible: boolean = false;
  @Input() user!: any;
  @Input() requests: any[] = [];
  @Output() close = new EventEmitter<void>();

  profileForm: FormGroup;
  points: number = 0;
  voucherCode: string | null = null;
  isUser: boolean = false;

  conversions = [
    { points: 100, value: 50 },
    { points: 200, value: 120 },
    { points: 500, value: 350 }
  ];

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private requestsService: RequestService,
    private authService: AuthService,
    private clipboard: Clipboard,
    private route: Router
  ) {
    this.profileForm = this.fb.group({
      name: [''],
      email: [''],
      phone: [''],
      address: [''],
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && this.user) {
      this.profileForm.patchValue(this.user);
    }

    this.points = this.user.points;
    if (this.user.role === 'user') {
      this.isUser = true;
    } else {
      this.isUser = false;
    }
  }

  onClose() {
    this.close.emit();
  }

  convertPoints(pointsRequired: number, voucherValue: number) {
    if (this.points >= pointsRequired) {
      this.voucherCode = uuidv4();

      this.profileService.convertPoints(this.user.id, pointsRequired).then(() => {
        this.profileService.getUserProfile(this.user.id).then(user => {
          this.user = user;
          sessionStorage.setItem('currentUser', JSON.stringify(user));
        });
        alert(`You have redeemed a voucher worth ${voucherValue} Dh! Your voucher code is: ${this.voucherCode}`);
      });

    } else {
      alert('Not enough points to redeem this voucher.');
    }
  }


  onUpdate() {
    this.profileService.updateProfile(this.user.id, this.profileForm.value).then(() => {
      this.close.emit();
      this.profileService.getUserProfile(this.user.id).then(user => {
        this.user = user;
        sessionStorage.setItem('currentUser', JSON.stringify(user));
      });
    });
  }

  onDelete() {
    if (confirm('Are you sure you want to delete your account?')) {
      this.profileService.deleteUserProfile(this.user.id).then(() => {
        this.close.emit();
        this.requestsService.getRequests().subscribe(requests => {
          requests.filter(request => request.userId === this.user.id).forEach(request => {
            // @ts-ignore
            this.requestsService.deleteRequest(request.id).subscribe();
          });
        });
        this.authService.logout();
        this.route.navigate(['/login']);
      });
    }
  }
}
