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
    <template #cell(book_for)="row">
      <span>
        <b v-if="row.item['dose1_date'] !== '' && row.item['dose2_date'] === ''" class="text-primary">
          Dose 2
        </b>
        <b v-if="row.item['dose1_date'] === ''" class="text-primary">
          Dose 1
        </b>
      </span>
    </template>
    <template #cell(status)="row">
      <span>
        <b v-if="row.item['appointments'].length && (row.item['dose2_date'] === '' || row.item['dose1_date'] === '')" class="text-success">
          Appointment Booked!<br>
          <a href="#" @click="downloadAppointmentSlip(row.item.appointments[0].appointment_id)">Appointment Slip</a>
          <br>
          <a href="#" class="text-danger"
             @click="cancelAppointment(row.item.appointments[row.item.appointments.length - 1].appointment_id, row.item.beneficiary_reference_id)"
          >
            Cancel Appointment
          </a>
        </b>
        <b v-if="row.item['dose2_date'] !== ''" class="text-success">
          Fully Vaccinated
        </b>
        <b v-else-if="row.item['dose1_date'] !== ''" class="text-success">
          Partially Vaccinated
        </b>
        <b v-if="! row.item['appointments'].length" class="text-danger">Not Booked!</b>
      </span>
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
        'select', 'name', 'vaccine', 'book_for', 'status'
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
    },
    downloadAppointmentSlip(appointment_id)
    {
      this.axios.get(this.apiURL + '/appointment/appointmentslip/download?appointment_id=' + appointment_id, {
        responseType:"blob"
      })
          .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data], {type: "application/pdf"}));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Appointment_slip.pdf'); //or any other extension
            document.body.appendChild(link);
            link.click();
          })
    },
    cancelAppointment(appointment_id, beneficiary_id)
    {
      if (! confirm('Are you sure you want to cancel appointments?')) {
        return;
      }
      this.axios.post(this.apiURL + '/appointment/cancel', {
        appointment_id: appointment_id,
        beneficiariesToCancel: [
          beneficiary_id,
        ]
      }).then(() => {
        this.axios.get(this.apiURL + '/appointment/beneficiaries').then(res => {
          this.$store.commit('setAllBeneficiaries', res.data.beneficiaries)
        });
      })
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
