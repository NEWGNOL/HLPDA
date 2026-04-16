<template>
	<view class="container">
		<!-- 登录图片适配 -->
		<image src="../../static/login.png" class="img" mode="widthFix"></image>

		<!-- 标签切换区域 - 重构布局 -->
		<view class="tab-wrap">
			<view class="tab-item" @click="ClickTabTitle(true)">
				<text class="tab-text" :class="{selecttab : IsShowLoginView}">登录</text>
				<view class="tab-line" :class="{selecttabline : IsShowLoginView}"></view>
			</view>
			<view class="tab-item" @click="ClickTabTitle(false)">
				<text class="tab-text" :class="{selecttab : !IsShowLoginView}">网络配置</text>
				<view class="tab-line" :class="{selecttabline : !IsShowLoginView}"></view>
			</view>
		</view>

		<!-- 登录表单 -->
		<view class="form-wrap" v-show="IsShowLoginView">
			<view class="form-item">
				<view class="form-label">用户名：</view>
				<usernamesearch 
					class="form-input" 
					:candidates="UserNameArray" 
					placeholder="请输入用户名" 
					v-model="UserName"
					@input="SearchInput"
				></usernamesearch>
			</view>

			<view class="form-item">
				<view class="form-label">密码：</view>
				<input 
					password="true" 
					placeholder="请输入密码" 
					v-model="Password" 
					class="form-input" 
					:focus="focus2"
					@confirm="tabEnter2" 
				/>
			</view>
			
			<button class="form-btn" @click="Request()">确认</button>
		</view>

		<!-- 网络配置表单 -->
		<view class="form-wrap" v-show="!IsShowLoginView">
			<view class="form-item">
				<view class="form-label">IP地址：</view>
				<input 
					v-model="IPAddress" 
					placeholder="请输入IP地址" 
					class="form-input"
				/>
			</view>
			<button class="form-btn" @click="SaveLoginData()">确认</button>
		</view>
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
				UserName: '',
				UserNameSearch: '',
				UserNameArray: [],
				Password: '',
				IsShowLoginView: true,
				IPAddress: '',
				DomainName: '',
				focus1: false,
				focus2: false
			}
		},
		onReady() {
			this.CreateGraphic();
		},
		onLoad() {
			this.LoadLoginData();
			this.AutoCheckUpdate();
			this.GetScreenHeight();	
		},
		methods: {
			GetScreenHeight: function() {
				uni.getSystemInfo({
					success: (res) => {
						//获取系统信息，可使用窗口的高度和宽度
						let height = res.screenHeight; 
						let width = res.screenWidth;
						console.log('res',res);
						//console.log('screenHeight：' + height + '  screenWidth：' + width);
						// 640*360
						// 720*360
						
						// http://localhost:8080/#/
					}
				});
			},
			//输入搜索
			SearchInput: function(e) {
				let OldUserName = uni.getStorageSync('FUserName');
				let OldPassword = uni.getStorageSync('FPassword');
				if (e == OldUserName) {
					this.Password = OldPassword;
				} else {
					this.Password = '';
				}
			},
			//绘制图形
			CreateGraphic: function() {
				var LoginContext = uni.createCanvasContext('logincanvas');
				LoginContext.setStrokeStyle("#000000");
				LoginContext.setLineWidth(5);
				LoginContext.rect(0, 0, 350, 250);
				LoginContext.stroke();
				LoginContext.draw();

				var ConfigContext = uni.createCanvasContext('configcanvas');
				ConfigContext.setStrokeStyle("#000000");
				ConfigContext.setLineWidth(5);
				ConfigContext.rect(0, 0, 350, 250);
				ConfigContext.stroke();
				ConfigContext.draw();
			},
			//点击页面标题
			ClickTabTitle: function(IsShowLoginViewParam) {
				if (this.IsShowLoginView != IsShowLoginViewParam) {
					this.IsShowLoginView = !this.IsShowLoginView;
				}
			},
			//加载登录数据
			LoadLoginData: function() {
				this.IPAddress = uni.getStorageSync('FIPAddress');
				this.UserName = uni.getStorageSync('FUserName');
				this.Password = uni.getStorageSync('FPassword');
				this.UserNameSearch = uni.getStorageSync('FUserNameSearch');
				this.UserNameArray = this.UserNameSearch.split(',');
			},
			//登录验证
			Request() {
				let me = this;
				uni.request({
					url: uni.getStorageSync('LoginUrl'),
					data: '{"Sign":"sl2021","FUsername":"' + me.UserName + '","FPassword":"' + me.Password + '"}',
					method: 'POST',
					success: (result) => {
						//console.log(result.data);
						if (result.data.Result == 1) {
							if (me.UserNameSearch.indexOf(me.UserName) == -1) {
								if (me.UserNameSearch.length == 0) {
									me.UserNameSearch += me.UserName;
								} else {
									me.UserNameSearch += ',' + me.UserName;
								}
							}

							uni.showLoading({
								title: 'Loading',
								mask: true
							});
							uni.setStorageSync("FUserName", me.UserName);
							uni.setStorageSync("FPassword", me.Password);
							uni.setStorageSync("FUserId", result.data.FUserId);
							uni.setStorageSync("token", result.data.Token);
							uni.setStorageSync("FUserNameSearch", me.UserNameSearch);
							uni.redirectTo({
								url: '/pages/main/main'
							});
							uni.hideLoading();
						} else {
							Config.PopAudioContext(false);
							Config.ShowMessage(result.data.Msg);
						}
					},
					fail: () => {
						Config.PopAudioContext(false);
						Config.ShowMessage('请求数据失败！');
					}
				})
			},
			//保存登录数据
			SaveLoginData: function() {
				if (this.IPAddress == '') {
					Config.PopAudioContext(false);
					Config.ShowMessage('请输入IP地址！');
					return;
				}
				uni.setStorageSync("FIPAddress", this.IPAddress);
				uni.setStorageSync('LoginUrl', 'http://' + uni.getStorageSync('FIPAddress') + '/api/myapi/login');
				uni.setStorageSync('OtherUrl', 'http://' + uni.getStorageSync('FIPAddress') + '/api/fastmodule');
				Config.PopAudioContext(true);
				Config.ShowMessage('参数配置成功！');
			},
			tabEnter1() {
				var username = this.username;
				if (username.trim() != "") {
					this.focus2 = false;
					this.$nextTick(function() {
						this.focus2 = true
					})
				} else {
					this.username = "";
					this.focus1 = false;
					this.$nextTick(function() {
						this.focus1 = true
					})
				}
			},
			tabEnter2() {
				this.request()
			},
			//自动检测更新
			AutoCheckUpdate: function() {
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'Base_6'
					},
					success: (result) => {
						let Version = result.data.ResultData.Base_6.data0.FVersion;
						if (plus.runtime.versionCode < Version) {
							Config.ShowMessage('有新的版本发布，程序已启动自动更新,新版本下载完成后将自动弹出安装程序！');
							let APKFilePath = result.data.ResultData.Base_6.data0.FPath;
							let APKFile = plus.downloader.createDownload(APKFilePath, {}, function(
								d, status) {
								if (status == 200) {
									//下载成功 								
									plus.runtime.install(plus.io.convertLocalFileSystemURL(d
										.filename), {}, {}, function(error) {
										Config.PopAudioContext(false);
										Config.ShowMessage('安装失败！');
									})
								} else {
									//下载失败
									Config.PopAudioContext(false);
									Config.ShowMessage('更新失败！');
								}
							});
							APKFile.start();
						}
					},
					fail: () => {
						Config.PopAudioContext(false);
						Config.ShowMessage('请求更新资源失败！');
					}
				});
			}
		}
	}
