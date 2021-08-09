<template>
	<view class="container">
		<uni-search-bar class="search" cancelButton="none" v-model="SearchValue" @input="StockChanged"></uni-search-bar>

		<scroll-view class="scrollview" scroll-y="true">
			<uni-list>
				<uni-list-item v-for="(item,index) in StockList" :key="index" :title="item.FNumber + '     ' + item.FName" 
				clickable v-on:click="ItemSelected(item)">
				</uni-list-item>
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
				StockList: []
			}
		},
		onLoad() {
			this.LoadStockData();
		},
		methods: {
			LoadStockData: function() {
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getStockList',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FName: this.SearchValue,
							FNumber: this.SearchValue
						}
					},
					success: (result) => {
						//console.log(result.data);
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
							Config.PopAudioContext(false);
							Config.ShowMessage('账号登录异常，请重新登录！');
							return;
						}
						this.StockList = result.data.ResultData.StockListInfo.data0;
					},
					fail: () => {
						Config.PopAudioContext(false);
						Config.ShowMessage('请求数据失败！');
						return;
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.PopAudioContext(false);
							Config.ShowMessage(ResultMsg);
							uni.hideLoading();	
							return;						
						}
					}
				})
			},
			StockChanged: function() {
				this.LoadStockData();
			},
			ItemSelected: function(e) {
				let Pages = getCurrentPages();
				let PrevPage = Pages[Pages.length - 2]; //上一个页面		
				//#ifdef H5
				PrevPage._data.SelectWareHouseArray = [e.FItemID, e.FName];
				//#endif				
				//#ifdef APP-PLUS
				PrevPage.$vm.SelectWareHouseArray = [e.FItemID, e.FName];
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
