import React from 'react'

const NewsCardSkeleton = () => {
    return (
        <div className="break-inside-avoid border border-[1px] border-[#e5e5e5] rounded-lg w-[410px] h-[288px] animate-pulse bg-white">
            <div className="flex flex-col m-6 gap-4">
                <div className="flex justify-between items-center">
                    <div className="w-36 h-4 bg-gray-300 rounded" />
                    <div className="w-16 h-6 bg-gray-300 rounded" />
                </div>
    
            <div className="flex gap-3">
                <div className="w-[88px] h-[88px] bg-gray-300 rounded-md" />
                <div className="flex flex-col gap-2">
                    <div className="w-[170px] h-6 bg-gray-300 rounded" />
                    <div className="w-[160px] h-4 bg-gray-300 rounded" />
                </div>
            </div>
    
            <div className="w-full h-16 bg-gray-300 rounded" />
                <div className="flex justify-end">
                    <div className="w-24 h-4 bg-gray-300 rounded" />
                </div>
            </div>
        </div>
    )
}

export default NewsCardSkeleton
