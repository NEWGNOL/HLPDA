<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	/*每个页面的容器样式*/
	.uni-data-checklist .checklist-group .checklist-box .checklist-content .checklist-text{
		font-size: 20px !important;
		line-height: 20px !important;
	}
	.container {		
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	/*搜索框样式*/
	.search {
		position: absolute;
		width: 70%;
		margin-left: 5upx;
	}
	
	/*单据状态样式*/
	.billstatus {
		margin-top: -90upx;
		margin-left: 570upx;
	}
	/* 键盘样式 */
	.keyboard {
		display: flex;
	}
	/* 页面单据头样式 */
	.pagehead{
		width: 100%;
		height: 130upx;
		background-color: #1AAD19;
	}
</style>
