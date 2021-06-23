<template>
  <div id="app">
    <div class="container pb-5">
      <small class="pt-4" style="float: left">Time Elapsed : {{ $store.getters.getTimeElapsed }}</small>
      <h2 class="text-center">
        Welcome to {{ this.appName }}
      </h2>

      <hr />

      <b-row>
        <b-col cols="5" class="mx-auto">
          <div class="card">
            <div class="card-body">
              <phone-number />
              <options />
            </div>
          </div>
        </b-col>
        <b-col cols="6" class="mx-auto">
          <div class="card">
            <div class="card-body">
              <beneficiaries />
            </div>
          </div>
        </b-col>
        <b-col cols="6">
          <div class="card mt-5">
            <div class="card-body">
              <search-form />
            </div>
          </div>
        </b-col>
        <b-col cols="6">
          <div class="card mt-5">
            <div class="card-body">
              <centers />
            </div>
          </div>
        </b-col>
      </b-row>
    </div>

  </div>
</template>

<script>

import PhoneNumber from "@/components/PhoneNumber";
import {BCol, BRow} from "bootstrap-vue";
import Beneficiaries from "@/components/Beneficiaries";
import SearchForm from "@/components/SearchForm";
import Centers from "@/components/Centers";
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
    Centers,
  },
  computed: {
    token() {
      return this.$store.getters.getToken;
    },
    timeElapsed() {
      return this.$store.getters.getTimeElapsed;
    },
  },
  mounted() {
    if (this.token) {
      this.axios.defaults.headers.common = {'Authorization': `Bearer ${this.token}`}
      setTimeout(() => {
        this.axios.get(this.apiURL + '/appointment/beneficiaries').then(res => {
          this.$store.commit('setBeneficiaries', res.data.beneficiaries)
        })
      }, 500)
    }
    this.$store.commit('setConfirmed', false);
  }
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
