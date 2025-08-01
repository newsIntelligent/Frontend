export interface NewsItems {
    topicId : number;
    topicName : string;
    aiSummary : string;
    summaryTime : string;
    imageUrl : string;
    createdAt : string;
    updatedAt : string;
}

export interface NewsItemsResponse {
    isSuccess : boolean;
    code : string;
    status : string;
    message : string;
    result : NewsItems[];
    nextCursor : number;
    hasNext : boolean;
}