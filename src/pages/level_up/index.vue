<script>
	export default {
		data:()=>({
			allLevel: '',
			getRewardList: [],
			bonusSetting: '',
			current: {
				name: '',
				value: -1,
				ratio: '',
				bonusPercentageCharges: '',
				bonusCharges: '',
			},
			next: {
				name: '',
				value: -1,
				ratio: '',
				bonusPercentageCharges: '',
				bonusCharges: '',
			},
			currentLevel: {
				val: 0,
				name: ''
			},
			nextLevel: {
				val: 0,
				name: '',
			},
			currentConsumptionLimit: '',//电子平台当前投注量
			allCurrentConsumptionLimit: '',//全平台当前投注量
			consumptionLimit: '', //电子平台需要达到的投注量
			allConsumptionLimit:'', //全平台需要达到的投注量

			isSkeleton: true,
		}),
		created(){
			this.init()
		},
		methods:{
			init(){
				// this.$store.commit('GLOBAL_LOADING', true)
				const playerId = all.tool.GetSession('playerId')
				this.allLevel = all.tool.GetLocal('getAllLevel')
                this.$api.getLevel({ playerId }).then(res=>{
                    const data = res.data
                    let nextLevelVal = data.value + 1
                    this.currentLevel.val = data.value
                    this.currentLevel.name = this.allLevel[data.value].name

                    if(nextLevelVal > this.allLevel[this.allLevel.length-1].value) {
                        nextLevelVal = data.value
                    }else{
                        //单月电子平台
                        this.$api.getPlayerMonthStatus({providerIds: this.allLevel[nextLevelVal].levelUpConfig[0].consumptionSourceProviderId}).then(res=>{
                            this.currentConsumptionLimit = res.data.consumptionAmount
                        })
                        //单月全平台
                        this.$api.getPlayerMonthStatus().then(res=>{
                            this.allCurrentConsumptionLimit = res.data.consumptionAmount
                        })
                        this.consumptionLimit = this.allLevel[nextLevelVal].levelUpConfig[0].consumptionLimit
                        // this.allConsumptionLimit = this.allLevel[nextLevelVal].levelUpConfig[1].consumptionLimit
                    }

                    this.nextLevel.val = nextLevelVal
                    this.nextLevel.name = this.allLevel[nextLevelVal].name

                    //洗码比例
                    this.$api.getRewardList().then(res=>{
                        this.getRewardList = res.data
                        //提款手续费
                        this.$api.getPlatformDetails().then(res=>{
                            this.bonusSetting = res.data.bonusSetting
                            this.switchTab(data.name, data.value)
                            this.isSkeleton = false
                            // this.$store.commit('GLOBAL_LOADING', false)
                        })
                    })

                })
			},
			switchTab(name, val){
				this.current.name = name
				this.next.name = this.allLevel[val + 1]? this.allLevel[val + 1].name : ''
				this.formatData(val)
			},
			formatData(val){
				//等级 value
				this.current.value = val
				const nextValue = val + 1
				this.next.value = nextValue > this.allLevel.length? val : nextValue
				//洗码比例
				const obj = (this.getRewardList).find(o => (o.name).indexOf('洗码') != -1)
				const ratio = obj.param.ratio
				const group = ratio[val]
				const nextGroup = ratio[nextValue]
				this.current.ratio =  all.tool.fixedNum(all.tool.accMul(group[Object.keys(group)[11]], 100), 2)
				this.next.ratio = this.current.name != '白金VIP'? all.tool.fixedNum(all.tool.accMul(nextGroup[Object.keys(nextGroup)[11]], 100), 2) : ''

				//提款手续费
				this.current.bonusPercentageCharges = this.bonusSetting[val].bonusPercentageCharges
				this.next.bonusPercentageCharges = this.current.name != '白金VIP'? this.bonusSetting[nextValue].bonusPercentageCharges : ''
				//免费提款次数
				this.current.bonusCharges = this.bonusSetting[val].bonusCharges
				this.next.bonusCharges = this.current.name != '白金VIP'? this.bonusSetting[nextValue].bonusCharges : ''
			},
            back() {
                this.$router.go(-1)
            }
		},
		computed:{
			consumptionLimitPercent() {
				let percet = (this.currentConsumptionLimit / this.consumptionLimit) * 100
				percet = all.tool.fixedNum(percet, 2)
				return ( percet>100? 100 : percet )
			},
			allConsumptionLimitPercent() {
				let percet = (this.allCurrentConsumptionLimit / this.allConsumptionLimit) * 100
				percet = all.tool.fixedNum(percet, 2)
				return ( percet>100? 100 : percet )
			},
			formatCurrentConsumptionLimit() {
				return all.tool.formatNumber(this.currentConsumptionLimit, 0, 1)
			},
			formatConsumptionLimit(){
				return all.tool.formatNumber(this.consumptionLimit, 0, 1)
			},
			formatAllCurrentConsumptionLimit() {
				return all.tool.formatNumber(this.allCurrentConsumptionLimit, 0, 1)
			},
			formatAllConsumptionLimit(){
				return all.tool.formatNumber(this.allConsumptionLimit, 0, 1)
			}
			// topupLimitPercent() {
			// 	const percet = (this.currentTopupLimit / this.topupLimit) * 100
			// 	return ( percet>100? 100 : percet )
			// },
		},
	}
