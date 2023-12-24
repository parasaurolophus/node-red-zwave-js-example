/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp, ref } from 'vue'

const app = createApp(App)

registerPlugins(app)

//////////////////////////////////////////////////////////////////////////////
// monitor websocket readyState
//////////////////////////////////////////////////////////////////////////////

// model to display websocket connection
// status in BackEndComponent.vue
const websocketStatus = ref(-1)
app.provide('websocketStatus', websocketStatus)

//////////////////////////////////////////////////////////////////////////////
// provide the function for ui components to send messages to the back end
// using a websocket
//////////////////////////////////////////////////////////////////////////////

// send the given message to the back end using the websocket connection
function websocketPublish(msg) {

    if (ws === null) {

        const text = JSON.stringify(msg, undefined, 1)

        console.log('websocket closed when attempting to send:\n' + text)
        return

    }

    ws.send(JSON.stringify(msg))

}

app.provide('websocketPublish', websocketPublish)

//////////////////////////////////////////////////////////////////////////////
// provide models for ui components based on messages received from the
// back end using a websocket
//////////////////////////////////////////////////////////////////////////////

const zwaveNetworks = ref({})
app.provide('zwaveNetworks', zwaveNetworks)

///////////////////////////////////////////////////////////////////////////////
// connect to the back end using a websocket
///////////////////////////////////////////////////////////////////////////////

// websocket connection to the back end
let ws = null

// timer used to periodically update
// the websocket status display
let wsReadyStateTimer = null

// timer used to maintain the websocket
// connection to the back end
let wsReconnectTimer = null

// create the ws connection to the back end
function connectWS() {

    // do nothing if already connecting or connected
    if (ws !== null) {

        if ((ws.readyState === 0) || (ws.readyState === 1)) {

            return

        }
    }

    // stop the current readystate timer
    if (wsReadyStateTimer !== null) {

        clearInterval(wsReadyStateTimer)
        wsReadyStateTimer = null

    }

    // stop the current reconnect timer
    if (wsReconnectTimer !== null) {

        clearInterval(wsReconnectTimer)
        wsReconnectTimer = null

    }

    // open a new websocket connection
    const matches = /^([^:]+):\/\/([^:]+).*$/.exec(window.location)
    let url = 'ws://127.0.0.1:1880/ws/automation'

    if (Array.isArray(matches) && (matches.length == 3)) {

        url = ((matches[1] == 'https') ? 'wss' : 'ws') + '://' + matches[2] + ':1880/ws/automation'

    }

    ws = new WebSocket(url)

    //display the initial status
    websocketStatus.value = ws.readyState

    // start the reconnect timer
    wsReconnectTimer = setInterval(connectWS, 5000)

    // start the websocket status timer
    ws.onopen = () => {

        websocketStatus.value = ws.readyState
        wsReadyStateTimer = setInterval(() => { websocketStatus.value = ws.readyState }, 1000)

    }

    // cancel the websocket status timer
    ws.onclose = () => {

        clearInterval(wsReadyStateTimer)
        wsReadyStateTimer = null
        websocketStatus.value = ws.readyState

    }

    // log errors
    ws.onerror = (event) => {

        const text = JSON.stringify(event, undefined, 1)

        console.log(text)

    }

    // update models based on messages received from the back end
    ws.onmessage = (event) => {

        // node-red's msg object is received as a JSON
        // string in event.data
        const msg = JSON.parse(event.data)

        if (msg.topic == 'zwave/networks') {

            zwaveNetworks.value = msg.payload
            return
            
        }
    }
}

connectWS()

//////////////////////////////////////////////////////////////////////////////

app.mount('#app')
