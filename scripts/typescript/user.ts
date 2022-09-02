/**
 * General purpose data structures and utility functions for users
 */

export enum OnlineStatus {
  OFFLINE, ONLINE, IDLE, DND
};

/**
 * Global user data
 */

export class UserData {
  public name: string;
  public tag: number;
  public id: string;
  public status: OnlineStatus = OnlineStatus.OFFLINE;

  public getFormattedName(): string {
    return `${this.name}#${this.tag.toString().padStart(4, '0')}`;
  }

  constructor(id: string, name: string, tag: number) {
    this.id = id;
    this.name = name;
    this.tag = tag;
  }
}

/**
 * User data relative to a server
 */

export class LocalUserData {
  public name: string;
  public nameColor: string = '#f5f5f5';
  public avatarPath: string;
  public id: string;

  constructor(id: string, name: string, avatar: string) {
    this.id = id;
    this.name = name;
    this.avatarPath = avatar;
  }
}