import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CollectionRequest} from "../../models/request.model";
import {NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-request-form',
  standalone: true,
  templateUrl: './request-form.component.html',
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgClass,
    NgForOf
  ],
  styleUrls: ['./request-form.component.scss']
})
export class RequestFormComponent implements OnChanges{
  @Input() types: string[] = [];
  @Input() isVisible = false;
  @Input() currentPendingRequests: CollectionRequest[] = [];
  @Input() request: CollectionRequest | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ requestData: CollectionRequest, wastePhoto: File | null }>();

  requestForm: FormGroup;
  selectedFile: File | null = null;

  maxRequestsAllowed = 3;
  totalWeightLimit = 10_000;

  constructor(private fb: FormBuilder) {
    this.requestForm = this.fb.group({
      types: ['', Validators.required],
      weight: ['',  [Validators.required, Validators.min(1000), Validators.max(this.totalWeightLimit)]],
      address: ['', Validators.required],
      schedule: ['',  [Validators.required, this.validateTimeSlot.bind(this)]],
      photos: [''],
      notes: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['request'] && this.request) {
      this.requestForm.patchValue(this.request);
    }
  }

  onCheckboxChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const types = this.requestForm.get('types')?.value || [];
    if (checkbox.checked) {
      types.push(checkbox.value);
    } else {
      const index = types.indexOf(checkbox.value);
      if (index > -1) types.splice(index, 1);
    }
    this.requestForm.get('types')?.setValue(types);
  }

  closeModal(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.requestForm.invalid || this.checkMaxRequests() || this.checkMaxWeightExceeded()) {
      return;
    }

    if (this.requestForm.valid) {
      const requestData = this.requestForm.value;
      this.save.emit({ requestData, wastePhoto: this.selectedFile });
      this.requestForm.reset();
    }
  }

  private checkMaxRequests(): boolean {
    const activeRequests = this.currentPendingRequests.filter(
      req => req.status === 'pending' || req.status === 'rejected'
    ).length;

    console.log(activeRequests);

    if (activeRequests >= this.maxRequestsAllowed) {
      alert(`Maximum of ${this.maxRequestsAllowed} active requests allowed.`);
      return true;
    }
    return false;
  }

  private checkMaxWeightExceeded(): boolean {
    const currentWeight = this.currentPendingRequests.reduce((sum, req) => sum + (req.weight || 0), 0);
    const newWeight = currentWeight + this.requestForm.get('weight')?.value;

    if (newWeight > this.totalWeightLimit) {
      alert(`Total weight cannot exceed ${this.totalWeightLimit} grams.`);
      return true;
    }
    return false;
  }

  private validateTimeSlot(control: any): boolean | null {
    const schedule = new Date(control.value);
    const currentDate = new Date();

    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(currentDate.getDate() + 1);

    if (schedule < tomorrow) {
      alert('The schedule date must be from tomorrow onward.');
      return false;
    }

    const hours = schedule.getHours();
    if (hours < 9 || hours > 18 || (hours === 18 && schedule.getMinutes() > 0)) {
      alert('The schedule time must be between 09:00 AM and 06:00 PM.');
      return false;
    }

    return true;
  }


  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }
}
