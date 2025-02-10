import {Component, Input, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {RequestService} from "../../services/request.service";
import {CollectionRequest} from "../../models/request.model";
import {RequestFormComponent} from "../request-form/request-form.component";
import {RequestCardComponent} from "../request-card/request-card.component";
import {ProfileComponent} from "../../../user/components/profile/profile.component";

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    RequestFormComponent,
    RequestCardComponent,
    NgClass,
    ProfileComponent,
    ProfileComponent
  ],
  templateUrl: './request-list.component.html',
  styleUrl: './request-list.component.scss'
})
export class RequestListComponent  implements OnInit{
  requestsCount: number = 0;
  searchControl = new FormControl('');
  requests: any[] = [];
  originalRequests: any[] = [];
  showModal: boolean = false;
  selectedRequest: CollectionRequest | null = null;
  activeType: string = 'all';
  types = ['plastic', 'paper', 'glass', 'metal'];
  user: any;
  isUser: boolean = false;
  currentPendingRequests: CollectionRequest[] = [];
  showProfile: boolean = false;

  constructor(private requestService: RequestService) {
    this.user = JSON.parse(<string>sessionStorage.getItem('currentUser'));
    this.getAllRequests();

    if (this.user.role === 'user') {
      this.isUser = true;
    }else {
      this.isUser = false;
    }
  }

  ngOnInit(): void {

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

  protected getAllRequests() {
    this.activeType = 'all';
    this.requestService.getRequests().subscribe(requests => {
      if (this.user.role === 'user') {
        this.requests = requests.filter(request => request.userId === this.user.id);
        this.currentPendingRequests = this.requests.filter(request => request.status === 'pending' && request.userId === this.user.id);
        this.originalRequests = [...this.requests];
        this.requestsCount = this.requests.length;
      }else{
        this.requests = requests.filter(request => {
          const userAddress = this.user.address.toLowerCase();
          const requestAddress = request.address.toLowerCase();

          return userAddress.split(', ').some((segment: string) => requestAddress.includes(segment));
        });
        console.log('requests:',requests);
        console.log(this.user.address);
        this.originalRequests = [...this.requests];
        this.requestsCount = this.requests.length;
      }
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
     request.types.includes(type) && request.userId === this.user.id
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

  openProfile() {
    console.log('open profile');
    this.showProfile = true;
  }

  onCloseProfile() {
    this.showProfile = false;
  }
}
