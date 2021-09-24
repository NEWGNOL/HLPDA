<template>
	<view class="container">
		<uni-search-bar class="search" cancelButton="none" v-model="SearchValue" @input="ItemChanged"></uni-search-bar>
	
		<scroll-view class="scrollview" scroll-y="true">
			<uni-list>
				<uni-list-item v-for="(item,index) in ItemList" :key="index"
					:title="item.FNumber + '     ' + item.FModel" clickable :isshowcheckbox="false"
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
				ItemList: []				
			}
		},
		onLoad() {			
			this.LoadItemData();
		},
		methods: {			
			LoadItemData: function() {
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'GetMaterialListInfo',
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
						this.ItemList = result.data.ResultData.GetMaterialListInfo.data0;
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
			ItemChanged: function() {
				this.LoadItemData();
			},
			ItemSelected: function(e) {
				let Pages = getCurrentPages();
				let PrevPage = Pages[Pages.length - 2]; //上一个页面		
				//#ifdef H5
				PrevPage._data.MaterialArray = [e.FItemID, e.FName, e.FNumber, e.FModel];								
				//#endif				
				//#ifdef APP-PLUS
				PrevPage.$vm.MaterialArray = [e.FItemID, e.FName, e.FNumber, e.FModel];				
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
