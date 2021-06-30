<template>
	<view class="content">
		<uni-search-bar class="search" cancelButton="none" v-model="SearchValue" @input="TeamChanged"></uni-search-bar>

		<scroll-view class="scrollview" scroll-y="true">
			<uni-list>
				<uni-list-item v-for="(item,index) in TeamList" :key="index" :title="item.FNumber + '     ' + item.FName" clickable
				:isshowcheckbox="false" :isshowprogress="false" v-on:click="ItemSelected(item)"></uni-list-item>
			</uni-list>
		</scroll-view>
	</view>
</template>

<script>
	import Config from '../../common/config.js';
	export default {
		data() {
			return {	
				SearchValue:'',
				TeamList: []			
			}
		},
		onLoad() {
	      this.LoadTeamData();		  
		},		    
		methods: {		
			LoadTeamData: function(){
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getTeamList',
						token: uni.getStorageSync('token'),
								ModuleParam:{
									FName: this.SearchValue,
									FNumber: this.SearchValue
								}
					},
					success: (result) => {						
						this.TeamList = result.data.ResultData.TeamListInfo.data0;						
					},
					fail:() =>{
						Config.ShowMessage('请求失败！');
						Config.PopAudioContext();
					}
				})
			},
			TeamChanged: function() {				
				this.LoadTeamData();				
			},
			ItemSelected: function(e){						
				let Pages = getCurrentPages();				
				let PrevPage = Pages[Pages.length - 2];  //上一个页面		
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
