export interface Image {
    press : string;
    title : string;
}

export interface Topics {
    id : number;
    topicName : string;
    aiSummary : string;
    summaryTime : string;
    imageUrl : string;
    imageSource : Image;
    isSub : boolean;
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

export interface Content {
    id : number;
    title : string;
    newsSummary : string;
    newsLink : string;
    publishDate : string;
    press : string;
    pressLogoUrl : string;
}

export interface ContentResult {
    content : Content[];
    totalCount : number;
    lastId : number;
    size : number;
    hasNext : boolean;
}

export interface ContentResultResponse {
    isSuccess : boolean;
    status : string;
    code : string;
    message : string;
    result : ContentResult;
}