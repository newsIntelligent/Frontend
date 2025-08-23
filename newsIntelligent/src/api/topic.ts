import { axiosInstance } from './axios'

export const topicSubscribe = async (topicId: number) => {
  try {
    const { data } = await axiosInstance.post(`/topics/${topicId}/subscribe`)
    return data
  } catch (error) {
    throw error
  }
}

export const topicUnsubscribe = async (topicId: number) => {
  try {
    const { data } = await axiosInstance.delete(`/topics/${topicId}/unsubscribe`)
    return data
  } catch (error) {
    throw error
  }
}

export const topicRead = async (topicId: number) => {
  try {
    const { data } = await axiosInstance.patch(`/topics/${topicId}/read`)
    return data
  } catch (error) {
    throw error
  }
}

export const topicHome = async (cursor: number, size = 10) => {
  try {
    const { data } = await axiosInstance.get('/topics/home', {
      params: {
        cursor,
        size,
      },
    })
    return data
  } catch (error) {
    throw error
  }
}
