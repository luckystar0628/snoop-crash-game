import { Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IConfig {
    width: number;
    height: number;
    backgroundColor: number | string;
    autoStart?: boolean;
    antialias?: boolean;
    transparent?: boolean;
    resolution?: number;
}
export type GlobalVarType = {
    socket?: Socket,
    betState: betStateType,
    id:number,
}

export type storeType = {
    gameParams: gameParamsType,
    setGameParams: Dispatch<SetStateAction<gameParamsType>>
}

export const initialPrams: gameParamsType = {
    balance: 1000,
    newsIndex: 0,
    betState: "IDLE",
    crashState: "STOPPED"
}
export const initialValue = {
    gameParams: initialPrams,
    setGameParams: () => { }
}
export type betStateType = "IDLE" | "WAITING_NEXT_ROUND" | "PLACING" | "CASHOUT"
export type gameParamsType = {
    balance: number;
    newsIndex: number,
    betState: betStateType
    crashState: "STOPPED" | "STARTED"
}
export const news = [
    "CLIMATE SPECIALISTS CONFIRM: TEMP RISING, PLANET SUPER THIRSTY",
    "LARGEST BLUNT OR BIGGEST DOOBIE? TOP SCIENTISTS DEBATE",
    "JOINT DECISION: COUNTRIES AGREE, BLUNT IS NEW NATURAL BORDER",
    "EGYPT: GREAT SPHYNX CRACKS FIRST SMILE IN 4,500 YEARS",
    "SCIENTISTS CLAIM SNOOP DOGG’ S RECORD-SETTING BLUNT UNSTABLE",
    "UNIDENTIFIED OBJECT VISIBLE FROM SPACE, DWARFS GREAT WALL",
    "BUSINESS NEWS: COMPANIES SET TO REPORT, RIGHT AFTER NEXT NAP",
    "COUNTRIES CLAIM BLUNT OWNERSHIP, BUT ORIGIN SEEMS…INFINITE",
    "A NEW PANDEMIC? SNOOP DOGG HOTBOXES ENTIRE PLANET",
    "POLITICS: CROSS-BORDER BLUNT MAKES BLUE & RED AGREE, TURN PURPLE",
    "PARIS STUNNED AS BLUNT BURNS PAST EIFFEL TOWER",
    "A NEW PANDEMIC? SNOOP DOGG HOTBOXES ENTIRE PLANET"
]

export type betBoardAllItemType = {
    gameCrashId: number,
    username: string,
    betAmount: number,
    crashedAt?: number,
    cashout?: number,
}