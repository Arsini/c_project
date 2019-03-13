<script>
export default {
    data(){
        const validateBankAccount = (val, cb) => {
            if(!all.tool.isNumber(val)){
                let temp = /[^0-9]/g;
                this.form.bankAccount = this.form.bankAccount.replace(temp, "")
                cb(' ')
                return false
            } else if(val.length == 16 || val.length == 18 || val.length == 19) {
                cb()
            }else {
               cb('必须是16位、18位或19位银行卡号')
                return false
            }
        }

        const validateName = (val, cb) => {
            if( all.tool.chinese(val) ) {
                cb()
            }else {
                cb('必须是中文')
                return false
            }
        }
        const playerId = all.tool.GetSession('playerId');
        return{
            userData: '',
            form: {
                bankAccountName: '',
                bankAccount: '',
                bankName: '',
                // bankAccountType: '',
                bankAccountProvince: '', //省
                bankAccountCity: '',     // 市
                bankAddress: '',
                smsCode: '',
                playerId,
            },
            rules: {
                bankAccountName: {
                    required: '请输入收款人',
                    validator: validateName,
                },
                bankAccount: {
                    required: '请输入正确的银行卡号',
                    validator: validateBankAccount,
                },
                bankName: {
                    required: '请选择开户行行别'
                },
                // bankAccountType:{
                //     required: '请选择账户性质'
                // },
                bankAccountProvince: {
                    required: '请选择账户所在省份'
                },
                bankAccountCity: {
                    required: '请选择账户所在城市'
                },
                bankAddress: {
                    required: '请填写开户网点'
                },
                smsCode: {
                    required: '请输入短信验证码'
                },
            },
            banks: [],
            cityList: [],
            provinceList: [],
            bankType: [
                {
                    id: '1',
                    name: '信用卡',
                },
                {
                    id: '2',
                    name: '借记卡',
                },
            ],
            smsCodeBtName: '获取验证码',
            btnName: '提交',
            isShow: false,
            bankCardFn: '',
            sec: 60,
            timer: '',
        }
    },
    created(){
        this.getProvinceList()
        this.init()
    },
    methods:{
        /* API */
        //
        _updatePaymentInfo: data => all.net.send({
            service: 'player',
            functionName: 'updatePaymentInfo',
            data,
        }),

        init(){
            const bankList = all.tool.GetSession('getBankTypeList').data;
            const {
                bankAccount,
                bankAccountCity,
                bankAccountName,
                bankAccountProvince,
                bankAccountType,
                bankAddress,
                bankName,
            } = all.tool.GetSession('user');
            const bankRealName = bankList.find(e => e.bankTypeId == bankName)? bankList.find(e => e.bankTypeId == bankName).name : '';
            const bankIcon = this.bankIcon(bankName);
            const userData = {
                bankAccount,
                bankAccountCity,
                bankAccountName,
                bankAccountProvince,
                bankAddress,
                bankRealName,
                bankIcon,
            };
            const data = all.tool.GetSession('getBankTypeList').data;
            this.userData = userData
            this.banks = data
            if(bankAccount){//判断是否绑定银行卡
                this.bankCardFn = '更换银行卡'
                this.form.bankAccountName = bankAccountName
            } else {
                this.bankCardFn = '绑定银行卡'
                this.isShowForm()
            }
        },
        
        service24(){
            all.tool.service24()
        },

        //获取验证码
        sendSMSCodeToPlayer() {
            if(this.smsCodeBtName == '获取验证码') {
                this.smsCodeBtName = '正在发送...'
                this.$api.sendSMSCodeToPlayer({purpose: 'updateBankInfo'}).then(res=>{
                    this.countdown()
                    this.msg('已发送等待60秒后可重新发送','success')
                },err => {
                    this.smsCodeBtName = '获取验证码'
                })
            }
        },

        //倒计时
        countdown() {
            this.smsCodeBtName = '已发送(59)'
			this.timer = setInterval(()=>{
				this.smsCodeBtName = '已发送('+ this.sec +')'
                this.sec --
                if(this.sec <= 0) {
                    clearInterval(this.timer)
                    this.sec = 59
                    this.smsCodeBtName = '获取验证码'
                }
            },1000)
        },

        /**
         * 获取省份列表
         */
        getProvinceList() {
            this.$api.getProvinceList().then(res=>{
                this.provinceList = res.data
            })
        },

        /**
         * 获取市列表
         */
        getCityList(e) {
            const data = { 
                provinceId: e.target.value,
            }
            this.$api.getCityList(data).then(res=>{
                this.cityList = res.data
            })
        },

        //
        isShowForm(){
            this.isShow = true
        },

        bankIcon(id){
            let icon = 'icon-yinxing';
            switch (parseInt(id)) {
                case 1: icon = 'icon-gongshangyinhangicbcbank1193388easyiconnet'; break;
                case 2: icon = 'icon-nongyeyinxing'; break;
                case 3: icon = 'icon-zhongguoyinhangbank1193437easyiconnet'; break;
                case 4: icon = 'icon-jiansheyinxing'; break;
                case 5: icon = 'icon-jiaotongyinxing'; break;
                case 6: icon = 'icon-zhongxinyinxing'; break;
                case 7: icon = 'icon-guangdayinxing'; break;
                case 8: icon = 'icon-changyonglogo17'; break;
                case 9: icon = 'icon-guangfa'; break;
                case 11: icon = 'icon-zhaoshangyinhangbank1193432easyiconnet'; break;
                case 12: icon = 'icon-changyonglogo05'; break;
                case 13: icon = 'icon-pufayinxing'; break;
                case 161: icon = 'icon-youzhengyinxing'; break;
                case 169: icon = 'icon-minshengyinxing'; break;
            }
            return icon
        },

        onSubmit(){
            if(all.tool.validateForm(this)){
                this._updatePaymentInfo(this.form).then(res=>{
                    const obj = all.tool.GetSession('user');
                    let province,city;
                    (this.provinceList).forEach(val => {
                        if(val.id == this.form.bankAccountProvince){
                            province = val.name
                        }
                    });
                    (this.cityList).forEach(val => {
                        if(val.id == this.form.bankAccountCity){
                            city = val.name
                        }
                    });
                    const bankAccountLength = this.form.bankAccount.length;
                    obj.bankAccount = this.form.bankAccount.slice(0,6) + '******' + this.form.bankAccount.slice(bankAccountLength-4,bankAccountLength)
                    obj.bankAccountCity = city
                    obj.bankAccountName = this.form.bankAccountName
                    obj.bankAccountProvince = province
                    obj.bankAddress = this.form.bankAddress
                    obj.bankName = this.form.bankName
                    all.tool.SetSession('user', obj)
                    this.init()
                    this.isShow = false
                    this.msg('银行卡绑定成功。', 'success')
                })
            }
        },
    }
}
</script>

