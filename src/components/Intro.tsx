import { Dispatch, SetStateAction } from "react"

const IntroItem = ({ src, title, msg }: { src: string, title: string, msg: string }) => {
    return (
        <div className='flex flex-col gap-1 md:gap-4'>
            <img className='w-[120px] md:w-[70%] mx-auto' src={src} />
            <h1 className='w-full stroke-black text-center font-roboto text-[20px] md:text-[28px] xl:text-[40px] font-[900]' style={{ textShadow: "black -2px 0px, black 0px 2px, black 2px 0px, black 0px -2px, black -2px -2px, black -2px 2px, black 2px 2px, black 2px -2px" }}>{title}</h1>
            <p className='font-lato text-[12px] md:text-[20px] xl:text-[24px] w-full text-center'>{msg}</p>
        </div>
    )
}
const Intro = ({ setShowIntro }: { setShowIntro: Dispatch<SetStateAction<boolean>> }) => {
    return (
        <div className='absolute top-0 left-0 flex flex-col justify-center items-center w-full h-full'>
            <img className='w-[40vmin] translate-y-[50px] z-10' src="./svgs/svg-intro.svg" />
            <div className='max-w-[1400px] w-full mx-auto px-1 md:px-10'>
                <div className='grid grid-cols-1 md:grid-cols-3 w-full rounded-3xl bg-[#3e3971] text-white px-4 py-24 border-2 border-white -translate-y-[50px]'>
                    <IntroItem src="./svgs/svg-betting.svg" title='FAÇA UMA APOSTA' msg='Jogue algumas notas no pote e vamos cozinhar' />
                    <IntroItem src="./svgs/svg-deposit.svg" title='TAXA DE PAGAMENTO' msg='Não durma nos números para pegar esse dinheiro' />
                    <IntroItem src="./svgs/svg-withdraw.svg" title='SAQUE' msg='Aperte o botão de saque ou configure para automático' />
                </div>
            </div>
            <div className='w-[190px] h-[46px] xl:w-[320px] xl:h-[80px] rounded-md xl:rounded-xl border border-black -translate-y-[80px]'>
                <button onClick={() => setShowIntro(false)} className='w-full h-full text-center rounded-md xl:rounded-xl bg-[#28b851] hover:bg-[#28c851] border-y-4 border-x-2 border-[#4aeb88_#4aeb88_#18a037] text-white font-lato uppercase font-bold text-[24px] xl:text-[32px] transition-all ease-in-out duration-500' style={{ textShadow: "black -2px 0px, black 0px 2px, black 2px 0px, black 0px -2px, black -2px -2px, black -2px 2px, black 2px 2px, black 2px -2px" }}>Jogar Jogo</button>
            </div>
        </div>
    )
}
export default Intro