</script>

<style>
	/* 基础容器适配PDA 360*640 */
	.container {
		width: 360px;
		min-height: 640px;
		margin: 0 auto;
		padding: 15px;
		background: #f5f5f5;
		box-sizing: border-box;
	}

	/* 登录图片适配 */
	.img {
		width: 100%;
		max-width: 320px;
		height: auto;
		display: block;
		/* margin: 10px; */
	}

	/* 标签切换区域 */
	.tab-wrap {
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin: 10px 0 20px;
	}

	.tab-item {
		display: flex;
		flex-direction: column;
		align-items: center;		
	}

	.tab-text {
		font-size: 30px;
		margin-bottom: 5rpx;	
		padding: 30rpx;
	}

	.tab-line {
		width: 40px;
		height: 3px;
		background: transparent;
		transition: background-color 0.3s;
	}

	/* 表单区域 */
	.form-wrap {
		padding: 10rpx;
	}

	.form-item {
		display: flex;
		align-items: center;
		margin-bottom: 25px;
	}

	.form-label {
		font-size: 20px;
		width: 80px;
		text-align: right;
		margin-right: 10px;
	}

	.form-input {
		flex: 1;
		height: 45px;
		line-height: 45px;
		padding: 0 10px;
		border: 1px solid #888;
		border-radius: 4px;
		font-size: 20px;
		/* 加大点击区域 */
		min-width: 200px;
	}

	.form-btn {
		width: 100%;
		height: 50px;
		line-height: 50px;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 8px;
		text-align: center;
		font-size: 18px;
		border: none;
		margin-top: 20px;
		/* 适配触控 */
		touch-action: manipulation;
	}

	/* 选中态样式 */
	.selecttab {
		color: #007AFF;
		font-weight: bold;
	}

	.selecttabline {
		background-color: #007AFF;
	}

	/* 画布适配 */
	.loginpagecanvas {
		height: 200px;
		width: 320px;
		margin: 0 auto;
	}

	/* 适配PDA小屏滚动 */
	::-webkit-scrollbar {
		width: 4px;
		height: 4px;
	}

	::-webkit-scrollbar-thumb {
		border-radius: 2px;
		background: #ccc;
	}
</style>
