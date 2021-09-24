<template>
	<view class="container">
		<uni-search-bar class="search" cancelButton="none" v-model="SearchValue" @input="EmpChanged"></uni-search-bar>

		<scroll-view class="scrollview" scroll-y="true">
			<uni-list>
				<uni-list-item v-for="(item,index) in EmpList" :key="index"
					:title="item.FNumber + '     ' + item.FName" clickable :isshowcheckbox="false"
					:isshowprogress="false" v-on:click="ItemSelected(item)"></uni-list-item>
			</uni-list>
		</scroll-view>
	</view>
</template>

<script>
	import Config from '../../common/config.js';
	export default {
		data() {
			return {
				SearchValue: '',
				EmpList: [],
				IsSearchFManager: false
			}
		},
		onLoad() {
			this.GetFlag();
			this.LoadEmpData();
		},
		methods: {
			GetFlag:function(){
				let Pages = getCurrentPages();
				let PrevPage = Pages[Pages.length - 2];  //上一个页面	
				//#ifdef APP-PLUS
				this.IsSearchFManager = PrevPage.$vm.IsSearchFManager;											
				//#endif
			},
			LoadEmpData: function() {
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getEmpList',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FName: this.SearchValue,
							FNumber: this.SearchValue
						}
					},
					success: (result) => {
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
							Config.PopAudioContext(false);
							Config.ShowMessage('账号登录异常，请重新登录！');
							return;
						}
						this.EmpList = result.data.ResultData.EmpListInfo.data0;
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);						
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.ShowMessage(ResultMsg);
							Config.PopAudioContext(false);													
						}
					}
				})
			},
			EmpChanged: function() {
				this.LoadEmpData();
			},
			ItemSelected: function(e) {
				let Pages = getCurrentPages();
				let PrevPage = Pages[Pages.length - 2]; //上一个页面		
				//#ifdef H5
				if(this.IsSearchFManager){
					PrevPage._data.TransfersFManagerArray = [e.FItemID, e.FName];
				}
				else{
					PrevPage._data.TransfersSManagerArray = [e.FItemID, e.FName];
				}				
				//#endif				
				//#ifdef APP-PLUS
				if(this.IsSearchFManager){
					PrevPage.$vm.TransfersFManagerArray = [e.FItemID, e.FName];
				}
				else{
					PrevPage.$vm.TransfersSManagerArray = [e.FItemID, e.FName];
				}
				//#endif
				uni.navigateBack();
			}
		}
	}
</script>

<style>	
	.search {
		width: 90%;
	}

	.scrollview {
		height: 1080rpx;
	}
</style>
