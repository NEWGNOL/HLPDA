<template>
	<view class="content">
		<view class="history-info">
			<view class="margin-bottom" v-for="item in historyInfo" :key="item.FID">
				<view class="his-box">
					<view class="his-header">
						<view class="his-title">
							<view>{{item.FNumber}}</view>
							<view>{{item.FName}}</view>
							<view>{{item.FModel}}</view>
						</view>
						<view class="his-btn">
							<button  type="primary" @click="UnBindingCode(item)">
								解绑
							</button>
						</view>
					</view>
					<!-- 分割线 -->
					<view>
						<view style="border-bottom: 1px solid #ffe4cd;"></view>
					</view>
					<view class="his-detail">
						<view class="margin-bottom" >
							内箱：{{item.FBoxLabel}}
						</view>
						<view class="margin-bottom">
							产品1：{{item.FLabel1}}
						</view>
						<view v-if="item.FLabel2" class="margin-bottom">
							产品2：{{item.FLabel2}}
						</view>
						<view class="margin-bottom">
							绑定日期：{{item.FDate}}
						</view>
						<view class="margin-bottom">
							操作人：{{item.FUserName}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="tip">
			<view>————仅显示近期30条记录————</view>
		</view>
	</view>
</template>

<script>
import { unBindingCode,getRecently } from '@/request/CodeBindingAPI/api.js'
import Config from '@/common/config.js'
export default{
	name:"bindingCodeHistory",
	data(){
		return{
			historyInfo:[]
		}
	},
	methods:{
		async refresh(){
			let data = {
				ModuleCode:"TM_QRCodeRecently",
				token:uni.getStorageSync('token'),
				ModuleParam:{
					userName:uni.getStorageSync('FUserName'),
				},
			}
			var result = await getRecently(data)
			// console.log(result)
			if(result == -1){
				uni.hideLoading();
				config.ShowMessage('网络错误')
				Config.PopAudioContext(false);
				return
			}
			let ResultCode = result.data.ResultCode;
			let ResultMsg = result.data.ResultMsg;
			if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
				uni.hideLoading();
				Config.ShowMessage('账号登录异常，请重新登录！');
				Config.PopAudioContext(false);
				return;
			}
			if(ResultCode == 'FAIL'){
				uni.hideLoading();
				Config.ShowMessage(ResultMsg);
				Config.PopAudioContext(false);
				return
			}
			let ResultData = result.data.ResultData.data.data0
			console.log(ResultData)
			this.historyInfo = ResultData
		},
		async UnBindingCode(item){
			uni.showModal({
				title:"解绑操作",
				content:"确认解绑？",
				success:async (res)=> {
					if (res.confirm) {
						// console.log('用户点击确定');
						// console.log(item.FID)
						//此处做网络请求处理
						uni.showLoading({
							title: '解绑中'
						});
						let data = {
							ModuleCode:"TM_QRCodeUnBinding",
							token:uni.getStorageSync('token'),
							ModuleParam:{
								BoxLabel:item.FBoxLabel,
								userName:uni.getStorageSync('FUserName'),
							}
						}
						var result = await unBindingCode(data)
						if(result == -1){
							uni.hideLoading();
							config.ShowMessage('网络错误')
							Config.PopAudioContext(false);
							return
						}
						try{
							let ResultCode = result.data.ResultCode;
							let ResultMsg = result.data.ResultMsg;
							if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
								uni.hideLoading();
								Config.ShowMessage('账号登录异常，请重新登录！');
								Config.PopAudioContext(false);
								return;
							}
							if(ResultCode == 'FAIL'){
								uni.hideLoading();
								Config.ShowMessage(ResultMsg);
								Config.PopAudioContext(false);
								return
							}
							let ResultData = result.data.ResultData.TM_QRCodeUnBinding.data0
							console.log(ResultData)
							if(ResultData.code != 0){
								uni.hideLoading();
								Config.ShowMessage(ResultData.Msg);
								Config.PopAudioContext(false);
								return
							}
							await this.refresh()
							uni.hideLoading();
							Config.ShowMessage(ResultData.Msg);
						}catch(e){
							console.log(e)
							uni.hideLoading();
							Config.ShowMessage('异常');
							Config.PopAudioContext(false);
						}
					} else if (res.cancel) {
						// console.log('用户点击取消');
					}
				},
				fail:(err)=> {
					
				}
			})
		},
		
	},
	async beforeMount() {
		let data = {
			ModuleCode:"TM_QRCodeRecently",
			token:uni.getStorageSync('token'),
			ModuleParam:{
				userName:uni.getStorageSync('FUserName'),
			},
		}
		var result = await getRecently(data)
		// console.log(result)
		if(result == -1){
			uni.hideLoading();
			config.ShowMessage('网络错误')
			Config.PopAudioContext(false);
			return
		}
		let ResultCode = result.data.ResultCode;
		let ResultMsg = result.data.ResultMsg;
		if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
			uni.hideLoading();
			Config.ShowMessage('账号登录异常，请重新登录！');
			Config.PopAudioContext(false);
			return;
		}
		if(ResultCode == 'FAIL'){
			uni.hideLoading();
			Config.ShowMessage(ResultMsg);
			Config.PopAudioContext(false);
			return
		}
		let ResultData = result.data.ResultData.data.data0
		this.historyInfo.push(...ResultData)
		// for (let i = 0; i< this.historyInfo.length;i++) {
		// 	this.historyInfo[i].user = 	uni.getStorageSync("FUserName");
		// }
	}
}
</script>

<style scoped>
	.content{
		padding: 15upx;
		font-size: 40upx;
	}
	.history-info{
	}
	.his-title{
		font-size: 14px;
	}
	.his-box{
		box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
		border-radius: 6px;
		padding: 20upx;
	}
	.his-header{
		margin-top: 20upx;
		margin-bottom: 20upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.his-detail{
		display: flex;
		flex-direction: column;
		justify-content: center;
		justify-items: center;
	}
	.margin-bottom{
		/* margin-top: 20upx; */
		margin-bottom: 10upx;
	}
	.tip{
		font-size: 12px;
		color: gray;
		margin-top: 20upx;
		display: flex;	
		flex-direction: column;
		align-items: center;
	}
</style>