<template>
    <div class="user_info_bank wrap" :class="{ 'user_info_bank_bg' : isShow}">
        <div v-show="!isShow" class="user_box clearfix">
            <ul class="bank_card">
                <li class="clearfix">
                    <h4>
                        <i class="iconfont bank_card_icon" :class="userData.bankIcon"></i>
                        <span class="bank_name">{{ userData.bankRealName }}</span>
                    </h4>
                </li>
                <li class="clearfix">
                    <h4 class="card_num">{{ userData.bankAccount }}</h4>
                    <div class="card_name">{{ userData.bankAccountName }}</div>
                </li>
                <li>
                    <i class="iconfont bg"  :class="userData.bankIcon"></i>
                </li>
            </ul>
            <ul class="bank_card_local warp">
                <li>开户省份：{{ userData.bankAccountProvince }}</li>
                <li>开户城市：{{ userData.bankAccountCity }}</li>
                <li>开户支行：{{ userData.bankAddress }}</li>
            </ul>
            <button class="btn_center">
                <button @click="isShowForm" class="btn btn_primary">{{ bankCardFn }}</button>
            </button>
        </div>
        <div v-show="isShow" class="user_box white_user_box clearfix">
            <form class="white_form">
                <div v-if="bankCardFn == '更换银行卡'" class="input_wrapper clearfix">
                    <i class="iconfont icon-zhanghu1 primary_text_color"></i>
                    <input v-model="form.bankAccountName" type="text" placeholder="收款人" class="have_icon" disabled>
                </div>
				<FormItem
                v-else
                icon='icon-zhanghu1'
                :rule='rules.bankAccountName'
                placeholder='收款人'
                ref='bankAccountName'
                v-model="form.bankAccountName"/>
                <FormItem
                icon='icon-card'
                :rule='rules.bankAccount'
                placeholder='银行帐号'
                ref='bankAccount'
                type='tel'
                v-model="form.bankAccount"/>
                <FormSelect
                icon='icon-leibie'
                :options='banks'
                :rule='rules.bankName'
                v-model="form.bankName"
                ref='bankName'
                placeholder='银行类别'/>
                <FormSelect
                icon='icon-zuobiao'
                @change.native="getCityList"
                :options='provinceList'
                :rule='rules.bankAccountProvince'
                v-model="form.bankAccountProvince"
                ref='bankAccountProvince'
                placeholder='请选择省'/>
                <FormSelect
                icon='icon-chengshi'
                :options='cityList'
                :rule='rules.bankAccountCity'
                v-model="form.bankAccountCity"
                ref='bankAccountCity'
                placeholder='请选择市'/>
                <FormItem
                icon='icon-yinhang'
                :rule='rules.bankAddress'
                placeholder='开户支行'
                ref='bankAddress'
                v-model="form.bankAddress"/>
                <div class="captcha_zoom clearfix">
                    <div class="sms_box">
                        <FormItem
                        icon='icon-yanzhengma1'
                        :rule='rules.smsCode'
                        placeholder='验证码'
                        ref='smsCode'
                        type='tel'
                        v-model="form.smsCode"/>
                        <p @click='service24' class="primary_text_color service24">收不到?</p>
                    </div>
                    <div @click="sendSMSCodeToPlayer" class="btn btn_primary get_sms">{{ smsCodeBtName }}</div>
                </div>
                <div class="btn_center">
                    <button @click.prevent="onSubmit" class="btn btn_secondary">{{ btnName }}</button>
                    <button @click.prevent="isShow=false" class="btn btn_pop_cancel">取消</button>
                </div> 
			</form>
        </div>
    </div>
