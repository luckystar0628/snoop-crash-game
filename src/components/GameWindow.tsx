import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"
import { Game_Global_Vars } from "../config"
import { useGameParams } from "../store/store"
import axios from "axios"
import { betBoardAllItemType } from "../@types"
const continent = ['usa', 'asia', 'africa', 'europe', 'latam']
const GameWindow = ({ videoRef, payoutParams: { payout, setPayout }, cashParams: { curCash, setCurCash }, setBetBoardAllItem }: { videoRef: RefObject<HTMLVideoElement>, payoutParams: { payout: number, setPayout: Dispatch<SetStateAction<number>> }, cashParams: { curCash: number, setCurCash: Dispatch<SetStateAction<number>> }, setBetBoardAllItem: React.Dispatch<React.SetStateAction<betBoardAllItemType[]>> }) => {

    const tobaccoFireRef = useRef<HTMLVideoElement>(null)
    const [clouds, setClouds] = useState<{ crashedAt: number, cashout: number }[]>([])
    const [times, _setTimes] = useState(0)
    const { gameParams, setGameParams } = useGameParams()
    const [showAnim, setShowAnim] = useState(false)
    const intervalId = useRef<number>(0)
    const [contIndex, setContIndex] = useState(Math.floor(Math.random() * 5))
    const setTimes = (callback: ((v: number) => number)) => {
        dx.current = Math.min(dx.current + 0.0001, 5)
        _setTimes(v => {
            let new_v = callback(v)
            if (new_v >= 12910 - 840) {
                setContIndex(prev => ((prev + 1) % 5))
                new_v = 0
            }
            return new_v
        })
    }

    useEffect(() => {
        if (gameParams.crashState === "STARTED") {
            tobaccoFireRef.current?.play()
        }
    }, [gameParams.crashState])
    const dx = useRef(0.1)
    useEffect(() => {
        intervalId.current = setInterval(() => setTimes(v => v + dx.current), 10)
        Game_Global_Vars.socket = io("http://localhost:3001", {
            // auth: callback => callback({ token }),
            auth: { token: "c42ca54b-0e44-4348-95c5-f0c058334847" },
            transports: ["websocket"]
        });
        Game_Global_Vars.socket.on("message", async ({ message, update }: { message: string, update: number }) => {
            if (message === "GAME_START") {
                setGameParams(v => {
                    const val = v.betState
                    const new_betState = val === "PLACING" ? "CASHOUT" : val
                    Game_Global_Vars.betState = new_betState
                    return {
                        ...v, crashState: "STARTED", betState: new_betState
                    }
                })
                setShowAnim(false)
                intervalId.current = setInterval(() => setTimes(v => v + dx.current), 10)
            } else if (message === "GAME_STOP") {
                setCurCash(0)
                setGameParams(v => {
                    const val = v.betState
                    const new_betState = val === "WAITING_NEXT_ROUND" ? "PLACING" :
                        val === "CASHOUT" ? "IDLE" : val
                    Game_Global_Vars.betState = new_betState
                    return {
                        ...v, crashState: "STOPPED", betState: new_betState
                    }
                })
                dx.current = 0.1
                videoRef.current?.play()
                setTimeout(() => {
                    setPayout(0)
                }, 500);
                clearInterval(intervalId.current)
                setShowAnim(true)
            } else if (message === "PAYOUT_STATUS_UPDATE") {
                if (gameParams.crashState === "STOPPED") {
                    setGameParams(v => ({ ...v, crashState: "STARTED" }))
                }
                setPayout(update)
                if (Game_Global_Vars.betState === "CASHOUT") {
                    setCurCash(update)
                }
            } else if (message?.startsWith("CASHOUT") || message?.startsWith("AUTO_CASHOUT")) {
                const roundId = parseInt(message.substring((message?.startsWith("CASHOUT") ? "CASHOUT" : "AUTO_CASHOUT").length + 1))
                const { data: { win, bet } }: { data: { win: number, bet: number } } = await axios.post(`/api/games/crash/${roundId}/cash-out`)
                setCurCash(win)
                setGameParams(v => ({ ...v, balance: v.balance + bet + win }))

            }
        })
        Game_Global_Vars.socket.on("INCOMING_BET", async ({ username, betAmount, gameCrashId, gameId }: { username: string, betAmount: number, gameCrashId: number, gameId: number }) => {
            console.log("INCOMING_BET", { username, betAmount, gameCrashId, gameId })
            setBetBoardAllItem(prev => ([...prev, { username, betAmount, gameCrashId }]))
        })
        Game_Global_Vars.socket.on("INCOMING_CASH_OUT", async ({ username, betAmount, gameCrashId, gameId, crashed_at: crashedAt, cashout }: { username: string, betAmount: number, gameCrashId: number, gameId: number, crashed_at: number, cashout: number }) => {
            console.log("INCOMING_CASH_OUT", { username, betAmount, gameCrashId, gameId, crashed_at: crashedAt, cashout })
            setBetBoardAllItem(prev => prev.map(item => {
                if (item.gameCrashId === gameCrashId)
                    return { username, betAmount, gameCrashId, crashedAt, cashout }
                else return item
            }))
            setClouds(v => [...v, { crashedAt, cashout }])
            setTimeout(() => {
                setClouds(v => v.splice(1))
            }, 4000);
        })
        return () => clearInterval(intervalId.current)
    }, [])
    return (
        <div className='w-full h-full bg-cover' style={{ backgroundPositionX: -times, backgroundImage: `url(./sprites/${continent[contIndex]}/layer-1.png)` }}>
            <div className="w-full h-full bg-cover" style={{ backgroundPositionX: -times * 1.5, backgroundImage: `url(./sprites/${continent[contIndex]}/layer-2.png)` }}>
                <div className="w-full h-full bg-cover relative" style={{ backgroundPositionX: -times * 3, backgroundImage: `url(./sprites/${continent[contIndex]}/layer-3.png)` }}>
                    <div className="absolute top-[50%] left-[50%] w-1/2 h-[32px] -translate-y-[50%]" style={{ backgroundPositionX: -times * 3, backgroundImage: `url(./svgs/tobacco.svg)` }}></div>
                    <video ref={tobaccoFireRef} className="absolute w-[58px] h-[42px] top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] object-contain" autoPlay loop>
                        <source src="./fire.webm" type="video/webm" />
                    </video>
                    <div className="absolute top-0 left-0 w-full h-full bg-cover z-30" style={{ backgroundPositionX: -times * 4.2, backgroundImage: `url(./sprites/${continent[contIndex]}/layer-4.png)` }}></div>
                    <div className="absolute flex justify-center items-center w-full h-full top-0 left-0">
                        <div className={`round-over-anim ${showAnim ? "show" : ""} absolute z-40`} style={{ backgroundImage: "url(./sprites/smoke-over-anim.png)" }}></div>
                    </div>
                    {clouds.map((cloud, i) => <div key={i} className="cloud-anim absolute top-[50%] left-[50%] w-[100px] h-[68px]">
                        <div className="w-full h-full -translate-x-[50%] -translate-y-[50%] bg-cover" style={{ backgroundImage: `url(./cloud.png)` }}></div>
                        <div className=" -translate-x-[31px] -translate-y-[66px] absolute text-xs text-green-700">
                            <span className=" -translate-x-[50%] -translate-y-[50%] absolute">{cloud.crashedAt}x</span>
                        </div>
                        <div className="translate-x-[10px] -translate-y-[66px] absolute text-sm text-green-700">
                            <span className=" -translate-x-[50%] -translate-y-[50%] absolute">${cloud.cashout}</span>
                        </div>
                    </div>)}
                    <div className={`absolute flex flex-col  gap-1 top-10 right-10 font-lato ${payout === 0 ? "hidden" : ""}`}>
                        <div className="flex gap-2 items-center">
                            {curCash > 0 && <span className="bg-[#24bb60] border border-[#75feed] text-[16px] px-1 uppercase rounded-md">+${curCash}</span>}
                            <span className="bg-[#24bb60] border border-[#75feed] text-[16px] px-1 uppercase rounded-md">Pagamento Atual</span>
                        </div>
                        <span className="payout-text text-[65px] leading-[70px] font-roboto font-bold w-full text-right">{payout.toFixed(2)}x</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default GameWindow