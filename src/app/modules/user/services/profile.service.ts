import { Injectable } from '@angular/core';
import {IndxeddbService} from "../../../core/services/indxeddb.service";
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly usersTable = 'users';
  private voucherCodes: { [points: number]: string } = {
    100: '50 Dh',
    200: '120 Dh',
    500: '350 Dh'
  };

  constructor(private dbService: IndxeddbService) {}


  async getUserProfile(userId: string): Promise<any> {
    return await this.dbService.get(this.usersTable, userId);
  }


  async updateProfile(userId: string, updatedData: any): Promise<void> {
    const user = await this.getUserProfile(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const updatedUser = { ...user, ...updatedData };
    await this.dbService.put(this.usersTable, updatedUser);
  }

  /**
   * Delete user profile
   */
  async deleteUserProfile(userId: string): Promise<void> {
    await this.dbService.delete(this.usersTable, userId);
  }

  /**
   * Convert user points to vouchers
   */
  async convertPoints(userId: string, points: number): Promise<string | null> {
    const user = await this.getUserProfile(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.points < points || !this.voucherCodes[points]) {
      throw new Error('Insufficient points or invalid conversion amount');
    }

    // Deduct points
    user.points -= points;
    await this.dbService.put(this.usersTable, user);

    // Generate unique voucher code
    const voucherCode = `VOUCHER-${uuidv4().slice(0, 8)}`;
    console.log(`Voucher generated: ${voucherCode}`);

    return voucherCode;
  }

  /**
   * Store profile picture as a base64 string
   */
  async updateProfilePicture(userId: string, file: File): Promise<void> {
    const user = await this.getUserProfile(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const pictureData = await this.dbService.storeImage(file);
    user.picture = pictureData;
    await this.dbService.put(this.usersTable, user);
  }
}
