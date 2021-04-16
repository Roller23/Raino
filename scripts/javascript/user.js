"use strict";
/**
 * General purpose data structures and utility functions for users
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalUserData = exports.UserData = exports.OnlineStatus = void 0;
var OnlineStatus;
(function (OnlineStatus) {
    OnlineStatus[OnlineStatus["OFFLINE"] = 0] = "OFFLINE";
    OnlineStatus[OnlineStatus["ONLINE"] = 1] = "ONLINE";
    OnlineStatus[OnlineStatus["IDLE"] = 2] = "IDLE";
    OnlineStatus[OnlineStatus["DND"] = 3] = "DND";
})(OnlineStatus = exports.OnlineStatus || (exports.OnlineStatus = {}));
;
/**
 * Global user data
 */
class UserData {
    constructor(id, name, tag) {
        this.status = OnlineStatus.OFFLINE;
        this.id = id;
        this.name = name;
        this.tag = tag;
    }
    getFormattedName() {
        return `${this.name}#${this.tag.toString().padStart(4, '0')}`;
    }
}
exports.UserData = UserData;
/**
 * User data relative to a server
 */
class LocalUserData {
    constructor(id, name, avatar) {
        this.nameColor = '#f5f5f5';
        this.id = id;
        this.name = name;
        this.avatarPath = avatar;
    }
}
exports.LocalUserData = LocalUserData;
