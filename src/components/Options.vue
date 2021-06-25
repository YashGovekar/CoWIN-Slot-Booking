<template>
  <div class="row">
    <div class="col-md-6">
      <div class="form-check">
        <input type="checkbox" class="form-check-input" value="true" id="autologin"
               :checked="$store.getters.getAutoLogin"
               @change="$store.commit('setAutoLogin', $event.target.checked)">
        <label class="form-check-label" for="autologin"> Autologin? </label>
      </div>

      <div class="form-check">
        <input type="checkbox" class="form-check-input" value="true" id="searchToday"
               :checked="$store.getters.getSearchToday"
               @change="$store.commit('setSearchToday', $event.target.checked)">
        <label class="form-check-label" for="searchToday"> Search For Today? </label>
      </div>

      <div class="form-check">
        <input type="checkbox" class="form-check-input" value="true" id="searchTomorrow"
               :checked="$store.getters.getSearchTomorrow"
               @change="$store.commit('setSearchTomorrow', $event.target.checked)">
        <label class="form-check-label" for="searchTomorrow"> Search For Tomorrow? </label>
      </div>

      <div class="form-check">
        <input type="checkbox" class="form-check-input" value="true" id="searchFreeOnly"
               :checked="$store.getters.getSearchFreeOnly"
               @change="$store.commit('setSearchFreeOnly', $event.target.checked)">
        <label class="form-check-label" for="searchFreeOnly"> Search For Free Only? </label>
      </div>

      <div class="form-check">
        <input type="checkbox" class="form-check-input" value="true" id="reschedule"
               :checked="$store.getters.getReschedule"
               @change="$store.commit('setReschedule', $event.target.checked)">
        <label class="form-check-label" for="reschedule"> Reschedule Existing? </label>
      </div>
    </div>

    <div class="col-md-6">
      <div class="form-group">
        <label>Select Vaccine <span class="text-danger">*</span> : </label>
        <select id="vaccine" class="form-select" @change="$store.commit('setVaccine', $event.target.value)">
          <option value="0" selected>Select All Vaccines</option>
          <option v-for="(vaccine, i) in vaccines" :key="i" :value="vaccine">
            {{ vaccine }}
          </option>
        </select>
      </div>

      <div class="form-group mt-2">
        <label>Select Age <span class="text-danger">*</span> :</label>
        <select class="form-select" id="minAge" @change="$store.commit('setMinAge', Number($event.target.value))">
          <option selected>Book for</option>
          <option value="18">18+</option>
          <option value="45">45+</option>
        </select>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "Options",
  data() {
    return {
      vaccines: ['COVISHIELD', 'COVAXIN', 'SPUTNIK'],
    }
  },
  mounted() {
    document.getElementById('vaccine').value = this.$store.getters.getVaccine;
  }
}
</script>

<style scoped>

</style>
