import { topicRead } from '../api/topic'
import type { MainArticleCardProps } from '../types/article'
import SubscribeButton from './SubscribeButton'
import { useNavigate, createSearchParams } from 'react-router-dom'

function MainArticleCard({
  id,
  topicName,
  aiSummary,
  imageUrl,
  summaryTime,
  imageSource,
  isSub
}: MainArticleCardProps) {
  const navigate = useNavigate()

  const formatTime = (iso: string): string => {
    const time = new Date(iso)
    const mm = time.getMonth() + 1
    const dd = time.getDate()
    const hh = time.getHours()
    const mi = time.getMinutes()

    return `${mm}/${dd} ${hh}:${mi}`
  }

  const handleClick = (e:React.MouseEvent) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      topicRead(id)
    }
    navigate({
      pathname: '/article',
      search: `?${createSearchParams({ id: String(id) })}`,
    })
    e.preventDefault() // Prevent default link behavior
  }


  return (
    <div className="flex flex-col w-[410px] h-[265px] rounded-[8px] border border-[#919191] px-[26px] pt-[17px] pb-[21px] cursor-pointer"
      onClick={handleClick}>
      <div className="flex justify-between items-center text-[12px] text-[#919191]">
        
        <span className="truncate w-[300px]">업데이트 {formatTime(summaryTime)} · 이미지  {imageSource?.press}  
            <a className="underline" href={imageUrl} onClick={(e:React.MouseEvent)=>e.stopPropagation()}> "{imageSource?.title}"</a>
        </span> 
        <div onClick={(e:React.MouseEvent)=>e.stopPropagation()}>
        <SubscribeButton id={id} subscribe={isSub}/>
        </div>
        
      </div>

      <div className="flex gap-[12px] pt-[16px] items-center">
        <img
          src={imageUrl}
          alt="기사 이미지"
          className="w-[88px] h-[64px] object-cover rounded-[8px] cursor-pointer"
          onClick={handleClick}
        />
        <h2
          className="text-[24px] font-semibold leading-7 break-keep line-clamp-2 cursor-pointer"
          onClick={handleClick}
        >
          {topicName}
        </h2>
      </div>
      <div className="w-full border-t border-[#E6E6E6] mt-[16px] mb-[12px]" />
      <p className="w-[360px] font-normal text-[14px] leading-[24.5px] mb-[3px] line-clamp-3">
        {aiSummary}
      </p>
    </div>
  )
}

export default MainArticleCard
