export interface NotificationItem {
    noti_id: number;
    noti_type: "SUBSCRIBE" | "READ_TOPIC";
    content: string;
    is_checked: boolean;
    created_at: string;
  }
  
  export interface NotificationResponse {
    isSuccess: boolean;
    status: string;
    code: string;
    message: string;
    result: NotificationItem[];
  }