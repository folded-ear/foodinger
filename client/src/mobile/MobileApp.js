import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import React from "react";
import useIsNewVersionAvailable from "data/useIsNewVersionAvailable";
import theme from "../theme";
import NewVersionAvailable from "../views/NewVersionAvailable";
import MobileHeader from "./MobileHeader";
import {
    Box,
    Container,
    Paper,
    Typography,
} from "@material-ui/core";

function MobileApp() {
    const newVersionAvailable = useIsNewVersionAvailable();

    return <ThemeProvider theme={theme}>
        <CssBaseline />
        {newVersionAvailable && <NewVersionAvailable />}
        <MobileHeader
            authenticated={false}
        />
        <Container>
            <Box my={2} mx={1}>
                <Paper>
                    <Box p={2}>
                        <Typography variant={"h3"} component={"h1"}>
                            Brenna&apos;s Food Software
                        </Typography>
                        <Typography variant={"body1"}>
                            <p>
                                Foodinger is now <a
                                href="https://gobrennas.com">Brenna&apos;s Food
                                Software</a>. Your recipes and plans are
                                already waiting for you.
                            </p>
                            <p>
                                Open <a
                                href="https://gobrennas.com">gobrennas.com</a> in
                                your mobile browser, install the new app, and
                                delete this one. That&apos;s it.
                            </p>
                            <p>Happy cooking!</p>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    </ThemeProvider>;
}

export default MobileApp;
