<template>
  <div id="app">
    <div class="container pb-5">
      <b-row>
        <b-col cols="3">
          <small class="pt-4" style="float: left">Time Elapsed : {{ $store.getters.getTimeElapsed }}</small>
        </b-col>
        <b-col cols="6">
          <h2 class="text-center">
            Welcome to CoWIN Slot Booking
          </h2>
        </b-col>
        <b-col cols="3">
          <small class="pt-4" style="float: right">Developed By <u><b>Yash Govekar</b></u></small>
        </b-col>
      </b-row>

      <hr />

      <b-row>
        <b-col lg="5" class="mx-auto">
          <div class="card">
            <div class="card-body">
              <phone-number />
              <options />
            </div>
          </div>
        </b-col>
        <b-col lg="6" class="mx-auto">
          <div class="card">
            <div class="card-body">
              <beneficiaries />
            </div>
          </div>
        </b-col>
        <search-form />
      </b-row>
    </div>

  </div>
</template>

<script>

import PhoneNumber from "@/components/PhoneNumber";
import {BCol, BRow} from "bootstrap-vue";
import Beneficiaries from "@/components/Beneficiaries";
import SearchForm from "@/components/SearchForm";
import Options from "@/components/Options";

export default {
  name: 'App',
  components: {
    Options,
    PhoneNumber,
    BCol,
    BRow,
    Beneficiaries,
    SearchForm,
  },
  computed: {
    token() {
      return this.$store.getters.getToken;
    },
    timeElapsed() {
      return this.$store.getters.getTimeElapsed;
    },
  },
  created() {
    let check = false;
    let urls = ['localhost', '127.0.0.1', '192.168.1'];
    urls.map(url => {
      if (window.location.href.toLowerCase().includes(url.toLowerCase())) {
        check = true;
      }
    })

    if (! check ) {

      window.addEventListener('focus', () => {
        if (prompt('Enter Password') !== 'mehagatulekebhaga') {
          window.close();
        }
      });
      if (prompt('Enter Password') !== 'mehagatulekebhaga') {
        window.close();
      }
    }
  },
  mounted() {
    if (this.token) {
      this.axios.defaults.headers.common = {'Authorization': `Bearer ${this.token}`}
      // setTimeout(() => {
      //   this.axios.get(this.apiURL + '/appointment/beneficiaries').then(res => {
      //     this.$store.commit('setAllBeneficiaries', res.data.beneficiaries)
      //   })
      // }, 500)
    }
    this.$store.commit('setConfirmed', false);
  },
}
</script>

<style>
html, body {
  background-color: #161E32;
}
#app {
  background-color: #161E32;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #d0d2d6;
  margin-top: 60px;
}
.card {
  background-color: #283046 !important;
}
.table {
  color: #d0d2d6 !important;
}
</style>
