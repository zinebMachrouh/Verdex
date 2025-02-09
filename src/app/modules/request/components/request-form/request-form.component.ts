import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
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
export class RequestFormComponent {
  @Input() types: string[] = [];
  @Input() isVisible = false;
  @Input() request: CollectionRequest | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ requestData: CollectionRequest, wastePhoto: File | null }>();

  requestForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder) {
    this.requestForm = this.fb.group({
      types: ['', Validators.required],
      weight: ['', Validators.required],
      address: ['', Validators.required],
      schedule: ['', Validators.required],
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
    if (this.requestForm.valid) {
      const requestData = this.requestForm.value;
      this.save.emit({ requestData, wastePhoto: this.selectedFile });
    }
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
