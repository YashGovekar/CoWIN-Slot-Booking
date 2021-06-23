<template>
  <b-table :fields="fields" :items="$store.getters.getBeneficiaries">
    <template #cell(appointments)="row">
      <b v-if="! row.value.length" class="text-danger">Appointment Not Booked!</b>
      <b v-else class="text-success">Appointment Booked!</b>
    </template>
  </b-table>
</template>

<script>
import {BTable} from "bootstrap-vue";

export default {
  name: "Beneficiaries",
  components: {
    BTable,
  },
  data() {
    return {
      fields: [
          'name', 'gender', 'appointments'
      ]
    }
  },
}
</script>

<style scoped>

</style>
