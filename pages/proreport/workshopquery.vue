<template>
	<view class="content">
		<uni-search-bar class="search" cancelButton="none" v-model="SearchValue" @input="WorkShopChanged">
		</uni-search-bar>

		<scroll-view class="scrollview" scroll-y="true">
			<uni-list>
				<uni-list-item v-for="(item,index) in WorkShopList" :key="index" :title="item.FName" clickable
				:isshowcheckbox="false"	@click="ItemSelected(item)"></uni-list-item>
			</uni-list>
		</scroll-view>
		
		<uni-popup ref="PopupMessage" type="message"> <!-- @change="Change" -->
			<uni-popup-message :type="MessageType" :message="Message" :duration="3000"/>
		</uni-popup>
	</view>
</template>

<script>	
    import Config from '../../common/config.js';
	export default {
		data() {
			return {
				SearchValue: '',
				WorkShopList: [],
				SelectWorkShop: [],
				Message:'',
				MessageType:'Success',
			}
		},		
		onLoad() {			
			this.LoadWorkShopData();
		},
		methods: {
			LoadWorkShopData: function() {
				uni.showLoading({
					title:'Loading'					
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getDeptList',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FName: this.SearchValue
						}
					},
					success: (result) => {
						let DataArray = result.data.ResultData.DeptListInfo.data0;
						if(DataArray != 'undefined')
						{
						   this.WorkShopList = DataArray;
						}
					},
					fail: () => {
						Config.ShowMessage('请求失败！');	
					}
				});
				uni.hideLoading();
			},
			WorkShopChanged: function() {
				this.LoadWorkShopData();
			},
			ItemSelected: function(e) {
				let Pages = getCurrentPages();			
				let PrevPage = Pages[Pages.length - 2];  //上一个页面			
				//#ifdef H5
				PrevPage._data.SelectWorkShopArray = [e.FItemId, e.FName];	
				//#endif				
				//#ifdef APP-PLUS
				PrevPage.$vm.SelectWorkShopArray = [e.FItemId, e.FName];
				//#endif
				uni.navigateBack();	
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.search {
		width: 90%;
	}
	.scrollview{
		/* margin-top: 10rpx; */
		height: 1080rpx;		
	}
</style>
