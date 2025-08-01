export interface Topics {
    id : number;
    topicName : string;
    aiSummary : string;
    summaryTime : string;
    imageUrl : string;
}

export interface Result {
    cursor : number;
    hasNext : boolean;
    topics : Topics[];
}

export interface Subscriptions {
    isSuccess : boolean;
    status : string;
    code : string;
    message : string;
    result : Result;
}

export interface ReadTopics {
    isSuccess : boolean;
    status : string;
    code : string;
    message : string;
    result : Result;
}