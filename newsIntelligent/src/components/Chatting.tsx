function Chatting({ messages }: { messages: {text:string; isUser?: boolean; tag?:string|null}[];  }) {
    return (
        <div className="flex flex-col w-full pt-[26px] gap-[12px] px-[20px]">
            {messages.map((message, index) => (
                <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[316px] px-[16px] py-[12px] rounded-[12px] gap-10px whitespace-pre-line
                         text-sm font-normal leading-none
                         ${message.isUser ? 'bg-[#0EA6C0] text-white' : 'bg-[#F5F5F5] text-[#1D1D1D]'}`}>
                        {message.tag && message.isUser  && <div> [{message.tag}] </div>}
                        {message.text}
                     </div> 
                </div>
            ))}

        </div>
        
    )
}
export default Chatting;

