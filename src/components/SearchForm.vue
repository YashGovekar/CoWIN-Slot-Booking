<template>
  <b-row>
  <b-col lg="6">
    <div class="card mt-5">
      <div class="card-body">
  <div class="w-100">

    <div class="form-group">
      <label>State <span class="text-danger">*</span> </label>
      <select @change="getDistricts($event.target.value)" class="form-select" id="state">
        <option selected>Select a state</option>
        <option v-for="state in states" :value="state.state_id" :key="state.state_id">
          {{ state.state_name }}
        </option>
      </select>
    </div>
    <div class="mt-2">
      <label class="text-left">District <span class="text-danger">*</span></label>
      <select @change="setDistrict($event.target.value)" :model="district" class="form-select" id="district">
        <option selected>Select a District</option>
        <option v-for="district in districts" :value="district.district_id" :key="district.district_id">
          {{ district.district_name }}
        </option>
      </select>
    </div>

    <hr />

    <div class="row">
      <div class="col-lg-6">
        <div class="m-2 form-group">
          <div class="form-check">
            <input type="checkbox" class="form-check-input" value="true" id="pinCodeOnly"
                   :checked="$store.getters.getPinCodeOnly"
                   @change="$store.commit('setPinCodeOnly', $event.target.checked)">
            <label class="form-check-label" for="pinCodeOnly"> Search By PinCodes only? </label>
          </div>
          <input class="form-control"
                 :value="$store.getters.getPinCode"
                 @change="$store.commit('setPinCode', $event.target.value)"
                 placeholder="Enter Pin code" />
        </div>
      </div>
      <div class="col-lg-6">
        <div class="mt-2 form-group">
          <label class="text-left" for="dose"> Which Dose? </label>
          <select class="form-select" id="dose" @change="$store.commit('setDose', $event.target.value)">
            <option value="1">Dose 1</option>
            <option value="2">Dose 2</option>
          </select>
        </div>
      </div>
    </div>

    <hr />
    <div class="form-group">
      <input class="form-control"
             :value="$store.getters.getCenterName"
             @change="$store.commit('setCenterName', $event.target.value)"
             placeholder="Enter Center Name" />
    </div>

    <div class="m-2 form-check">
      <input type="checkbox" class="form-check-input" value="true" id="center-only"
             :checked="$store.getters.getCenterNameOnly"
             @change="$store.commit('setCenterNameOnly', $event.target.checked)">
      <label class="form-check-label" for="center-only"> Search By center name only? </label>
    </div>
    <button @click="toggleSearching" class="btn btn-success mt-2">
      <span v-if="!searching">
        Start Search
      </span>
      <span v-else>
        Stop Searching ...
      </span>
    </button>
  </div>
      </div>
    </div>
  </b-col>
  <b-col lg="6">
    <div class="card mt-5">
      <div class="card-body">
        <centers :centers="selectedCenters" />
      </div>
    </div>
  </b-col>
  </b-row>
</template>

<script>
import Centers from "./Centers";

