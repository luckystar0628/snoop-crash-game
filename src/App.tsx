
import { useEffect, useRef, useState } from 'react'
import './App.css'
import { BorderImg1, BorderImg2, BorderImg3 } from './components/BorderImg'
import GameWindow from './components/GameWindow'
import Intro from './components/Intro'
import { BetAmountTinyButton, DescripAbove } from './components/Miscs'
import { useGameParams } from './store/store'
import { betBoardAllItemType, news } from './@types'
import { Game_Global_Vars } from './config'
import axios from 'axios'
import { Modal } from '@mui/material'
import MySlider from './components/MySlider'


function App() {
  const [showIntro, setShowIntro] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioBGRef = useRef<HTMLAudioElement>(null)
  const sfxRef = useRef<HTMLAudioElement>(null)
  const [bgVol, setVol] = useState(50)
  const handleBGVolumeChange = (_: Event, newValue: number | number[]) => {
    setVol(newValue as number);
  };
  const [sfxVol, setSFXVol] = useState(50)
  const handleSFXVolumeChange = (_: Event, newValue: number | number[]) => {
    setSFXVol(newValue as number);
  };

  useEffect(() => {
    if (audioBGRef.current) {
      if (bgVol === 0) {
        audioBGRef.current.muted = true; // Mute the audio
      } else {
        audioBGRef.current.muted = false; // Unmute the audio
        audioBGRef.current.volume = bgVol / 100; // Set the volume level
      }
    }
  }, [bgVol])
  useEffect(() => {
    if (sfxRef.current) {
      if (sfxVol === 0) {
        sfxRef.current.muted = true; // Mute the audio
      } else {
        sfxRef.current.muted = false; // Unmute the audio
        sfxRef.current.volume = sfxVol / 100; // Set the volume level
      }
    }
  }, [sfxVol])
  const { gameParams, setGameParams } = useGameParams()
  const [betAmount, setBetAmount] = useState("1")
  const [trigAnim, setTrigAnim] = useState(false)
  const [crashHistory, setCrashHistory] = useState<number[]>([])
  const [betBoardAllItem, setBetBoardAllItem] = useState<betBoardAllItemType[]>([])

  const [payout, setPayout] = useState(0)
  const [curCash, setCurCash] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setGameParams(v => ({ ...v, newsIndex: (v.newsIndex + 1) % 12 })), 10000)
    return () => clearInterval(id)
  }, [])
  useEffect(() => {
    setTrigAnim(true)
    setTimeout(() => {
      setTrigAnim(false)
    }, 1500);
  }, [gameParams.newsIndex])
  useEffect(() => {
    if (gameParams.betState === "PLACING") {
      setGameParams(v => ({ ...v, balance: v.balance - parseFloat(betAmount) }));
      (async () => {
        const { data: { game, } }: { data: { game?: { id: number, }, } } = await axios.post('/api/games/crash/play/bet-place', {
          hash: "HASH_VALUE",
          bet: parseFloat(betAmount),
        })
        Game_Global_Vars.id = game?.id || 0
      })()
    }
  }, [gameParams.betState])

  useEffect(() => {
    if (gameParams.crashState === "STOPPED") {
      if (payout === 0) return
      setCrashHistory(v => [payout, ...v])
      sfxRef.current?.play()
    }
  }, [gameParams.crashState])

  const handleClick = async () => {
    if (gameParams.betState === "CASHOUT") {
      await Game_Global_Vars.socket?.emit("cashout", `crash-round-${Game_Global_Vars.id}`);
    }
    setGameParams(v => {
      const val = v.betState
      const new_betState = val === "IDLE" ? (v.crashState === "STARTED" ? "WAITING_NEXT_ROUND" : "PLACING") :
        val === "WAITING_NEXT_ROUND" ? "IDLE" :
          val === "CASHOUT" ? "IDLE" : val
      Game_Global_Vars.betState = new_betState
      return {
        ...v, betState: new_betState,
      }
    })
  }
  return (
    <div className='wrapper w-full h-full relative bg-center bg-cover' style={{ backgroundImage: "url(./bg.png)" }}>
      <audio ref={audioBGRef} autoPlay loop>
        <source src="./bg.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={sfxRef}>
        <source src="./sfx.mp3" type="audio/mpeg" />
      </audio>
      <div className='hidden lg:flex flex-col w-full h-full text-white' style={{ filter: showIntro ? "blur(4px)" : "" }}>
        <div className='flex justify-between items-center w-full p-3 bg-[#1c1a38]'>
          <span className='text-[14px]'>04:05</span>
          <div className='flex items-center gap-2'>
            <div className='flex gap-2 bg-[#413b62] rounded-md p-1 items-center'>
              <span className='font-roboto text-[14px] font-bold'>${gameParams.balance.toFixed(2)}</span>
              <button className='flex justify-center items-center text-black w-6 h-6 bg-[#73ad64] rounded-md text-[20px] font-roboto'>+</button>
            </div>
            <button>
              <svg width={18} height={18} className='text-[#b5bafa]'><use href="#svg-exclaim" /></svg>
            </button>
            <button onClick={() => setModalOpen(true)}>
              <svg width={20} height={20} className='text-[#b5bafa]'><use href="#svg-speaker" /></svg>
            </button>
          </div>
        </div>
        <div className='grid grid-cols-4 gap-4 w-full h-[calc(100%-100px)] p-2 pr-0'>
          <div className='flex flex-col gap-4 w-full h-full'>
            <div className='flex flex-col w-full h-[54%] font-roboto text-[14px] relative'>
              <div className='flex justify-between items-center w-full'>
                <div>0 JOGADORES</div>
                <div>$0.00</div>
              </div>
              <div className='w-full grow bg-[#413b62] relative'>
                <BorderImg1 />
                {betBoardAllItem.map((item, i) => <div key={i} className='flex justify-between items-center px-2 py-1'>
                  <span>{item.username}</span>
                  <div className='flex gap-2 items-center text-green-700 text-sm'>
                    {item.cashout ? <>
                      <span>{item.crashedAt}x</span>
                      <span>+${item.cashout}</span>
                    </> :
                      <span>${item.betAmount}</span>
                    }
                  </div>
                </div>)}

              </div>
            </div>
            <div className='w-full h-fit relative'>
              <video ref={videoRef} autoPlay>
                <source src="./smoke-man.mp4" type="video/mp4" />
              </video>
              <BorderImg1 />
            </div>
          </div>
          <div className='flex flex-col gap-4 col-span-3 font-roboto leading-[20px]'>
            <div className='grid grid-cols-3 gap-4'>
              <div className='flex flex-col w-full'>
                <DescripAbove title='QUANTIA DA APOSTA' href='#svg-bet' />
                <div className={`flex justify-center items-center gap-1 w-full text-[18px] font-lato px-[10px] h-10 bg-[#413b62] relative ${gameParams.betState === "PLACING" || gameParams.betState === "CASHOUT" ? "opacity-40" : ""}`}>
                  <span>$</span>
                  <input disabled={gameParams.betState === "PLACING" || gameParams.betState === "CASHOUT"} value={betAmount} onChange={(e) => {
                    let input = e.target.value;
                    // Allow only numbers and a single dot, eliminate duplicate dots
                    input = input.replace(/[^\d.]+/g, ''); // Allow only numbers and a single dot
                    input = input.replace(/(\.\d*)\./g, '$1'); // Eliminate duplicate dots
                    setBetAmount(input)
                  }} className='bg-transparent outline-none flex-grow z-10' type='text' size={1} />
                  <BetAmountTinyButton title='1/2' onClick={() => setBetAmount(v => (parseFloat(v) / 2).toFixed(2))} disabled={gameParams.betState === "PLACING" || gameParams.betState === "CASHOUT"} />
                  <BetAmountTinyButton title='2X' onClick={() => setBetAmount(v => (parseFloat(v) * 2).toFixed(2))} disabled={gameParams.betState === "PLACING" || gameParams.betState === "CASHOUT"} />
                  <BetAmountTinyButton title='Máx' onClick={() => setBetAmount("500")} disabled={gameParams.betState === "PLACING" || gameParams.betState === "CASHOUT"} />
                  <BorderImg2 />
                </div>
              </div>
              <div className='flex flex-col w-full'>
                <DescripAbove title='SAQUE AUTOMÁTICO' href='#svg-exclaim' />
                <div className='flex justify-center items-center gap-1 w-full text-[18px] font-lato px-[10px] h-10 bg-[#413b62] relative'>
                  <span className='absolute right-4 text-[18px] font-lato z-10'>x</span>
                  <BorderImg2 />
                </div>
              </div>
              <div className=' rounded-md xl:rounded-xl border border-black mt-4'>
                <button onClick={handleClick} className={`w-full h-full text-center rounded-md xl:rounded-xl ${gameParams.betState === "IDLE" ? "bg-[#28b851] hover:bg-[#28c851] border-[#4aeb88_#4aeb88_#18a037]" :
                  gameParams.betState === "WAITING_NEXT_ROUND" ? "bg-[#ff0000] border-[#ff8787]" :
                    gameParams.betState === "PLACING" ? "bg-[#acacac] border-[#dbdbdb]" :
                      "bg-[#ffc500] border-[#fff251]"
                  } border-y-2 border-x-2 text-white font-lato uppercase font-bold text-[18px] transition-all ease-in-out duration-500`} style={{ textShadow: "black -1px 0px, black 0px 3px, black 1px 0px, black 0px -1px, black -1px -1px, black -1px 3px, black 1px 3px, black 1px -1px" }}>
                  {gameParams.betState === "IDLE" ? "Jogar" :
                    gameParams.betState === "WAITING_NEXT_ROUND" ? "Cancelar Aposta" :
                      gameParams.betState === "PLACING" ? "Iniciando..." : "Saque"}
                </button>
              </div>
            </div>
            <div className='w-full h-full relative pl-1 pt-1 pr-2 pb-2 overflow-hidden'>
              <GameWindow videoRef={videoRef} payoutParams={{ payout, setPayout }} cashParams={{ curCash, setCurCash }} setBetBoardAllItem={setBetBoardAllItem} />
              <BorderImg3 />
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-2 w-full absolute bottom-0 z-50'>
          <div className='w-full h-[84px] px-4'>
            <div className='flex items-center w-full h-full relative' >
              <div className='w-[172px] h-[106px] bg-[#c21e2c] absolute bottom-0 -left-1 border-2 border-[#ff2a42] uppercase font-lato text-[16px] text-center leading-[18px]'>Últimas Notícias</div>
              <div className='flex items-center w-full h-full border-2 px-9 font-lato text-[26px] font-bold text-black uppercase z-10 overflow-hidden' style={{ background: "linear-gradient(135deg, rgb(211, 211, 211) 0%, rgb(255, 255, 255) 10%, rgb(255, 255, 255) 100%)", borderColor: "white #999 #999 white" }}>
                <div className={`news-slide translate-y-0 ${trigAnim ? "show" : ""}`}>
                  {news[gameParams.newsIndex]}
                </div>
              </div>
              <div className='flex flex-col w-[56px] h-full bg-[#312f55]'>
                <div className='bg-[#c21e2c] text-[13px] leading-[16px] font-lato uppercase text-center border-2 border-l-0 border-[#ff2a42]'>Ao Vivo</div>
                <img className='w-[49px] h-[49px] mx-auto' src="./svgs/svg-logo.svg" />
              </div>
            </div>
          </div>
          <div className='flex gap-2 items-center w-full h-[28px] bg-[#0d043c] text-[16px] font-lato px-2 overflow-hidden'>
            {crashHistory.map((item, i) => <button key={i} style={{ color: item >= 2 ? "#60af5a" : "#f44336" }}>{item.toFixed(2)}x</button>)}
          </div>
        </div>
      </div>

      <div className='flex lg:hidden flex-col w-full h-full text-white' style={{ filter: showIntro ? "blur(4px)" : "" }}>
        <div className='flex justify-between items-center w-full p-1 bg-[#1c1a38]'>
          <img className='w-[20px] h-[20px]' src="./svgs/svg-logo.svg" />
          <div className='flex items-center gap-2'>
            <div className='flex gap-2 bg-[#413b62] rounded-md p-1 items-center'>
              <span className='font-roboto text-[14px] font-bold'>${gameParams.balance.toFixed(2)}</span>
              <button className='flex justify-center items-center text-black w-6 h-6 bg-[#73ad64] rounded-md text-[20px] font-roboto'>+</button>
            </div>
            <button>
              <svg width={18} height={18} className='text-[#b5bafa]'><use href="#svg-exclaim" /></svg>
            </button>
            <button onClick={() => setModalOpen(true)}>
              <svg width={20} height={20} className='text-[#b5bafa]'><use href="#svg-speaker" /></svg>
            </button>
          </div>
        </div>
        <div className=' w-full h-[400px] p-2 pr-0 relative'>
          <div className='w-full h-full relative pl-1 pt-1 pr-2 pb-2 overflow-hidden'>
            <GameWindow videoRef={videoRef} payoutParams={{ payout, setPayout }} cashParams={{ curCash, setCurCash }} setBetBoardAllItem={setBetBoardAllItem} />
            <BorderImg3 />
          </div>
          <div className='w-[150px] h-fit absolute bottom-4 right-2 z-40'>
            <video ref={videoRef} autoPlay>
              <source src="./smoke-man.mp4" type="video/mp4" />
            </video>
            <BorderImg1 />
          </div>
        </div>
        <div className='flex gap-6 items-center w-full h-[48px] bg-[#0d043c] text-[16px] font-lato px-2 overflow-hidden -my-[10px]'>
          {crashHistory.map((item, i) => <button key={i} style={{ color: item >= 2 ? "#60af5a" : "#f44336" }}>{item.toFixed(2)}x</button>)}
        </div>
        <div className='flex flex-col gap-4 px-4'>
          <div className=' rounded-md xl:rounded-xl border border-black mt-4 h-20'>
            <button onClick={handleClick} className={`w-full h-full text-center rounded-md xl:rounded-xl ${gameParams.betState === "IDLE" ? "bg-[#28b851] hover:bg-[#28c851] border-[#4aeb88_#4aeb88_#18a037]" :
              gameParams.betState === "WAITING_NEXT_ROUND" ? "bg-[#ff0000] border-[#ff8787]" :
                gameParams.betState === "PLACING" ? "bg-[#acacac] border-[#dbdbdb]" :
                  "bg-[#ffc500] border-[#fff251]"
              } border-y-2 border-x-2 text-white font-lato uppercase font-bold text-[18px] transition-all ease-in-out duration-500`} style={{ textShadow: "black -1px 0px, black 0px 3px, black 1px 0px, black 0px -1px, black -1px -1px, black -1px 3px, black 1px 3px, black 1px -1px" }}>
              {gameParams.betState === "IDLE" ? "Jogar" :
                gameParams.betState === "WAITING_NEXT_ROUND" ? "Cancelar Aposta" :
                  gameParams.betState === "PLACING" ? "Iniciando..." : "Saque"}
            </button>
          </div>
          <div className='flex flex-col w-full'>
            <DescripAbove title='QUANTIA DA APOSTA' href='#svg-bet' />
            <div className={`flex justify-center items-center gap-1 w-full text-[18px] font-lato px-[10px] h-10 bg-[#413b62] relative ${gameParams.betState === "PLACING" || gameParams.betState === "CASHOUT" ? "opacity-40" : ""}`}>
              <span>$</span>
              <input disabled={gameParams.betState === "PLACING" || gameParams.betState === "CASHOUT"} value={betAmount} onChange={(e) => {
                let input = e.target.value;
                // Allow only numbers and a single dot, eliminate duplicate dots
                input = input.replace(/[^\d.]+/g, ''); // Allow only numbers and a single dot
                input = input.replace(/(\.\d*)\./g, '$1'); // Eliminate duplicate dots
                setBetAmount(input)
              }} className='bg-transparent outline-none flex-grow z-10' type='text' size={1} />
              <BetAmountTinyButton title='1/2' onClick={() => setBetAmount(v => (parseFloat(v) / 2).toFixed(2))} disabled={gameParams.betState === "PLACING" || gameParams.betState === "CASHOUT"} />
              <BetAmountTinyButton title='2X' onClick={() => setBetAmount(v => (parseFloat(v) * 2).toFixed(2))} disabled={gameParams.betState === "PLACING" || gameParams.betState === "CASHOUT"} />
              <BetAmountTinyButton title='Máx' onClick={() => setBetAmount("500")} disabled={gameParams.betState === "PLACING" || gameParams.betState === "CASHOUT"} />
              <BorderImg2 />
            </div>
          </div>
          <div className='flex flex-col w-full'>
            <DescripAbove title='SAQUE AUTOMÁTICO' href='#svg-exclaim' />
            <div className='flex justify-center items-center gap-1 w-full text-[18px] font-lato px-[10px] h-10 bg-[#413b62] relative'>
              <span className='absolute right-4 text-[18px] font-lato z-10'>x</span>
              <BorderImg2 />
            </div>
          </div>
        </div>
        <div className='flex flex-col w-full h-[54%] font-roboto text-[14px] relative px-4'>
          <div className='flex justify-between items-center w-full'>
            <div>0 JOGADORES</div>
            <div>$0.00</div>
          </div>
          <div className='w-full grow bg-[#413b62] relative'>
            <BorderImg1 />
            {betBoardAllItem.map((item, i) => <div key={i} className='flex justify-between items-center px-2 py-1'>
              <span>{item.username}</span>
              <div className='flex gap-2 items-center text-green-700 text-sm'>
                {item.cashout ? <>
                  <span>{item.crashedAt}x</span>
                  <span>+${item.cashout}</span>
                </> :
                  <span>${item.betAmount}</span>
                }
              </div>
            </div>)}

          </div>
        </div>
      </div>
      {showIntro && <Intro setShowIntro={setShowIntro} />}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className='overflow-y-auto'
      >
        <div className='w-full h-full min-h-screen flex justify-center items-center'>
          <div className='flex flex-col justify-center items-center gap-2 p-2 w-[350px] bg-white rounded-md border-black border font-bold relative'>
            <button className='absolute right-0 top-0 text-black pr-2 text-lg' onClick={() => setModalOpen(false)}>×</button>
            <div className='w-full flex justify-center items-center gap-2'>
              <svg width={20} height={20} className='text-black'><use href="#svg-speaker" /></svg>
              <span className='text-sm'>Configurações de Som</span>
            </div>
            <div className='flex flex-col justify-center items-center gap-1 w-full'>
              <div className='flex w-full justify-between items-center px-8'>
                <span>SFX</span>
                <MySlider vol={sfxVol} handleVolumeChange={handleSFXVolumeChange} />
              </div>
              <div className='flex w-full justify-between items-center px-8'>
                <span>Música</span>
                <MySlider vol={bgVol} handleVolumeChange={handleBGVolumeChange} />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div >
  )
}

export default App
