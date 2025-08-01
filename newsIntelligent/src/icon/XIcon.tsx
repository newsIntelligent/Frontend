function XIcon({
    className='', 
    onClick, 
}: {
    className?: string; 
    onClick?: () => void;}
){
    return(
        <svg className={className} onClick={onClick}
        width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.505341 7.49531L4.00067 3.99997L7.49601 7.49531M7.49601 0.504639L4.00001 3.99997L0.505341 0.504639" stroke="#0EA6C0" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>


    )
}

export default XIcon;