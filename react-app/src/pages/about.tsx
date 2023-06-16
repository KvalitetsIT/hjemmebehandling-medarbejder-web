import { Card, CardHeader, CardContent, Stack, Typography, Divider, List, ListItem, ListItemIcon, ListItemText, Link } from "@mui/material"
import { Component } from "react"
import { AboutManufacturerIcon, AboutUserGuideIcon, AboutMedicalDeviceIcon, AboutWarningsIcon } from '../components/Icons/Icons';

export default class AboutPage extends Component<{}> {
    render() : JSX.Element{
        return (
            <Card>
                <CardHeader title="Om Komo"/>
                <Divider />
                <CardContent>
                    <Stack spacing={3}>
                        <Stack>
                            <Typography >
                                KOMO står for Kommunikation og Monitorering, og er en telemedicinsk softwareløsning til monitorering af patienter i eget hjem.
                            </Typography>
                            <Typography >
                                Løsningen består af en kliniker- og en patientrettet klient (webbaseret for kliniker og android app på tablet for patient). 
                            </Typography>
                        </Stack>
                        <Typography>
                            Du skal som kliniker have tilladelse for at få adgang til administratorfunktionerne. Har du tilladelse, er funktionerne automatisk tilgængelige, når du logger ind.     
                        </Typography>

                        <List>
                            <ListItem alignItems="flex-start">
                                <ListItemIcon>
                                    <AboutMedicalDeviceIcon size="65px"/>
                                </ListItemIcon>
                                <ListItemText disableTypography
                                    primary={<Typography variant="h6">Medicinsk udstyr</Typography>}
                                    secondary={<Typography>Versionsnummer på software: 2.0.0-2023-06-07</Typography>}
                                />
                            </ListItem>
                            <ListItem alignItems="flex-start">
                                <ListItemIcon>
                                    <AboutUserGuideIcon />
                                </ListItemIcon>
                                <ListItemText disableTypography
                                    primary={<Typography variant="h6">Brugervejledning</Typography>}
                                    secondary={
                                        <List dense sx = {{listStyleType: 'disc', pl: 3, '& .MuiListItem-root': {display: 'list-item', mt: -1 },}}>
                                            <ListItem disableGutters>
                                                <Link href="https://regionmidtjylland.service-now.com/rmsp?id=kb_article_view&sysparm_article=KB0021402" color="inherit">Til kliniker</Link>
                                            </ListItem>
                                            <ListItem disableGutters>
                                                <Link href="https://regionmidtjylland.service-now.com/rmsp?id=kb_article_view&sysparm_article=KB0022939" color="inherit">Til administrator</Link>
                                            </ListItem>
                                            
                                            <ListItem disableGutters sx={{pt: 3}}>
                                                <Link href="https://regionmidtjylland.service-now.com/rmsp?id=kb_article_view&sysparm_article=KB0021419" color="inherit">Til patient</Link>
                                            </ListItem>
                                            <ListItem disableGutters>
                                            <Link href="https://regionmidtjylland.service-now.com/rmsp?id=kb_article_view&sysparm_article=KB0021439" color="inherit">Til patient (kvikguide)</Link>
                                            </ListItem>
                                        </List>
                                    }
                                />
                            </ListItem>
                            <ListItem alignItems="flex-start">
                                <ListItemIcon>
                                    <AboutWarningsIcon />
                                </ListItemIcon>
                                <ListItemText disableTypography
                                    primary={<Typography variant="h6">Advarsler og begrænsninger</Typography>}
                                    secondary={
                                        <List dense sx = {{listStyleType: 'disc', pl: 3, '& .MuiListItem-root': {display: 'list-item', mt: -1 },}}>
                                            <ListItem disableGutters>
                                                <Typography>Indtast aldrig ukorrekte oplysninger.</Typography>
                                            </ListItem>
                                            <ListItem disableGutters>
                                                <Typography>KOMO må aldrig anvendes til kritiske patienter.</Typography>
                                            </ListItem>
                                            <ListItem disableGutters>
                                                <Typography>Patienter kan ikke foretage målinger med KOMO. Målinger (som fx CRP, temperatur og andet), skal foretages med eksternt udstyr, som patienten skal læres op i af klinisk personale.</Typography>
                                            </ListItem>
                                            <ListItem disableGutters>
                                                <Typography>Det er klinikkens ansvar at følge op på patienter, der er oprettet i KOMO til hjemmebehandling, samt at udarbejde arbejdsgange omkring dette. Løsningen understøtter ikke et nødsystem i form af notifikationer eller andet, der gør opmærksom på, at der er patientbesvarelser, der ikke er tjekket op på.</Typography>
                                            </ListItem>
                                            <ListItem disableGutters>
                                                <Typography>Det er ligeledes klinikkens ansvar at udarbejde arbejdsgange for kvalitetssikring af spørgeskemaer og patientgrupper.</Typography>
                                            </ListItem>
                                            <ListItem disableGutters>
                                                <Typography>Enhver fejl eller uhensigtsmæssighed, der er indtruffet i forbindelse med den medicinske software, skal indberettes til it.dias.support@rm.dk.</Typography>
                                            </ListItem>
                                            <ListItem disableGutters>
                                                <Typography>
                                                    Det erklærede formål beskriver den tiltænkte medicinske anvendelse af Komo, herunder hvordan Komo tiltænkes at blive anvendt, hvilken patientpopulation Komo kan anvendes til, og hvad/hvem Komo ikke må anvendes til.
                                                    <span> <Link href="https://regionmidtjylland.service-now.com/kb?id=kb_article_view&sysparm_article=KB0023709" color="inherit">Læs mere om det erklærede formål her</Link></span>
                                                </Typography>
                                            </ListItem>
                                        </List>
                                    }
                                />
                            </ListItem>
                            <ListItem alignItems="flex-start">
                                <ListItemIcon>
                                    <AboutManufacturerIcon />
                                </ListItemIcon>
                                <ListItemText disableTypography
                                    primary={<Typography variant="h6">Fabrikant</Typography>}
                                    secondary={
                                        <List dense sx = {{listStyleType: 'none', '& .MuiListItem-root': {display: 'list-item', mt: -1 },}}>
                                            <ListItem disableGutters>
                                                <Typography>Center for Telemedicin, Region Midtjylland</Typography>
                                            </ListItem>
                                            <ListItem disableGutters>
                                                <Typography>Olof Palmes Allé 36, 8200 Århus</Typography>
                                            </ListItem>
                                        </List>
                                    }
                                />
                            </ListItem>
                        </List>
                    </Stack>
                </CardContent>
            </Card>

        )
    }
}