</script>


<template>
	<div>
		<div class="level_up">
			<transition name="fade" mode="out-in">
				<div v-if="isSkeleton" class="skeleton">
					<div class="skeleton_level_icon"></div>
					<div class="skeleton_progress"></div>
					<div class="skeleton_progress"></div>
					<div class="skeleton_progress"></div>
					<ul class="skeleton_level_detail">
						<li></li>
						<li></li>
					</ul>
				</div>
			</transition>
			<transition name="fade" mode="out-in">
			<div v-if="!isSkeleton" class="level_data">
				<div class="level_icon" v-if='currentLevel.name != nextLevel.name'>
					<div class="now_level">
					<img :src="require(`pages/account/img/${ currentLevel.val }.png`)"/>
					<!--<p>{{ currentLevel.name }}</p>-->
					</div>
					<img src="./img/advance.png" class="blue_arrow"/>
					<div class="next_level">
					<img :src="require(`pages/account/img/${ nextLevel.val }.png`)"/>
					<!--<p>{{ nextLevel.name }}</p>-->
					</div>
				</div>
				<div class="level_icon" v-if='currentLevel.name == nextLevel.name'>
					<div class="now_level">
						<img :src="require(`pages/account/img/${ currentLevel.val }.png`)"/>
					</div>
				</div>
				<!-- <div class="progress_div" v-if='currentLevel.name != nextLevel.name'>
					<p class="progress_title">本月电子流水：<span>{{ consumptionLimitPercent }}%</span></p>
					<div class="level_progress">
						<div class="progress">
							<div class="progress_bg" :style=' { width: consumptionLimitPercent + "%" } '></div>
							<p>{{ formatCurrentConsumptionLimit }} / {{ formatConsumptionLimit }}</p>
						</div>
						<span>{{ consumptionLimitPercent }}%</span>
					</div>
					<p class="progress_title">本月全大厅流水：<span>{{ allConsumptionLimitPercent }}%</span></p>
					<div class="level_progress">
						<div class="progress">
							<div class="progress_bg" :style='{ width: allConsumptionLimitPercent + "%" }'></div>
							<p>{{ formatAllCurrentConsumptionLimit }} / {{ formatAllConsumptionLimit }}</p>
						</div>
						<span>{{ allConsumptionLimitPercent }}%</span>
					</div>
					<p class="tips">备注：上述条件仅需完成其中一项即可升级。</p>
				</div> -->
				<ul class="tab">
					<li
					v-for="(val, key) in allLevel"
					:class="{'current': val.name == current.name}"
					:key="val.value"
					@click='switchTab(val.name, key)'>{{ val.name }}
					</li>
				</ul>
				<div class="level_detail">
					<ul class="now">
						<li v-if="current.value != -1" class="icon">
							<img :src="require(`pages/account/img/${current.value}.png`)" />
						</li>
						<li>{{ current.name }}</li>
						<li>晋级礼金{{ current.value != -1? allLevel[current.value].reward.bonusCredit : '123' }}元</li>
						<li>节日礼品/礼金<span class="have" v-if="current.value > 2">✔</span><span class="nohave" v-else>×</span></li>
						<li>电子笔笔存<span class="have">✔</span></li>
						<li>洗码结算时间({{ current.value > 2 ? '提前结算' : '日结算'}})</li>
						<li>洗码比例{{ current.ratio }}%</li>
						<li>提款手续费{{ current.bonusPercentageCharges }}%</li>
						<li>免费提款次数{{ current.bonusCharges }}次</li>
					</ul>
					<ul class="next" v-if='current.name != "白金VIP"'>
						<li v-if="current.value != -1" class="icon">
							<img :src="require(`pages/account/img/${next.value}.png`)" />
						</li>
						<li>{{ next.name }}</li>
						<li>晋级礼金{{current.value != -1? allLevel[next.value].reward.bonusCredit : '333' }}元</li>
						<li>节日礼品/礼金<span class="have" v-if="next.value > 2">✔</span><span class="nohave" v-else>×</span></li>
						<li>电子笔笔存<span class="have">✔</span></li>
						<li>洗码结算时间({{ next.value > 2 ? '提前结算' : '日结算'}})</li>
						<li>洗码比例{{ next.ratio }}%</li>
						<li>提款手续费{{ next.bonusPercentageCharges }}%</li>
						<li>免费提款次数{{ next.bonusCharges }}次</li>
					</ul>
				</div>
			</div>
			</transition>
		</div>
		<div class="temporary_div">
		</div>
	</div>
