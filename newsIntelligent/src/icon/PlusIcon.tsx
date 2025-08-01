
function PlusIcon({
    className='', 
    onClick, 
}: {
    className?: string; 
    onClick?: () => void;}
){
    return(
        <svg className={className} onClick={onClick}
            width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.05685 8.00028L8 8.00028L8 12.9434M12.9431 8.00028L7.99953 7.99981L8 3.05713" stroke="#C1C1C1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

    )
}

export default PlusIcon;


