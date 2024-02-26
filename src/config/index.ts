import { GlobalVarType, IConfig } from "../@types";
export const config: IConfig = {
    width: 430,
    height: 350,
    backgroundColor: 0x00000000,
    autoStart: true,
    antialias: true,
    transparent: false,
    resolution: 1
};
export const Game_Global_Vars: GlobalVarType = {
    socket: undefined,
    betState: "IDLE",
    id: 0,
}