</template>

<style lang="postcss" scoped>
	.level_up{
		text-align: center;
		position: relative;
		z-index: 2;
		background-color: #101010;
	}
	.level_icon{
		display: inline-block;
		padding: 0.3rem 0;
		.blue_arrow{
			width: 100px;
			margin: 70px 0.2rem 0 0.2rem;
		}
	}
	.now_level,.next_level{
		width: 220px;
		display: inline-block;
		p{
			color:#860900;
			font-weight: bold;
			margin-top: 0.2rem;
		}
	}
	.tips{
		color:#ff4747;
		font-size: 14px;
	}
	.level_detail{
		display: flex;
	}
	.now,.next{
		flex:1;
		li{
			border-bottom: 1px solid #333333;
			line-height: 80px;
			background-color: #101010;
			color:#fff;
			&:first-child{
				border: none;
			}
			.have{
				color: #38c02a;
				position: absolute;
				font-size: 30px;
				margin-left: 6px;
			}
			.nohave{
				color:#ff4747;
				font-weight: bold;
				position: absolute;
				font-size: 30px;
				margin-left: 6px;
			}
		}
		.icon{
			img{
				width:80px;
				margin: 0.4rem auto 0.2rem auto;
			}
		}
	}
	.progress_div{
		padding: 0.6rem 4%;
		border-top: 16px solid #171717;
	}
	/* progress */
	.progress_title{
		text-align: left;
		margin-left: 5px;
		color: #fff;
		span{
			color:#ffaa0d;
		}
	}
	.level_progress{
		display: flex;
		margin-top: 5px;
		margin-bottom: 15px;
		span{
			font-size:14px;
			display: block;
			width:50px;
			color: #860900;
			font-weight: bold;
		}
	}
	.progress{
		height: 18px;
		background: #481b00;
		border-radius: .2rem;
		flex:1;
		/*box-shadow: 0px -2px 2px rgba(0,0,0,.3) inset;*/
		overflow: hidden;
		position: relative;
		z-index: 1;
		p{
			position:absolute;
			top:0;
			width:100%;
			text-align: center;
			line-height:20px;
			color: #fff;
			font-size:14px;
		}
		.up{
			background: linear-gradient(#158299,#20d8da,#15839a);
		}
	}
	.progress_bg{
		border-radius: .2rem;
		position: absolute;
		background-color: #ffaa0d;
		left: 0;
		top: 0;
		height: 18px;
		/*box-shadow: 0px -2px 1px rgba(66, 42, 2, .5) inset;*/
	}

	.skeleton_level_icon{
		height: 120px;
		background: #ddd;
		width: 80%;
		margin: 0 auto;
	}
	.skeleton_progress{
		height: 30px;
		background: #ddd;
		width: 90%;
		margin: 10px auto;
	}
	.skeleton_level_detail{
		display: flex;
		padding:0 5%;
		li{
			flex:1;
			height: 200px;
			background: #ddd;
			margin: 0 1%;
		}
	}

	.fade-enter-active, .fade-leave-active {
		transition: opacity .5s;
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
		opacity: 0;
	}
	.level_up{
		.skeleton, .level_data{
			position: absolute;
			top:0;
			left: 0;
			right: 0;
			padding-bottom: 55px;
		}
	}

	.tab{
		border-bottom: 1px solid #222222;
		border-top: 16px solid #171717;
		padding: 0;
		li{
			background-color: #101010;
			color:#fefefe;
			line-height: 80px;
			height: 80px;
		}
		.current{
			border-bottom: none;
			color:#ffaa0d;
		}
		.current .tab_current_bottom{
			border-radius: 10px;
			background-color: #ffaa0d;
			width: 60px;
			height: 4PX;
			display: block;
			margin: -8px auto 0px auto;
		}
	}
</style>

