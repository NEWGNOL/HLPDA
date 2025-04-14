<template>
	<view class="container">
		<uni-search-bar class="search" cancelButton="none" v-model="SearchValue" @input="ExceptionTypeChanged">
		</uni-search-bar>

		<scroll-view class="scrollview" scroll-y="true">
			<uni-list>
				<uni-list-item v-for="(item,index) in ExceptionTypeList" :key="index" :title="item.FName" clickable
				:isshowcheckbox="false"	:isshowprogress="false" @click="ItemSelected(item)"></uni-list-item>
			</uni-list>
		</scroll-view>		
	</view>
</template>

<script>	
    import Config from '../../common/config.js';
	export default {
		components: {
			Config
		},
		data() {
			return {
				SearchValue: '',				
				ExceptionTypeList: [],
				SelectExceptionType: [],			
			}
		},		
		onLoad() {			
			this.LoadExceptionTypeData();
		},
		methods: {
			LoadExceptionTypeData: function() {
				uni.showLoading({
					title:'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getExceptionTypeList',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FName: this.SearchValue							
						}
					},
					success: (result) => {	
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
							Config.ShowMessage('账号登录异常，请重新登录！');	
							Config.PopAudioContext(false);													
							return;
						}
						this.ExceptionTypeList = result.data.ResultData.ExceptionTypeListInfo.data0;						
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
						uni.hideLoading();
					}
				});				
			},
			ExceptionTypeChanged: function() {
				this.LoadWorkShopData();
			},
			ItemSelected: function(e) {
				//console.log(e);
				let Pages = getCurrentPages();			
				let PrevPage = Pages[Pages.length - 2];  //上一个页面						
				//#ifdef H5
				PrevPage._data.SelectExceptionTypeArray = [e.FInterID, e.FName];	
				//#endif				
				//#ifdef APP-PLUS			
				PrevPage.$vm.SelectExceptionTypeArray = [e.FInterID, e.FName];
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
	
	.scrollview{		
		height: 1080rpx;		
	}
</style>
