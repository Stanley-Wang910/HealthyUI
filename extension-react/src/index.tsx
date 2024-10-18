import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import MainEntryPoint from "./mainEntrypoint";
import {
    createTheme,
    StyledEngineProvider,
    ThemeProvider
} from '@mui/material/styles'

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", afterDOMLoaded)
} else {
    afterDOMLoaded()
}

function afterDOMLoaded() {
    // createReactRoot()

}

function attachMain() {
    /**
     * MAIN VIDEO DECORATOR
     */
// const mainRootElement = document.getElementById('main-react-root')
// @ts-ignore
    const mainRoot = ReactDOM.createRoot(document.getElementById('main-react-root'))
    const rootElement = document.getElementById('main-react-root')

    const theme = createTheme({
        components: {
            MuiPopover: {
                defaultProps: {
                    container: rootElement
                }
            },
            MuiPopper: {
                defaultProps: {
                    container: rootElement
                }
            }
        }
    })


    if (mainRoot ) {
        setTimeout(() => {
            mainRoot.render(
                <React.StrictMode>
                    <ThemeProvider theme={theme}>
                    <MainEntryPoint />
                    </ThemeProvider>
                </React.StrictMode>
            );

        }, 2000)
    }

}

function checkAndSetupPlayer () {

    const player = document.getElementById("ytd-player") // Adjust if the ID is different
    if (player) {
        console.log("checked the player")
        clearInterval(checkInterval); // Stop checking once the player is found
        const infoBox = document.createElement("div")
        infoBox.className = "the-box"
        infoBox.textContent = "Healthy UI video feed"
        infoBox.style.cssText = "margin-bottom: 100px; display: block; height: 100px; color: white; border: 1px solid #ccc; padding: 10px; margin-top: 40px;"
        infoBox.id = "main-react-root"
        player.prepend(infoBox)
        attachMain()
    }

}
const checkInterval = setInterval(checkAndSetupPlayer, 500);


/**
 * POPUP / MENU
 */
// const popupRoot = document.createElement("div")
// popupRoot.className = "container"
// document.body.appendChild(popupRoot)
//
// const popupRootDiv = ReactDOM.createRoot(popupRoot)
//
// popupRootDiv.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );


