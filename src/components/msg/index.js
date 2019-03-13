import Vue from 'vue';
import Main from './msg.vue';
const MessageConstructor = Vue.extend(Main);

const message = function (msg, icon) {
    const instance = new MessageConstructor({
        data() {
            return {
                msg,
                icon
            }
        }
    })
    instance.vm = instance.$mount();
    document.body.appendChild(instance.vm.$el);
}

export default message;