import { MUser } from "../models/MUser";

export class CurrentUser {
  static userInfo: MUser | null = null;

  static get userId(): number {
    return this.userInfo?.userID ?? 0;
  }
}