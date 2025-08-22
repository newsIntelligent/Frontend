type imageSource = {
    press: string;
    title: string;
}

export type MainArticleCardProps = {
    id: number;
    topicName: string;
    aiSummary: string;
    imageUrl: string;
    summaryTime: string;
    imageSource: imageSource;
    isSub: boolean;
  }