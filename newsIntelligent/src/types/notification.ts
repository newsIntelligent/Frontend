export interface Notifications {
    type : string;
    content : string;
    isChecked : boolean;
    createdAt : string;
}

export interface Result {
    notifications : Notifications[];
    nextCursor : string;
    hasNext : boolean;
}

export interface Notification {
    isSuccess : boolean;
    status : string;
    code : string;
    message : string;
    result : Result;
}