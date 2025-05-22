<!--src/views/AgendaView.vue-->

<template>
  <v-table class="elevation-1">
    <thead>
      <tr class="border-b">
        <th class="text-left border-r">CLASSROOM</th>
        <th
          v-for="hour in hours"
          :key="hour"
          class="text-left border-r"
        >
          {{ hour }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in classrooms"
        :key="item.ne"
        class="border-b"
      >
        <td class="border-r">{{ item.ne }}</td>
        <td
          v-for="hour in hours"
          :key="hour"
          class="text-center border-r"
        >
          {{ item.pe }}
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts">
export default {
  data() {
    return {
      hours: [
        '6:00', '7:00', '8:00', '9:00', '10:00',
        '11:00', '12:00', '13:00', '14:00', '15:00',
        '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
      ],
      classrooms: [
        { ne: 'ROMA', pe: null },
        { ne: 'TOKYO', pe: null },
        { ne: 'KOREA', pe: null },
        { ne: 'ENGLAND', pe: null },
        { ne: 'PARIS', pe: null },
        { ne: 'COLOMBIA', pe: null },
        { ne: 'VENEZUELA', pe: null },
        { ne: 'IRLAND', pe: null },
        { ne: 'GRECIA', pe: null },
        { ne: 'VARSOVIA', pe: null },
      ],
    }
  },
}
</script>

<style scoped>
th, td {
  border: 1px solid #000
}
</style>
