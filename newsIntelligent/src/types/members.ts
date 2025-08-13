export interface MemberInfo {
    id : number;
    email : string;
    notificationEmail : string;
    nickname : string;
    subscribe_topic_alert : boolean;
    read_topic_alert : boolean;
    daily_report_alert : boolean;
    is_deactivated : boolean;
    createdAt : string;
    updatedA : string;
}

export interface MemberInfoResponse {
    isSuccess : boolean;
    code : string;
    status : string;
    message : string;
    result : MemberInfo[];
}

export interface NicknameAvailability {
    nickname : string;
    available : boolean;
}

export interface NicknameAvailabilityResponse {
    isSuccess : boolean;
    code : string;
    status : string;
    message : string;
    result : NicknameAvailability;
}

export interface DailyReportTimes {
    hour : number;
    minute : number;
    second : number;
    nano : number;
}

export interface MemberSetting {
    subscribeNotification : boolean;
    readTopicNotification : boolean;
    dailyReportSend : boolean;
    dailyReportTimes : DailyReportTimes[];
}

export interface MemberSettingResponse {
    isSuccess : boolean;
    status : string;
    code : string;
    message : string;
    result : MemberSetting;
}