export default {
  name: "SearchForm",
  components: {
    Centers,
  },
  data() {
    return {
      pin_code: '',
      district: 0,
      states: [],
      districts: [],
      appointment: {
        "dose": this.$store.getters.getDose,
        "session_id": "",
        "slot": "",
        "beneficiaries": []
      },
      searching: false,
      timer: undefined,
      processed: false,
      date: '',
      tomorrowDate: '',
      selectedCenters: [],
    }
  },
  methods: {
    getStates() {
      this.axios.get(this.apiURL + '/admin/location/states').then(res => {
        this.states = res.data.states;
        if (this.$store.getters.getStateId !== 0) {
          this.getDistricts(this.$store.getters.getStateId)
          setTimeout(() => {
            document.getElementById('state').value = this.$store.getters.getStateId;
          }, 500)
        }
      })
    },
    getDistricts(state) {
      this.$store.commit('setState', state);
      this.axios.get(this.apiURL + '/admin/location/districts/' + state).then(res => {
        this.districts = res.data.districts;
        if (this.$store.getters.getDistrict !== 0) {
          setTimeout(() => {
            document.getElementById('district').value = this.$store.getters.getDistrict;
          }, 500)
        }
      })
    },
    async getCenters() {
      let district = this.$store.getters.getDistrict;
      let pinCode = this.$store.getters.getPinCode;
      if (district !== 0) {
        let tzOffset = (new Date()).getTimezoneOffset() * 60000;
        let formatted_date = (new Date(Date.now() - tzOffset)).toISOString().slice(0, -1).slice(0, 10);

        let date = formatted_date.slice(8, 10) + '-'
            + formatted_date.slice(5, 7) + '-'
            + formatted_date.slice(0, 4);

        let randomString = (Math.random() * (1200 - 200) + 200).toFixed(0);

        let url = null;
        url = this.apiURL + '/appointment/sessions/public/calendarByDistrict?district_id=' + district + '&date=' + date + '?_=' +  randomString;

        if (this.$store.getters.getPinCodeOnly && pinCode.length && ! pinCode.includes(',')) {
          url = this.apiURL + '/appointment/sessions/public/calendarByPin?pincode=' + pinCode + '&date=' + date + '?_=' +  randomString;
        }

        // if (pinCode.length >= 6) {
        //   if (pinCode.includes(',')) {
        //     let pinCodes = pinCode.split(',');
        //
        //     pinCodes.map(pinCode => {
        //
        //     })
        //   }
        //   url = this.apiURL + '/appointment/sessions/public/calendarByPin?pincode=' + pinCode + '&date=' + date + '&_=' + randomString;
        // }

        await this.axios.get(url)
            .then(res => {
              let centers = [];

              let pinCodes = [];

              if (pinCode.length >= 6) {
                if (pinCode.includes(',')) {
                  pinCodes = pinCode.split(',');
                } else {
                  pinCodes = [pinCode];
                }
              }

              let pinCodeOnly = this.$store.getters.getPinCodeOnly;

              let minAge = this.$store.getters.getMinAge;

              if (minAge.includes(',')) {
                minAge = minAge.split(',')[0];
              }

              minAge = Number(minAge);

              res.data.centers.map(center => center.sessions.map(session => {
                if (session.min_age_limit >= minAge) {
                  if (pinCodes.length) {
                    if (pinCodes.findIndex(pinCode => Number(center.pincode) === Number(pinCode)) > -1)  {
                      let newArray = centers.slice();
                      newArray.unshift(center);
                      centers = newArray;
                    } else {
                      if (! pinCodeOnly) {
                        centers.push(center);
                      }
                    }
                  }

                  if (! pinCodeOnly) {
                    centers.push(center);
                  }
                }
              }))

              this.$store.commit('setCenters', centers)
            })
      }
    },
    setDistrict(district) {
      this.$store.commit('setDistrict', district)
      this.getCenters();
    },
    toggleSearching() {
      if (! this.searching) {
        this.timer = setInterval(() => {
          if (! this.getAvailableCenters()) {
            console.log('No centers found!')
          }
        }, 3000)
      } else {
        clearInterval(this.timer);
        this.timer = undefined;
      }

      this.searching = !this.searching;
    },
    async getAvailableCenters() {
      await this.getCenters();
      let d = new Date();
      let currYear = d.getFullYear();

      let minAge = this.$store.getters.getMinAge;

      if (minAge.includes(',')) {
        let ageSplit = minAge.split(',');
        minAge = ageSplit[0];
      }

      minAge = Number(minAge);

      let centers = this.$store.getters.getCenters;

      centers:
      for (let i = 0; i < centers.length; i++) {
        this.selectedCenters = [];

        if (this.processed) {
          break;
        }
        let center = centers[i];

        let centerOnly = this.$store.getters.getCenterNameOnly;

        if (centerOnly && ! (center.name).toLowerCase().includes((this.$store.getters.getCenterName).toLowerCase())) {
          continue;
        }

        for (let j = 0; j < center.sessions.length; j++) {
          if (this.processed) {
            break;
          }
          let session = center.sessions[j];

          if (this.$store.getters.getSearchFreeOnly) {
            if (center.fee_type !== 'Free') {
              continue;
            }
          }

          if (this.$store.getters.getSearchTomorrow) {
            console.log(this.tomorrowDate, session.date)
            if (session.date !== this.tomorrowDate) {
              continue;
            }
          }

          if (! this.$store.getters.getSearchToday) {
            if (session.date === this.date) {
              continue;
            }
          }
          console.log(center.name);

          let vaccine = this.$store.getters.getVaccine;
          if (vaccine !== '0') {
            if (session.vaccine !== vaccine) {
              continue;
            }
          }

          this.selectedCenters.push(center);

          let allBeneficiaries = this.$store.getters.getBeneficiaries;

          let beneficiaries = [];

          let dose = this.$store.getters.getDose;

          allBeneficiaries.map(ben => {
            let benAge = currYear - ben.birth_year;
            if (ben['dose' + dose + '_date'] === '' && benAge >= minAge) {
              beneficiaries.push(ben.beneficiary_reference_id);
            }
          })

          if (session['available_capacity_dose' + dose] >= beneficiaries.length && session.min_age_limit === minAge) {

            this.appointment.session_id = session.session_id;

            this.appointment.slot = session['slots'][0]

            this.appointment.dose = dose

            if (allBeneficiaries.length) {
              if (this.$store.getters.getReschedule) {
                for (let i = 0; i < allBeneficiaries.length; i++) {
                  let beneficiary = allBeneficiaries[i];
                  if (beneficiary.appointments.length > 0 && beneficiary['dose' + dose + '_date'] === '') {
                    let index = beneficiaries.findIndex(el => el === beneficiary.beneficiary_reference_id)
                    beneficiaries.splice(index, 1);
                    setTimeout(async () => {
                      await this.rescheduleAppointment(beneficiary);
                    }, 500);
                  }
                }
              }

              console.log(beneficiaries);

              if (beneficiaries.length) {

                this.appointment.beneficiaries = beneficiaries;

                await this.bookAppointment();
                setTimeout(() => {
                  this.axios.get(this.apiURL + '/appointment/beneficiaries').then(res => {
                    this.$store.commit('setAllBeneficiaries', res.data.beneficiaries)
                  });
                }, 1000)
              }
              break centers;
            }
          }
        }
      }

      return this.processed;
    },
    async bookAppointment() {
      this.axios.post(this.apiURL + '/appointment/schedule', this.appointment).then(
          res => {
            console.log(res.data)
            alert('Appointment Booked!')
            this.$store.commit('setConfirmed', true);
            clearInterval(this.timer);
            this.processed = true;
          }
      ).catch(err => {
        //alert('Appointment Not Booked!')
        console.log(err.response.data)
        setTimeout(() => {
          this.getAvailableCenters();
        }, 1000);
      })
    },
    async rescheduleAppointment(beneficiary) {
      this.axios.post(this.apiURL + '/appointment/reschedule', {
        "appointment_id": beneficiary.appointments[0].appointment_id,
        "session_id": this.appointment.session_id,
        "slot": this.appointment.slot,
      }).then(
          res => {
            console.log(res.data)
            alert('Appointment Rescheduled for ' + beneficiary.name)
            this.processed = true;
            return true;
          }
      ).catch(err => {
        console.log(err.response.data)
        return false;
      })
      this.$store.commit('setConfirmed', true);
      clearInterval(this.timer);
    }
  },
  mounted() {
    this.searching = false;
    this.processed = false;
    this.getStates();
    let tzOffset = (new Date()).getTimezoneOffset() * 60000;
    let formatted_date = (new Date(Date.now() - tzOffset)).toISOString().slice(0, -1).slice(0, 10);

    this.date = formatted_date.slice(8, 10) + '-'
        + formatted_date.slice(5, 7) + '-'
        + formatted_date.slice(0, 4);

    let tomorrowDateString = (Number(formatted_date.slice(8, 10)) + 1).toString();
    this.tomorrowDate = (tomorrowDateString.length === 1 ? '0' + tomorrowDateString : tomorrowDateString) + '-'
        + formatted_date.slice(5, 7) + '-'
        + formatted_date.slice(0, 4);

    document.getElementById('dose').value = this.$store.getters.getDose;
  }
}
</script>

<style scoped>

</style>
