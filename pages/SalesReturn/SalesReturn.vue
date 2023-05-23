<template>
	<view>
		<view class="popup">
			<!-- 选择解绑方式 -->
			<!-- <uni-popup ref="inputDialog" >
				<view class="popup-content">
					<view style="margin-right: 100upx;" @click="Change(1)">
						<view class="img-box">
							<image class="img" src="../../static/FCLReturn.png" mode="aspectFit"></image>
						</view>
						<text>
							整箱退货
						</text>
					</view>
					<view style="border: #e7e7e7 solid 1px;"></view>
					<view style="margin-left: 100upx;" @click="Change(2)">
						<view class="img-box">
							<image class="img" src="../../static/SameReturn.png" mode="aspectFit"></image>
						</view>
						<text>
							内盒退货
						</text>
					</view>
				</view>
			</uni-popup> -->
		</view>
		<!-- 退货维护列表 -->
		<view class="search-box">
			<view style="flex: 1;margin-right: 10px;">
				<uni-easyinput @input="inputChange" v-model="searchText" style="width: 100%;" type="text" placeholder="请输入搜索内容"></uni-easyinput>
			</view>
			<!-- <button type="primary" size="mini">搜索</button> -->
			<view style="width: 100px;">
				<uni-data-select
				        v-model="DocumentStatus"
				        :localdata="candidates"
				        @change="DocumentStatusChange"
				        :clear="false"
				></uni-data-select>
			</view>
		</view>
		
		
		<scroll-view class="list-scroll-view" scroll-y="true">
			<view class="list">
				<uni-list>
					<uni-list-item v-for="(item,index) in list" :key="index"  @click="selectBill(item)">
						<template v-slot:body>
							<view class="slot-box">
								<view>
									单据编号：{{item.FBillno}}
								</view>
								<view>
									创建人：{{item.FUserName}}
								</view>
								<view>
									创建日期：{{item.FCreateDate}}
								</view>
								<view>
									单据状态：{{ item.FStatus == 0? '未审核':'已审核' }}
								</view>
							</view>
						</template>
					</uni-list-item>
				</uni-list>
			</view>
		</scroll-view>
	</view>
	
</template>

<script>
import Config from '@/common/config.js'
import {PostRequest} from '@/request/request.js'
export default{
	name:'SalesReturn',
	data(){
		return{
			show:0,
			// billHeader:{}
			DocumentStatus:0,
			candidates:[ 
				{ value: 0, text: "未审核" },
				{ value: 1, text: "已审核" },
				{ value: 2, text: "全部" },
			],
			list:[],
			timer:null,
			searchText:''
		}
	},
	methods:{
		Change(type){
			if(type == 1){
				this.$refs.inputDialog.close()
				uni.navigateTo({
					url:"/pages/SalesReturn/FCLReturn?FID=0&FType=整箱退货"
				})
			}else if(type == 2){
				this.$refs.inputDialog.close()
				uni.navigateTo({
					url:"/pages/SalesReturn/FCLReturn?FID=0&FType=内盒解绑"
				})
			}
		},
		inputChange(){
			if(this.timer){
				clearTimeout(this.timer)
				this.timer = null
			}
			this.timer = setTimeout(async ()=>{
				await this.SearchList()
			},500)
		},
		async DocumentStatusChange(){
			await this.SearchList()
		},
		async SearchList(){
			var data = {"ModuleCode":"SearchSalesReturnList","token":uni.getStorageSync('token'),"ModuleParam":{"Text":this.searchText,"StatusType":this.DocumentStatus}}
			var api = uni.getStorageSync('OtherUrl')
			
			try{
				var result = await PostRequest(api,data)
			}catch(e){
				Config.ShowMessage('网络异常');
				// Config.PopAudioContext(false)
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
			this.list = ResultData
		},
		selectBill(e){
			console.log(e)
			uni.showLoading({
				title:"加载中"
			})
			uni.navigateTo({
				url:`/pages/SalesReturn/FCLReturn?FID=${e.FID}`,
				success: () => {
					uni.hideLoading()
				}
			})
		}
	},
	async beforeMount() {
		// let data = {"ModuleCode":"t_salesReturn_list","token":uni.getStorageSync('token'),"ModuleParam":{"type":"0","FID":"0"}}
		var data = {"ModuleCode":"SearchSalesReturnList","token":uni.getStorageSync('token'),"ModuleParam":{"Text":this.searchText,"StatusType":this.DocumentStatus}}
		var api = uni.getStorageSync('OtherUrl')
		var result = await PostRequest(api,data)
		
		console.log(result)
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
		this.list = ResultData
	},
	mounted() {
		// this.$refs.inputDialog.open()
	},
	async onShow() {
		// let data = {"ModuleCode":"t_salesReturn_list","token":uni.getStorageSync('token'),"ModuleParam":{"type":"0","FID":"0"}}
		var data = {"ModuleCode":"SearchSalesReturnList","token":uni.getStorageSync('token'),"ModuleParam":{"Text":this.searchText,"StatusType":this.DocumentStatus}}
		var api = uni.getStorageSync('OtherUrl')
		var result = await PostRequest(api,data)
		
		console.log(result)
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
		this.list = ResultData
	},
	onNavigationBarButtonTap() {
		// this.$refs.inputDialog.open()
		uni.showLoading({
			title:'加载中'
		})
		uni.navigateTo({
			url:`/pages/SalesReturn/FCLReturn?FID=0`,
			success() {
				uni.hideLoading()
			}
		})
		
	}
}
</script>

<style scoped>
	.popup{
		overflow: hidden;
	}
	.popup-content{
		background-color: aliceblue;
		border-radius: 8px;
		padding: 20px;
		display: flex;
		flex-direction: row;
		text-align: center;
	}
	.items{
		
	}
	.search-box{
		padding-top: 5px;
		padding-left: 5px;
		padding-right: 5px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 40px;
	}
	.img{
		width: 150upx;
		height: 150upx;
	}
	.list-scroll-view{
		width: 100%;
		height: 92vh;
		top: 40px;
	}
	.slot-box{
		color: gray;
		font-size: 14px;
	}
</style>