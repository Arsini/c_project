import api from 'lib/api'
export default {
    //玩家当前额度
	GET_CREDIT_DETAIL({ commit, state }) {
		return new Promise ((resolve, reject) => {
			const status = state.accountBalance;
			if(!status){
				state.accountBalance = '加载中...'
			} else {
				state.accountBalance = '更新中...'
			}
			api.getCreditDetail().then(res=>{
				commit('ACCOUNT_BALANCE', res)
				resolve(res)
			},()=>{
				state.accountBalance = '余额获取失败'
				reject('余额获取失败')
			})
		})
	},
}