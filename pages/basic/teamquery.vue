<template>
	<view class="container">
		<uni-search-bar class="search" cancelButton="none" v-model="SearchValue" @input="TeamChanged"></uni-search-bar>

		<scroll-view class="scrollview" scroll-y="true">
			<uni-list>
				<uni-list-item v-for="(item,index) in TeamList" :key="index"
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
				TeamList: []
			}
		},
		onLoad() {
			this.LoadTeamData();
		},
		methods: {
			LoadTeamData: function() {
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getTeamList',
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
						this.TeamList = result.data.ResultData.TeamListInfo.data0;
					},
					fail: () => {
						Config.PopAudioContext(false);
						Config.ShowMessage('请求数据失败！');
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.PopAudioContext(false);
							Config.ShowMessage(ResultMsg);
							uni.hideLoading();							
						}
					}
				})
			},
			TeamChanged: function() {
				this.LoadTeamData();
			},
			ItemSelected: function(e) {
				let Pages = getCurrentPages();
				let PrevPage = Pages[Pages.length - 2]; //上一个页面		
				//#ifdef H5
				PrevPage._data.SelectTeamArray = [e.FInterId, e.FName];
				//#endif				
				//#ifdef APP-PLUS
				PrevPage.$vm.SelectTeamArray = [e.FInterId, e.FName];
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