</template>

<style lang="postcss">
    .user_info_bank{
        padding-top: 10px;
        .user_box{
            border-radius: 10px;
            width: 90%;
            margin: 0 auto;
            padding: 30px 20px 0 20px;
        }
        .white_user_box{
            background-color: #fff;
        }
        .bank_card{
            padding: 30px 20px 0 20px;
            width: 480px;
            height: 240px;
            background: linear-gradient(to bottom right,#ff9743, #cc0885);
            border-radius: 16px;
            position: relative;
            margin: 0 auto;
        }
        .bank_name,.iconfont{
            font-weight: normal;
        }
        .bank_name{
            font-size: 30px;
            font-weight: normal;
        }
        .bank_card_icon{
            font-size: 50px;
            padding-right: 10px;
        }
        .card_type{
            font-size:16px;
        }
        .card_num{
            font-size: 38px;
            text-align: center;
            padding: 24px 0 10px 0;
        }
        .card_name{
            text-align: right;
        }
        .bg{
            position: absolute;
            top: 0;
            right: 10px;
            opacity: .1;
            font-size: 136px;
        }
        .bank_card_local{
            padding: 40px 0;
            li{
                line-height: 80px;
                font-size: 30px;
                border-bottom: 1px solid #333;
                button{
                    margin-top: 24px;
                }
            }
        }
        .captcha_zoom{
            display: flex;
            justify-content: space-between;
        }
        .sms_box{
            position: relative;
            flex: 1;
        }
        .service24{
            position: absolute;
            top: 0;
            right: 6px;
            line-height: 80px;
        }
        .get_sms{
            height: 80px;
            width: 190px;
            margin-right: 0;
            text-align: center;
        }
    }
    .user_info_bank_bg{
        background-image: url(~img/form_bg.jpg);
        background-repeat: no-repeat;
    }
</style>

