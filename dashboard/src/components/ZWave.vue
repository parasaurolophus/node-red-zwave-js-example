<template>
  <v-card>
    <v-card-title>CC 37 Example</v-card-title>
    <v-card-text>
      <v-switch v-model="node2" @change="websocketPublish({ payload: node2, topic: 'set/zwave/2/37' })">
        Node 2
      </v-switch>
    </v-card-text>
    <v-card>
      <v-card-title>WebSocket Status</v-card-title>
      <v-card-text>{{ websocketStatus }}</v-card-text>
    </v-card>
  </v-card>
</template>

<script setup>
import { inject } from 'vue'

const node2 = inject('node2')
const websocketStatus = inject('websocketStatus')
const websocketPublish = inject('websocketPublish')
</script>
