import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ProfileService} from "../../services/profile.service";
import {Clipboard} from "@angular/cdk/clipboard";
import {v4 as uuidv4} from 'uuid';

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
export class ProfileComponent {
  @Input() isVisible: boolean = false;
  @Input() user!: any;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  profileForm: FormGroup;
  points: number = 0;
  voucherCode: string | null = null;

  conversions = [
    { points: 100, value: 50 },
    { points: 200, value: 120 },
    { points: 500, value: 350 }
  ];

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private clipboard: Clipboard
  ) {
    this.profileForm = this.fb.group({
      name: [''],
      email: ['']
    });

  }


  onUpdate() {

  }

  onDelete() {

  }

  convertPoints(pointsRequired: number, voucherValue: number) {
    if (this.points >= pointsRequired) {
      this.points -= pointsRequired;
      this.voucherCode = uuidv4();
      alert(`You have redeemed a voucher worth ${voucherValue} Dh!`);
    } else {
      alert('Not enough points to redeem this voucher.');
    }
  }

  copyToClipboard() {
    if (this.voucherCode) {
      this.clipboard.copy(this.voucherCode);
      alert('Voucher code copied to clipboard!');
    }
  }
}
