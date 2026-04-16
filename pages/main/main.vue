<template>
	<view class="container">	
		<!-- 按行分组，每行2个元素，Flex自动适配 -->
		<view class="row">
			<view class="menu-item" v-show="hasPermission(0)" 
				@click="JumpPage('/pages/binding/binding')"
				@longpress="quickScan('/pages/binding/binding')">
				<image class="img" src="../../static/zhuangxiang.png" mode="aspectFit"></image>
				<text class="title">装箱绑定</text>
			</view>
			<view class="menu-item" v-show="hasPermission(1)" 
				@click="JumpPage('/pages/proreport/proreport')"
				@longpress="quickScan('/pages/proreport/proreport')">
				<image class="img" src="../../static/shengchan.png" mode="aspectFit" ></image>
				<text class="title">生产汇报</text>
			</view>
		</view>

		<view class="row">
			<view class="menu-item" v-show="hasPermission(12)" 
				@click="JumpPage('/pages/bindCode/bindCode')"
				@longpress="quickScan('/pages/bindCode/bindCode')">
				<image class="img" src="../../static/bindCode.png" mode="aspectFit"></image>
				<text class="title">标签绑定</text>
			</view>
			<view class="menu-item" v-show="hasPermission(13)" 
				@click="JumpPage('/pages/unbindCode/unbindCode')"
				@longpress="quickScan('/pages/unbindCode/unbindCode')">
				<image class="img" src="../../static/unBind.png" mode="aspectFit"></image>
				<text class="title">标签解绑</text>
			</view>
		</view>

		<view class="row">
			<view class="menu-item" v-show="hasPermission(13)" 
				@click="JumpPage('/pages/SalesReturn/SalesReturn')"
				@longpress="quickScan('/pages/SalesReturn/SalesReturn')">
				<image class="img" src="../../static/returnGoods.png" mode="aspectFit"></image>
				<text class="title">退货解绑</text>
			</view>
			<view class="menu-item" v-show="hasPermission(2)" 
				@click="JumpPage('/pages/proreportinstorage/proreportinstorage1')"
				@longpress="quickScan('/pages/proreportinstorage/proreportinstorage1')">
				<image class="img" src="../../static/proreportinstorage.png" mode="aspectFit"></image>
				<text class="title">汇报入库</text>
			</view>
		</view>

		<view class="row">
			<view class="menu-item" v-show="hasPermission(4)" 
				@click="JumpPage('/pages/purchaseinstorage/outsideinstorage')"
				@longpress="quickScan('/pages/purchaseinstorage/outsideinstorage')">
				<image class="img" src="../../static/outsideinstorage.png" mode="aspectFit"></image>
				<text class="title">采购入库</text>
			</view>
			<view class="menu-item" v-show="hasPermission(4)" 
				@click="JumpPage('/pages/outstorage/outstorage')"
				@longpress="quickScan('/pages/outstorage/outstorage')">
				<image class="img" src="../../static/outstorage.png" mode="aspectFit"></image>
				<text class="title">销售出库</text>
			</view>
		</view>

		<view class="row">
			<view class="menu-item" v-show="hasPermission(5)" 
				@click="JumpPage('/pages/transfers/transfers')"
				@longpress="quickScan('/pages/transfers/transfers')">
				<image class="img" src="../../static/transfers.png" mode="aspectFit"></image>
				<text class="title">仓库调拨</text>
			</view>
			<view class="menu-item" v-show="hasPermission(6)" 
				@click="JumpPage('/pages/inventory/inventory')"
				@longpress="quickScan('/pages/inventory/inventory')">
				<image class="img" src="../../static/inventory.png" mode="aspectFit"></image>
				<text class="title">仓库盘点</text>
			</view>
		</view>

		<view class="row">
			<view class="menu-item" v-show="hasPermission(7)" 
				@click="JumpPage('/pages/inventory/queryinventory')"
				@longpress="quickScan('/pages/inventory/queryinventory')">
				<image class="img" src="../../static/queryinventory.png" mode="aspectFit"></image>
				<text class="title">库存查询</text>
			</view>
			<view class="menu-item" v-show="hasPermission(8)" 
				@click="JumpPage('/pages/outsidetransfers/outsidetransfers')"
				@longpress="quickScan('/pages/outsidetransfers/outsidetransfers')">
				<image class="img" src="../../static/outsidetransfers.png" mode="aspectFit"></image>
				<text class="title">外部调拨</text>
			</view>
		</view>

		<view class="row">
			<view class="menu-item" v-show="hasPermission(10)" 
				@click="JumpPage('/pages/outstorage/receivegoods')"
				@longpress="quickScan('/pages/outstorage/receivegoods')">
				<image class="img" src="../../static/receivegoods.png" mode="aspectFit"></image>
				<text class="title">单据收退</text>
			</view>
			<view class="menu-item" v-show="hasPermission(11)" 
				@click="JumpPage('/pages/outstorage/stockgoods')"
				@longpress="quickScan('/pages/outstorage/stockgoods')">
				<image class="img" src="../../static/stockgoods.png" mode="aspectFit"></image>
				<text class="title">单据备货</text>
			</view>
		</view>
	</view>	
