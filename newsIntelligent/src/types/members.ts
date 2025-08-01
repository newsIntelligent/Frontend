export interface MemberInfo {
    email : string;
    subscribe_topic_alert : boolean;
    read_topic_alert : boolean;
    daily_report_alert : boolean;
    createdAt : string;
    updatedA : string;
    is_deactivated : boolean;
}

export interface MemberInfoResponse {
    isSuccess : boolean;
    code : string;
    status : string;
    message : string;
    result : MemberInfo[];
}