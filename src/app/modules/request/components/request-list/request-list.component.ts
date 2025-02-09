import {Component, Input, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {RequestService} from "../../services/request.service";
import {CollectionRequest} from "../../models/request.model";
import {RequestFormComponent} from "../request-form/request-form.component";

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    RequestFormComponent
  ],
  templateUrl: './request-list.component.html',
  styleUrl: './request-list.component.scss'
})
export class RequestListComponent  implements OnInit{
  name: string = 'John Doe';
  requestsCount: number = 0;
  searchControl = new FormControl('');
  requests: any[] = [];
  originalRequests: any[] = [];
  showModal: boolean = false;
  selectedRequest: CollectionRequest | null = null;
  activeType: string = 'all';
  types = ['plastic', 'paper', 'glass', 'metal'];
  @Input() user!: any;

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.getAllRequests();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.searchRequests(value || '');
    });
  }

  openModal() {
    this.showModal = true;
    this.selectedRequest = null;
  }

  private getAllRequests() {
    this.activeType = 'all';
    this.requestService.getRequests().subscribe(requests => {
      this.requests = requests;
      this.originalRequests = requests;
      this.requestsCount = requests.length;
    });
  }

  private searchRequests(s: string) {
    if (!s.trim()){
      this.requests = [...this.originalRequests];
      return;
    }

    const search = s.toLowerCase();
    this.requests = this.originalRequests.filter(request => {
      return request.address.toLowerCase().includes(search) || request.notes.toLowerCase().includes(search) || request.status.toLowerCase().includes(search);
    });
  }

  editRequest(request : CollectionRequest): void {
    this.selectedRequest = request;
    this.showModal = true;
  }

  onCloseModal() {
    this.showModal = false;
  }

  deleteRequest(id: string) {
    confirm('Are you sure you want to delete this request?') && this.requestService.deleteRequest(id).subscribe(() => {
      this.getAllRequests();
    });
  }

  filterRequests(type: string) {
    this.activeType = type;
    this.requests = this.originalRequests.filter(request =>
     request.status.toLowerCase() === type.toLowerCase() || type === 'all'
    )
  }

  async onSaveRequest({ requestData, wastePhoto }: { requestData: CollectionRequest, wastePhoto: File | null }) {
    try {
      if (!this.selectedRequest) {
        if (wastePhoto) {
          requestData.photos = await this.requestService.storeImage(wastePhoto);
        }
        this.requestService.addRequest(requestData).subscribe(() => {
          this.getAllRequests();
          this.showModal = false;
        });
      } else {
        requestData.id = this.selectedRequest.id;
        if (wastePhoto) {
          requestData.photos = await this.requestService.storeImage(wastePhoto);
        }
        this.requestService.updateRequest(requestData).subscribe(() => {
          this.getAllRequests();
          this.showModal = false;
        });
      }
    } catch (error) {
      console.error('Error saving the request:', error);
    }
  }

}
