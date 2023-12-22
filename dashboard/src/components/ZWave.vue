<template>
  <p style="font-style: italic;">Currently only supports hard-coded binary switch (CC 37) with node id of 2</p>
  <v-card>
    <v-card-title>CC 37 Example</v-card-title>
    <v-card-text>
      <v-switch v-model="node2" @change="websocketPublish({ payload: node2, topic: 'set/zwave/1/2/0/37' })">
        Node 2
      </v-switch>
    </v-card-text>
    <v-card>
      <v-card-title>WebSocket Status</v-card-title>
      <v-card-text>{{ websocketStatus }}</v-card-text>
    </v-card>
  </v-card>
  <v-card>
    <v-card-title>Z-Wave Controller Status</v-card-title>
    <v-card-text>{{ zwaveControllerStatus }}</v-card-text>
  </v-card>
</template>

<script setup>
import { inject } from 'vue'

const node2 = inject('node2')
const websocketStatus = inject('websocketStatus')
const websocketPublish = inject('websocketPublish')
const zwaveControllerStatus = inject('zwaveControllerStatus')
</script>
