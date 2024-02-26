export const BetAmountTinyButton = ({ title, onClick, disabled }: { title: string, onClick?: (() => void), disabled?: boolean }) => {
    return (
        <button disabled={disabled} onClick={onClick} className='text-[13px] bg-[#756ca4] hover:bg-[#9186c9] px-1 rounded-md z-10 transition-all ease-in-out'>{title}</button>
    )
}
export const DescripAbove = ({ title, href }: { title: string, href: string }) => {
    return (
        <div className='flex gap-1 items-center'>
            <span className='text-[14px]'>{title}</span>
            <svg className='text-[#768bff]' width={13} height={13}><use href={href} /></svg>
        </div>
    )
}