</template>

<script>
	import Config from '../../common/config.js';
	export default {
		data() {
			return {	
				UserPermissionArray:[]
			}
		},	
		onLoad() {
			this.GetUserPermission();
		},
		methods: {
			// 权限判断封装（防止数组越界，适配PDA容错）
			hasPermission(index) {
				if (this.UserPermissionArray.length === 0) return true; // 未加载完成时默认显示
				if (index >= this.UserPermissionArray.length) return false; // 防止数组越界
				return this.UserPermissionArray[index].FIsAllow || false;
			},
			//获取当前用户权限
			GetUserPermission:function(){				
				let UserId = uni.getStorageSync('FUserId');
				// PDA网络不稳定，增加加载提示
				uni.showLoading({
					title: '加载权限...',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'Base_9',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FUserId: UserId
						}
					},
					success: (result) => {
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
							Config.ShowMessage('账号登录异常，请重新登录！');
							Config.PopAudioContext(false);
							// PDA场景：直接返回登录页
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/login/login'
								});
							}, 1500);
							return;
						}
						this.UserPermissionArray = result.data.ResultData.Base_9?.data0 || [];						
					},
					fail: () => {
						Config.ShowMessage('请求权限失败，请检查网络！');
						Config.PopAudioContext(false);
					},
					complete: (resultcomp) => {
						uni.hideLoading(); // 统一隐藏loading
						let ResultMsg = resultcomp.data?.ResultMsg;
						if (ResultMsg && ResultMsg !== 'undefined' && ResultMsg.indexOf('执行成功') === -1) {
							Config.PopAudioContext(false);
							Config.ShowMessage(ResultMsg || '权限加载异常');
						}
					}
				});
			},
			// 长按快捷扫码（PDA高频操作）
			quickScan(url) {
				// 调用PDA扫码API（需根据实际PDA厂商SDK调整）
				uni.scanCode({
					onlyFromCamera: true, // PDA仅用硬件扫码头
					scanType: ['barCode', 'qrCode'],
					success: (res) => {
						// 扫码成功后带参数跳转
						this.JumpPage(`${url}?scanCode=${res.result}`);
					},
					fail: (err) => {
						Config.ShowMessage('扫码失败：' + err.errMsg);
					}
				});
			},
			//跳转到指定页面（PDA性能优化版）			
			JumpPage:function(url){					
				// 简化loading：PDA硬件弱，无需过渡动画
				uni.navigateTo({
					url:url,
					fail: () => {
						Config.ShowMessage('页面跳转失败，请重试');
					}
				});
			}	
		}
	}
</script>

