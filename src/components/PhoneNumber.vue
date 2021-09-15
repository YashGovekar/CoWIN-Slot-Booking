<template>
  <b-form>
    <input type="number"
           placeholder="Enter Phone No."
           class="mb-2 form-control"
           :value="$store.getters.getPhone"
           @change="$store.commit('setPhone', $event.target.value)"
    />

    <div class="form-check">
      <input type="checkbox" class="form-check-input" value="true" id="manualOTP"
             :checked="$store.getters.getOTPManual"
             @change="$store.commit('toggleManualOTP', $event.target.checked)">
      <label class="form-check-label" for="manualOTP">
        Enter OTP Manually? (For automatic validating, you will need to use the app in assets directory )
      </label>
    </div>

    <b-button variant="primary" @click="sendOTP" class="mt-2" :disabled="processing">
      <span v-if="processing">Validating OTP...</span>
      <span v-else>Send OTP</span>
    </b-button>
    <hr />

    <div v-if="$store.getters.getOTPManual && processing" class="form-group">
      <input placeholder="Enter OTP" class="form-control" v-model="otp" type="number">
      <b-button variant="primary" @click="confirmOTP(otp)" class="mt-2">
        Validate OTP
      </b-button>
      <hr />
    </div>

  </b-form>
</template>

<script>
import {BForm} from "bootstrap-vue";

export default {
  name: "PhoneNumber",
  components: {
    BForm,
  },
  data() {
    return {
      txnID: '',
      token: '',
      seconds: 0,
      processing: false,
      otp: '',
      errors: 0,
    }
  },
  methods: {
    sendOTP() {
      if (! this.processing) {
        this.$store.commit('setTimeElapsed', 0);
        this.$store.commit('setToken', null);
        this.processing = true;
        let secret = this.secret;
        this.axios.post(this.apiURL + '/auth/generateMobileOTP', {
          "mobile": this.$store.getters.getPhone,
          secret,
        })
            .then(res => {
              this.txnID = res.data.txnId;
              if (! this.$store.getters.getOTPManual) {
                setTimeout(() => {
                  this.getKvDbData()
                }, 10000)
              }
            })
            .catch(error => {
              if (! this.errors > 5) {
                this.sendOTP();
              }
              this.errors++;
              if (error.response) {
                console.log(error.response.data);
              }
            })
      }
    },
    getKvDbData() {

      this.axios.get(this.kvDBUrl + '/' + this.$store.getters.getPhone + '?_=' +  new Date().getTime())
        .then(res => {
          let msgData = res.data;
          let OTPString = msgData.substr(37, 6);
          this.confirmOTP(OTPString)
        })
    },
    confirmOTP(otp) {
      this.axios.post(this.apiURL + '/auth/validateMobileOtp', {
        "otp": this.sha256(otp),
        "txnId": this.txnID
      }).then(res => {
        let token = res.data.token;
        this.$store.commit('setToken', token);
        this.$store.commit('setLoggedIn', true);
        this.axios.defaults.headers.common = {'Authorization': `Bearer ${token}`}

        this.axios.get(this.apiURL + '/appointment/beneficiaries').then(res => {
          this.$store.commit('setAllBeneficiaries', res.data.beneficiaries)
        });
        this.processing = false;

        Array.from(document.getElementsByClassName('beneficiaries'))
            .map(el => el.checked = false)
        this.$store.commit('setBeneficiaries', [])

        if (this.$store.getters.getOTPManual) {
          alert('Logged in!');
        }
      }).catch(error => {
        if (error.response) {
          if (! this.$store.getters.getOTPManual) {
            setTimeout(() => {
              this.getKvDbData();
            }, 5000)
          } else {
            alert('Sorry the OTP you entered is incorrect!');
          }
          console.log(error.response.data);
        }
      })
    },
  },
  computed: {
    phone() {
      return this.$store.getters.getPhone;
    },
    computedTimeElapsed() {
      return this.$store.getters.getTimeElapsed;
    },
    loggedIn() {
      return this.$store.getters.getLoginStatus;
    }
  },
  mounted() {
    let minAge = this.$store.getters.getMinAge;
    if (minAge > 0) {
      document.getElementById('minAge').value = this.$store.getters.getMinAge;
    }

    setInterval(() => {
      if (this.computedTimeElapsed > 800) {
        this.$store.commit('setTimeElapsed', 0);
        this.$store.commit('setLoggedIn', false);
        this.$store.commit('setToken', null);
        if (this.$store.getters.getPhone !== '' && ! this.$store.getters.getOTPManual) {
          this.sendOTP();
        } else {
          alert('OTP Expired');
        }
      } else {
        if (this.loggedIn) {
          this.$store.commit('incrementTimeElapsed');
        }
      }
    }, 1000)
  }
}
</script>

<style scoped>

</style>
