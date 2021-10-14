<template>
	<view class="container">
		<scroll-view class="scrollview" scroll-y="true">
			<uni-list>
				<uni-list-item v-for="(item,index) in QtyExceptionList" :key="index" :title="item.FNumber 
			 		+ '/' + item.FModel + '\n'  + '批号：' + item.FBatchNo + '\n'  + '仓库：' + item.FStockName 
					+ '/' + '库存：' + item.FInventoryQty + '只' + '\n'  + '应发数量：'+ item.FShouldSendQty + '只/' 
					+ Math.round(item.FShouldSendQty/item.FInPackPreQty,2)
					+ '件' + '\n' + '实发数量：'+ item.FRealSendQty + '只/' 
					+ Math.round(item.FRealSendQty/item.FInPackPreQty,2) + '件'" 
				    isshowprogress clickable v-bind:percent="Math.round((item.FRealSendQty / item.FShouldSendQty) * 100, 0)">
				</uni-list-item>
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
		data(){
			return {				
				QtyExceptionList: []				
			}
		},		
		onLoad() {	
			this.GetQtyExceptionList();			
		},		
		onNavigationBarButtonTap() {
			this.CheckAudit();
		},
		methods:{
			GetQtyExceptionList: function(){
				let Pages = getCurrentPages();
				let PrevPage = Pages[Pages.length - 2];  //上一个页面	
				//#ifdef APP-PLUS							
				this.QtyExceptionList = PrevPage.$vm.QtyExceptionList;				
				//#endif
			},
			//确认是否审核
			CheckAudit: function(){
				uni.showModal({
					title: '提示',
					content: '该单据存在应发数量和实发数量不一致的情况，是否确认审核此单据？',
					success: function(result) {
					if (result.confirm) {
						   let Pages = getCurrentPages();
						   let PrevPage = Pages[Pages.length - 2];  //上一个页面	
						   uni.navigateBack();
						   //#ifdef APP-PLUS							
						   PrevPage.$vm.AuditStorageOutByQtyException();										   
						   //#endif						   
					   }
					}
				});
			}
		},
	}
</script>

<style>
	.scrollview {
		width: 100%;
		height: 1100upx;
		margin-top: 20upx;
	}
</style>