<style scoped>
	/* 容器：适配PDA全屏，优化模块间距 */
	.container {
		display: flex;
		flex-direction: column;
		padding: 20rpx 15rpx; /* 优化内边距，适配小屏握持区 */
		gap: 50rpx; /* 行与行之间的间距，适配PDA握持操作 */
		box-sizing: border-box;
		width: 360px; /* 固定PDA宽度 */
		min-height: 100vh; /* 适配不同高度（640/720） */
		height: 100%;
		padding-bottom: 40rpx; /* 底部预留操作空间 */
		background-color: #f5f5f5; /* PDA屏幕反光，浅背景更护眼 */
		overflow-y: auto; /* 内容超屏时滚动，适配小屏 */
		-webkit-overflow-scrolling: touch; /* 开启PDA弹性滚动，提升体验 */
	}

	/* 每行：容错布局，优化菜单项间距 */
	.row {
		display: flex;
		justify-content: space-between;
		gap: 25rpx; /* 行内两列菜单的核心间距（解决无间隔问题） */
		width: 100%;
		margin-bottom: 0; /* 取消冗余margin，统一用container的gap控制行间距 */
		box-sizing: border-box;
		padding: 0 20rpx; /* 左右留白，避免菜单贴边 */
		align-items: center;
		min-height: 180rpx; /* 👈 新增：给每行增加最小高度，进一步拉开视觉间距 */
	}

	/* 菜单项：PDA触控深度优化（热区≥48px=96rpx） */
	.menu-item {
		flex: 1;
		min-width: calc(50% - 12.5rpx); /* 精准计算宽度，保证gap生效 */
		max-width: calc(50% - 12.5rpx);
		height: 160rpx; /* 适配PDA手持操作高度，提升点击舒适度 */
		background-color: #007AFF;
		border-radius: 16rpx; /* 圆润边角，符合PDA操作习惯 */
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		box-sizing: border-box;
		padding: 20rpx 15rpx; /* 扩大可点击区域 */		
		touch-action: manipulation; /* 禁用双击缩放，提升点击响应 */
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1); /* 轻微阴影，区分模块 */
		/* PDA点击反馈 */
		transition: all 0.1s ease;
	}
	/* 点击态：强化视觉反馈（PDA无鼠标，需明确反馈） */
	.menu-item:active {
		background-color: #0056b3;
		transform: scale(0.96);
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
	}

	/* 图片：固定尺寸+高清适配，避免小屏模糊 */
	.img {
		width: 80rpx; /* 优化尺寸，提升小屏辨识度 */
		height: 80rpx;
		margin-bottom: 12rpx; /* 图片与文字间距 */
		pointer-events: none; /* 防止图片遮挡点击 */
	}

	/* 文字：PDA小屏精准适配（4英寸屏≈12px） */
	.title {
		color: #FFFFFF;
		font-size: 30rpx; /* 优化字号，兼顾可读性和空间 */
		font-weight: 600; /* 加粗提升辨识度（PDA屏幕亮度低） */
		text-align: center;
		line-height: 1.3; /* 行高适配，避免文字溢出 */
		pointer-events: none; /* 防止文字遮挡点击 */
	}

	/* PDA横屏适配（高频操作场景） */
	@media (orientation: landscape) {
		.container {
			padding: 15rpx 20rpx;
			gap: 20rpx; /* 横屏缩小行间距，提升一屏展示量 */
		}
		.row {
			gap: 18rpx; /* 横屏菜单项间距优化 */
		}
		.menu-item {
			flex: 0 0 31%; /* 横屏一行3个，提升操作效率 */
			height: 140rpx;
			min-width: 140rpx;
		}
		.title {
			font-size: 26rpx;
		}
		.img {
			width: 70rpx;
			height: 70rpx;
			margin-bottom: 10rpx;
		}
	}

	/* PDA小屏极致适配（≤4英寸/600rpx） */
	@media (max-width: 600rpx) {
		.container {
			padding: 15rpx 10rpx;
			gap: 20rpx;
		}
		.row {
			gap: 15rpx;
		}
		.menu-item {
			height: 140rpx;
			min-width: 140rpx;
		}
		.title {
			font-size: 28rpx;
		}
		.img {
			width: 70rpx;
			height: 70rpx;
		}
	}

	/* 适配大屏PDA（5英寸+/800rpx） */
	@media (min-width: 800rpx) {
		.container {
			padding: 25rpx 20rpx;
			gap: 30rpx;
		}
		.row {
			gap: 25rpx;
		}
		.menu-item {
			height: 180rpx;
			min-width: 180rpx;
		}
		.title {
			font-size: 32rpx;
		}
		.img {
			width: 90rpx;
			height: 90rpx;
			margin-bottom: 15rpx;
		}
	}

	/* 超低分辨率PDA适配（应急场景） */
	@media (max-width: 500rpx) {
		.menu-item {
			height: 120rpx;
			min-width: 120rpx;
		}
		.title {
			font-size: 26rpx;
		}
		.img {
			width: 60rpx;
			height: 60rpx;
		}
	}
</style>