<template>
  <v-card>
    <v-card-title>Z-Wave Devices</v-card-title>
    <v-card-text>
      <p class="note">Only binary switches (command class 37) are currently supported.</p>
      <table>
        <tr>
          <th>Node Name</th>
          <th>Network Id</th>
          <th>Node Id</th>
          <th>Endpoint Id</th>
          <th>Command Class</th>
          <th>Control</th>
        </tr>
        <template v-for="(network, networkId) in zwaveNetworks">
          <template v-for="(node, nodeId) in network">
            <template v-for="(endpoint, endpointId) in node.endpoints">
              <template v-for="(value, cc) in endpoint">
                <tr>
                  <td class="center">{{ node.name }}</td>
                  <td class="right">{{ networkId }}</td>
                  <td class="right">{{ nodeId }}</td>
                  <td class="right">{{ endpointId }}</td>
                  <td class="right">{{ cc }}</td>
                  <td class="center">
                    <v-switch v-if="cc == 37" v-model="zwaveNetworks[networkId][nodeId].endpoints[endpointId][cc]"
                      @change="websocketPublish({ payload: value, topic: 'set/zwave/' + networkId + '/' + nodeId + '/' + endpointId + '/' + cc })">
                      {{ node.name }}: {{ endpointId }}
                    </v-switch>
                    <pre v-else>{{ value }}</pre>
                  </td>
                </tr>
              </template>
            </template>
          </template>
        </template>
      </table>
    </v-card-text>
  </v-card>
</template>

<style scoped>
td,
th {
  border-style: solid;
  border-color: black;
  border-width: 1pt;
  border-collapse: collapse;
  padding: 1rem;
  margin: 0;
}

.center {
  text-align: center;
}

.right {
  text-align: right;
}

.note {
  font-style: italic;
}
</style>

<script setup>
import { inject } from 'vue'

const websocketPublish = inject('websocketPublish')
const zwaveNetworks = inject('zwaveNetworks')
</script>
