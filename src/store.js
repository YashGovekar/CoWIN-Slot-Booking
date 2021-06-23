import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist';

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
    key: 'vuex', // The key to store the state on in the storage provider.
    storage: window.localStorage, // or window.sessionStorage or localForage
})

const store = new Vuex.Store({
    plugins: [vuexLocalStorage.plugin],
    state: {
        phone: '',
        token: '',
        loggedIn: false,
        autoLogin: false,
        searchToday: false,
        searchTomorrow: false,
        searchFreeOnly: false,
        beneficiaries: [],
        district: 0,
        pinCode: '',
        centers: [],
        minAge: 0,
        confirmed: false,
        timeElapsed: 0,
        vaccine: '0',
        pinCodeOnly: false,
    },
    mutations: {
        setToken (state, token) {
            state.token = token;
            state.loggedIn = true;
        },
        setBeneficiaries (state, beneficiaries) {
            state.beneficiaries = beneficiaries;
        },
        setLoggedIn(state, value) {
            state.loggedIn = value;
        },
        setDistrict(state, value) {
            state.district = value;
        },
        setCenters(state, value) {
            state.centers = value;
        },
        setPhone(state, value) {
            state.phone = value;
        },
        setMinAge(state, value) {
            state.minAge = value;
        },
        setConfirmed(state, value) {
            state.confirmed = value;
        },
        setAutoLogin(state, value) {
            state.autoLogin = value;
        },
        setSearchToday(state, value) {
            state.searchToday = value;
        },
        setSearchFreeOnly(state, value) {
            state.searchFreeOnly = value;
        },
        setSearchTomorrow(state, value) {
            state.searchTomorrow = value;
        },
        setTimeElapsed(state, value) {
            state.timeElapsed = value;
        },
        setPinCode(state, value) {
            state.pinCode = value;
        },
        setPinCodeOnly(state, value) {
            state.pinCodeOnly = value;
        },
        setVaccine(state, value) {
            state.vaccine = value;
        },
        incrementTimeElapsed(state) {
            state.timeElapsed += 1;
        },
    },
    getters: {
        getPhone: state => state.phone,
        getToken: state => state.token ? state.token : null,
        getLoginStatus: state => state.loggedIn,
        getBeneficiaries: state => state.beneficiaries,
        getDistrict: state => state.district,
        getCenters: state => state.centers,
        getMinAge: state => state.minAge,
        getConfirmed: state => state.confirmed,
        getAutoLogin: state => state.autoLogin,
        getSearchToday: state => state.searchToday,
        getSearchTomorrow: state => state.searchTomorrow,
        getTimeElapsed: state => state.timeElapsed,
        getPinCode: state => state.pinCode,
        getPinCodeOnly: state => state.pinCodeOnly,
        getVaccine: state => state.vaccine,
        getSearchFreeOnly: state => state.searchFreeOnly,
    }
})

export default store;