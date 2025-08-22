import { useEffect, useState } from 'react'
import { topicSubscribe, topicUnsubscribe } from '../api/topic'
import { useMutation } from '@tanstack/react-query'
import LoginAlertModal from './LoginAlertModal'

type SubscribeButtonProps = {
  id: number
  subscribe?: boolean // 구독 상태, 기본값은 false
  size?: 'default' | 'large'
}

function getAccessTokenFromStorage() {
  const token = localStorage.getItem('accessToken')
  if (token) return token
}

function SubscribeButton({ id, size = 'default', subscribe = false }: SubscribeButtonProps) {
  const [sub, setSub] = useState(subscribe) // 구독 상태 관리
  const [isOpen, setIsOpen] = useState(false) // 로그인 알림 모달 상태

  useEffect(() => {
    setSub(subscribe)
  }, [subscribe])
  const toggleSubscribe = useMutation({
    mutationFn: async (next: boolean) => {
      return next ? topicSubscribe(id) : topicUnsubscribe(id)
    }, //next: 구독 상태 받음 true일때 구독

    onMutate: (next: boolean) => {
      console.log('SubscribeButton - onMutate 호출:', id, next)
      setSub(next)
      // onMutate에서는 콜백을 호출하지 않음 (중복 방지)
    }, //구독 상태 변경

    onSuccess: (_, next: boolean) => {
      // 성공 시에만 이벤트 발생
      console.log('SubscribeButton - onSuccess 호출, 이벤트 발생:', id, next)
      window.dispatchEvent(
        new CustomEvent('subscriptionChanged', {
          detail: { topicId: id, isSubscribed: next },
        })
      )
    },
    onError: (error, next) => {
      console.error('구독 상태 변경 실패:', error)
      setSub(!next) // 에러 발생 시 이전 상태로 되돌림
    },
  })

  const handleClick = () => {
    const token = getAccessTokenFromStorage()
    console.log('토큰 확인:', token)
    if (!token) {
      console.log('로그인 필요')
      setIsOpen(true) // 로그인 알림 모달 열기
    } else {
      console.log('구독 상태 변경', sub)
      toggleSubscribe.mutate(!sub)
    }
  }

  return (
    <>
      <button
        className={`
      ${size === 'default' ? 'w-[50px] h-[20px] text-xs' : 'w-[76px] h-[32px] text-[16px]'}
        rounded-[20px] border text-center font-semibold 
        active:ring-[4px] active:ring-[#0EA6C033] active:text-white active:bg-[#0EBEBE66] active:border-none
        transform cursor-pointer
        ${
          sub
            ? 'border-[#919191] text-[#919191]'
            : 'bg-transparent border-[#0EA6C0] text-[#0EA6C0] hover:bg-[#0EBEBE26]'
        }
            transition-all duration-300
       `}
        onClick={handleClick}
      >
        {sub ? '구독 중' : '+ 구독'}
      </button>
      {isOpen && <LoginAlertModal open={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  )
}

export default SubscribeButton
