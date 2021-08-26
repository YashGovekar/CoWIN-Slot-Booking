<template>
  <b-table :fields="fields" :items="$store.getters.getAllBeneficiaries">
    <template #cell(select)="row">
      <div class="form-group">
        <div class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input" :id="row.item.beneficiary_reference_id"
                 @change="changeBeneficiaries($event.target.checked, row.item)">
          <label class="custom-control-label" :for="row.item.beneficiary_reference_id"></label>
        </div>
      </div>
    </template>
    <template #cell(appointments)="row">
      <b v-if="row.item['dose' + $store.getters.getDose + '_date'] !== ''" class="text-success">
         <span v-if="row.item['dose1_date'] !== ''">Partially </span><span v-else>Fully </span>Vaccinated
      </b>
      <b v-else-if="! row.value.length" class="text-danger">Appointment Not Booked!</b>
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
          'select', 'name', 'vaccine', 'dose', 'appointments'
      ],
    }
  },
  methods: {
    changeBeneficiaries(isChecked, beneficiary)
    {
      let beneficiaries = this.$store.getters.getBeneficiaries;

      if (isChecked) {
        beneficiaries.push(beneficiary);
      } else {
        let index = beneficiaries.findIndex(el => el.beneficiary_reference_id === beneficiary.beneficiary_reference_id);
        beneficiaries.splice(index, 1);
      }
      this.$store.commit('setBeneficiaries', beneficiaries);
    }
  },
  mounted() {
    let beneficiaries = this.$store.getters.getBeneficiaries;
    console.log(beneficiaries);
    if (beneficiaries) {
      beneficiaries.map(el => document.getElementById(el.beneficiary_reference_id).checked = true)
    }
  }
}
</script>

<style scoped>

</style>
