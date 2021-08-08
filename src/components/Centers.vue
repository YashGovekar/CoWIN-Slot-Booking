<template>
  <div style="height: 20em; overflow-y: scroll">
    <b-table :fields="fields" :items="centers">
      <template #cell(sessions)="row">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Vaccine</th>
              <th>Dose 1</th>
              <th>Dose 2</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="session in row.value" :key="session.session_id">
              <td>{{ session.vaccine }}</td>
              <td>{{ session.available_capacity_dose1 }}</td>
              <td>{{ session.available_capacity_dose2 }}</td>
            </tr>
          </tbody>
        </table>
      </template>
    </b-table>
  </div>
</template>

<script>
import {BTable} from "bootstrap-vue";

export default {
  name: "Centers",
  components: {
    BTable,
  },
  props: {
    centers: Array,
  },
  data() {
    return {
      fields: [
        'name', 'pincode', 'sessions',
      ],
    }
  },
}
</script>

<style scoped>

</style>
