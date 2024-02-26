import { Slider } from "@mui/material"

const MySlider = ({ vol, handleVolumeChange }: { vol: number, handleVolumeChange: (event: Event, value: number | number[], activeThumb: number) => void }) => {
    return (
        <Slider
            onChange={handleVolumeChange}
            value={vol}
            sx={{
                width: "160px",
                color: '#EFAC01',
                '& .MuiSlider-track': {
                    border: 'none',
                },
                '& .MuiSlider-rail': {
                    opacity: 1,
                    backgroundColor: "#3E3E43"
                },
                '& .MuiSlider-thumb': {
                    width: 18,
                    height: 18,
                    backgroundColor: '#fff',
                    '&:before': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                    },
                    '&:hover, &.Mui-focusVisible, &.Mui-active': {
                        boxShadow: 'none',
                    },
                },
            }}

            aria-label="Volume" max={100} min={0} />
    )
}
export default MySlider