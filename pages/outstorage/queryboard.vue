<template>
	<view class="container">
		<scroll-view class="scrollview" scroll-y="true">
			<uni-grid :showBorder="false" :square="false" :highlight="false" @change="BoardChanged">
				<uni-grid-item v-for="item in BoardList" :index="item.FBoardId">
					<view class="rectangle">
						<view :style="{'margin-top': (RectHeight * ((item.FBoardId - 1) / 3 + 1) + FixedHeight *
						  ((item.FBoardId - 1) / 3)) + 'upx',
						  'background-color': CurrentBoardId == item.FBoardId ? '#1890FF' : '#1AAD19'}"
						  	v-if="(item.FBoardId - 1) % 3 == 0">
						  <text class="gridboard">{{item.FBoardId}}</text>
						  <text class="gridpieceleft" v-if="(item.FBoardId - 1) % 3 == 0">{{item.FPieceCount}}件</text>	
						</view>						

                        <view :style="{'margin-top': (RectHeight * ((item.FBoardId - 2) / 3 + 1) + FixedHeight *
						  ((item.FBoardId - 2) / 3)) + 'upx','background-color': CurrentBoardId == item.FBoardId ? '#1890FF' : '#1AAD19'}"
						  v-if="(item.FBoardId - 2) % 3 == 0">
						  <text class="gridboard" >{{item.FBoardId}}</text>
						  <text class="gridpiecemiddle" v-if="(item.FBoardId - 2) % 3 == 0">{{item.FPieceCount}}件</text> 
						</view>
						
                        <view :style="{'margin-top': (RectHeight * ((item.FBoardId - 3) / 3 + 1) + FixedHeight *
						  ((item.FBoardId - 3) / 3)) + 'upx','background-color': CurrentBoardId == item.FBoardId ? '#1890FF' : '#1AAD19'}"
						  	v-if="(item.FBoardId % 3) == 0">
						  <text class="gridboard">{{item.FBoardId}}</text>
						  <text class="gridpieceright" v-if="(item.FBoardId - 3) % 3 == 0">{{item.FPieceCount}}件</text>
						</view>						
					</view>

					<!-- <view class="round" :style="{'margin-left': RoundLeft + 'upx','margin-top': RoundTop + 'upx'}">
				 	<text>1</text>
				 </view> -->
				</uni-grid-item>
			</uni-grid>
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
				// AddSOutGroupInterId: 86,
				// CurrentBoardId: 4,
				AddSOutGroupInterId: 0,
				CurrentBoardId: 0,
				BoardList: [],
				RectHeight: 100,
				FixedHeight: 50,
				RoundLeft: -235,
				RoundTop: -110
			}
		},
		onLoad() {
			this.GetDataParam();
			this.QueryAllBoard();
		},
		onNavigationBarButtonTap() {
			this.GetSelectedBoard();
		},
		methods: {
			//获取上一页面传入的参数
			GetDataParam: function() {
				let Pages = getCurrentPages();
				let PrevPage = Pages[Pages.length - 2]; //上一个页面	
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
						//console.log(result.data);
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
			BoardChanged: function(e) {
				//console.log(e.detail.index);
				this.CurrentBoardId = e.detail.index;
			},
			GetSelectedBoard: function() {
				let Pages = getCurrentPages();
				let PrevPage = Pages[Pages.length - 2]; //上一个页面		
				//#ifdef H5
				PrevPage._data.CurrentBoardId = this.CurrentBoardId;
				PrevPage._data.GetSOutGroupMaxBoard();
				//#endif	

				//#ifdef APP-PLUS	
				PrevPage.$vm.CurrentBoardId = this.CurrentBoardId;
				PrevPage.$vm.GetSOutGroupMaxBoard();
				//#endif
				uni.navigateBack();
			}
		}
	}
</script>

<style>
	.gridboard {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;	
		padding-top: 65upx;		
		font-size: 25px;
	}
	
	.gridpieceleft {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;	
		margin-left: 100upx;
		font-size: 25px;
	}

	.gridpiecemiddle {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;	
		margin-left: 100upx;
		font-size: 25px;
	}

	.gridpieceright {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;	
		margin-left: 100upx;
		font-size: 25px;
	}

	.rectangle {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;	
		height: 220upx;
		width: 220upx;
		background-color: #1AAD19;
		/* border-radius: 20upx; */
		border: 1px solid #000000;
		margin-left: 15upx;
		margin-top: 20upx;		
	}

	.round {
		display: inline-block;
		height: 60upx;
		width: 60upx;
		background-color: #1AAD19;
		border-radius: 180upx;
		font-size: 20px;
	}

	.scrollview {
		width: 100%;
		height: 950upx;
	}
</style>
