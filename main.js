import Vue from 'vue'
import App from './App'
import DigitKeyboard from './components/digit-keyboard/digit-keyboard.vue' 

Vue.config.productionTip = false
Vue.component('digitKeyboard', DigitKeyboard)  

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
