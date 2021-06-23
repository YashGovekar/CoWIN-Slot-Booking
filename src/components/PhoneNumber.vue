<template>
  <b-form>
    <input type="number"
           placeholder="Enter Phone No."
           class="mb-2 form-control"
           :value="$store.getters.getPhone"
           @change="$store.commit('setPhone', $event.target.value)"
    />
    <b-button variant="primary" @click="sendOTP" class="mt-2">
      <span v-if="processing">Validating OTP...</span>
      <span v-else>Send OTP</span>
    </b-button>
    <hr />
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
              setTimeout(() => {
                this.getKvDbData()
              }, 10000)
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
          let otp = this.sha256(OTPString)

          this.confirmOTP(otp)
        })
    },
    confirmOTP(otp) {
      this.axios.post(this.apiURL + '/auth/validateMobileOtp', {
        "otp": otp,
        "txnId": this.txnID
      }).then(res => {
        let token = res.data.token;
        this.$store.commit('setToken', token);
        this.$store.commit('setLoggedIn', true);
        this.axios.defaults.headers.common = {'Authorization': `Bearer ${token}`}

        this.axios.get(this.apiURL + '/appointment/beneficiaries').then(res => {
          this.$store.commit('setBeneficiaries', res.data.beneficiaries)
        });

        this.processing = false;

      }).catch(error => {
        if (error.response) {
          setTimeout(() => {
            this.getKvDbData();
          }, 5000)
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
      if (this.computedTimeElapsed > 900) {
        this.$store.commit('setTimeElapsed', 0);
        this.$store.commit('setLoggedIn', false);
        this.$store.commit('setToken', null);
        if (this.$store.getters.getPhone !== '') {
          this.sendOTP();
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
