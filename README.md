# Z-Wave in Node-RED using node-red-contrib-zwave-js

## About

Demonstrate <https://flows.nodered.org/node/node-red-contrib-zwave-js> to
control a _Z-Wave_-enabled switch using a USB-based _Z-Wave_ controller.

## Hardware

* Raspberry Pi 4
* Aeotec Z-Stick 7
* GE Enbrighten Outdoor Switch

## Software

* Raspberry Pi OS (bookworm)
* Node
* Node-RED
* node-red-contrib-zwave-js

## Details

```mermaid
graph TB

    switch[GE Switch]

    subgraph client

        browser

    end

    subgraph Raspberry Pi

        dongle[Aeotec Z-Stick]

        subgraph Node-RED

            flows[flow]

            subgraph node-red-contrib-zwave-js
                controller[zwave-js]
                device[zwave-device]
                events[event-filter]
                commands[cmd-factory]
            end
        end

        subgraph "web server"

            dashboard

        end
    end

    device <--> controller
    flows --> commands
    commands --> device
    events --> flows
    device --> events
    controller <-- USB --> dongle
    dongle <-- z-wave --> switch
    browser <-- websocket ---> flows
    browser <-. HTTP .-> dashboard

    classDef simulated stroke-width:2px,color:#fff,stroke-dasharray: 5 5
    class browser,dashboard simulated
```
[The dashed and dotted elements in the preceding digram indicates components that are simulated in this example flow using inject and debug nodes.]