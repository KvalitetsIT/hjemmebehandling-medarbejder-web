import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Typography } from '@mui/material';

export function MessageWithWarning(props: {message: string|undefined}): JSX.Element{
    
    if(props.message == undefined || "") (<></>)
    
    return (<div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
    }}><WarningAmberIcon /><Typography>{props.message}</Typography></div>)
}