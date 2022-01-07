<template>
	<view class="container">
		<uni-grid :showBorder="false" :square="false" :highlight="true" @change="BoardChanged">
			<uni-grid-item v-for="item in BoardList" :index="item.FBoardId">
                 <text class="griditem gridleft rectangle" :style="{'margin-top': (RectHeight * ((item.FBoardId - 1) / 3 + 1) + FixedHeight * 
				 ((item.FBoardId - 1) / 3)) + 'upx','background-color': CurrentBoardId == item.FBoardId ? '#1890FF' : '#1AAD19'}" v-if="(item.FBoardId - 1) % 3 == 0">{{item.FQty}}</text>
				 <text class="griditem gridmiddle rectangle" :style="{'margin-top': (RectHeight * ((item.FBoardId - 2) / 3 + 1) + FixedHeight * 
				 ((item.FBoardId - 2) / 3)) + 'upx','background-color': CurrentBoardId == item.FBoardId ? '#1890FF' : '#1AAD19'}" v-if="(item.FBoardId - 2) % 3 == 0">{{item.FQty}}</text>
				 <text class="griditem gridright rectangle" :style="{'margin-top': (RectHeight * ((item.FBoardId - 3) / 3 + 1) + FixedHeight * 
				 ((item.FBoardId - 3) / 3)) + 'upx','background-color': CurrentBoardId == item.FBoardId ? '#1890FF' : '#1AAD19'}" v-if="(item.FBoardId % 3) == 0">{{item.FQty}}</text>
			</uni-grid-item>			
		</uni-grid>
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
				AddSOutGroupInterId: 86,
				CurrentBoardId: 4,
				BoardList: [],
				RectHeight: 20,
				FixedHeight: 100
			}
		},
		onLoad() {
			//this.GetDataParam();
            this.QueryAllBoard();
		},
		onNavigationBarButtonTap() {
			
		},
		methods: {
			//获取上一页面传入的参数
			GetDataParam: function(){
				let Pages = getCurrentPages();
				let PrevPage = Pages[Pages.length - 2];  //上一个页面	
				//#ifdef APP-PLUS
				this.AddSOutGroupInterId = PrevPage.$vm.AddSOutGroupInterId;	
				this.CurrentBoardId = PrevPage.$vm.CurrentBoardId;
				//#endif				
			},
			//查询合并单对应的所有板号以及数量
			QueryAllBoard: function() {
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'QuerySOutGroupBoard',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FInterId: this.AddSOutGroupInterId
						}
					},
					success: (result) => {
						console.log(result.data);
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
							Config.ShowMessage('账号登录异常，请重新登录！');
							Config.PopAudioContext(false);
							uni.hideLoading();
							return;
						}
						
						this.BoardList = result.data.ResultData.QuerySOutGroupBoard.data0;						
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
					},
				});
			},
			BoardChanged: function(e){
				//console.log(e.detail.index);
				this.CurrentBoardId = e.detail.index;
			}
		}
	}
</script>

<style>
	.gridleft {
		display: inline-block;
		margin-left: -350upx;		
	}

	.gridmiddle{
		display: inline-block;
		margin-left: -100upx;
	}

	.gridright {
		display: inline-block;
		margin-left: 150upx;
	}

	.griditem {		
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		text-align: center;
		font-size: 25px;
	}
	
	.rectangle{		
		display: inline-block;
		height: 100upx;
		width: 200upx;
		background-color: #1AAD19;	
		border-radius: 20upx;
		border: 1px solid #000000;
	}
	
	.round{
		display: inline-block;
		height: 50upx;
		width: 50upx;
		border-radius: 180upx;
	}
</style>
