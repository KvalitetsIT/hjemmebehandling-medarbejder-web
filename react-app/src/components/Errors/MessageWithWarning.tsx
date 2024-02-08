import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Typography } from '@mui/material';
import { THEME } from '../../pages/_app';

export function ErrorMessage(props: {message: string|undefined, color?: "primary" | "warning"}): JSX.Element{
    
    if(props.message === undefined || "") (<></>)
    
    

    return (<div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 5
    }}><WarningAmberIcon color={"error"} /><Typography sx={{ fontWeight: 'bold', color: THEME.palette.error.main }}>{props.message}</Typography></div>)
}