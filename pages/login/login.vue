<template>
	<view class="container">
		<image src="../../static/login.png" class="img" mode="widthFix"></image>

		<text class="tableft" v-bind:class="{selecttab : IsShowLoginView}" v-on:click="ClickTabTitle(true)">登录</text>
		<view class="tableftline" v-bind:class="{selecttabline : IsShowLoginView}"></view>

		<text class="tabright" v-bind:class="{selecttab : !IsShowLoginView}"
			v-on:click="ClickTabTitle(false)">网络配置</text>
		<view class="tabrightline" v-bind:class="{selecttabline : !IsShowLoginView}"></view>

		<view class="summary" v-show="IsShowLoginView">
			<!-- <canvas class="loginpagecanvas" canvas-id="logincanvas" id="logincanvas" v-show="IsShowLoginView"> -->
			<view class="usernametext">用户名：</view>
			<usernamesearch class="cla" :candidates="UserNameArray" placeholder="请输入用户名" v-model="UserName"
				@input="SearchInput"></usernamesearch>
			<!-- <input v-model="username" placeholder="请输入用户名" class="cla" :focus="focus1" @confirm="tabEnter1" /> -->
			<view class="passwordtext">密码：</view>
			<input password="true" placeholder="请输入密码" v-model="Password" class="cla" :focus="focus2"
				@confirm="tabEnter2" />
			<button class="button" @click="Request()">确认</button>
			<!-- 	</canvas> -->
		</view>

		<view class="summary" v-show="!IsShowLoginView">			
			<view class="usernametext">IP地址：</view>
			<input v-model="IPAddress" placeholder="请输入IP地址" class="cla">			
			<button class="button" v-on:click="SaveLoginData()">确认</button>		
		</view>
	</view>
</template>

<script>
	import Config from '../../common/config.js';
	export default {
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
		},
		methods: {
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
							Config.ShowMessage('用户名或密码错误！');
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
	.tableftline {
		width: 15%;
		height: 5rpx;
		margin-right: 500rpx;
	}

	.tabrightline {
		width: 29%;
		height: 5rpx;
		margin-left: 400rpx;
	}

	.img {
		width: 400rpx;
		height: 200rpx;
		margin-top: 50rpx;
	}

	.tableft {
		font-size: 50rpx;
		margin-top: 100rpx;
		margin-left: -500rpx;
	}

	.tabright {
		font-size: 50rpx;
		margin-top: -80rpx;
		margin-left: 400rpx;
	}

	.button {
		margin-top: 100rpx;
		width: 250rpx;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50rpx;
	}

	.usernametext {
		font-size: 40rpx;
		margin-left: 30rpx;
		margin-top: 50rpx;
	}

	.passwordtext {
		font-size: 40rpx;
		margin-left: 30rpx;
		margin-top: 100rpx;
	}

	.cla {
		width: 400rpx;
		border: 5rpx solid;
		border-color: #888888;
		margin-left: 220rpx;
		margin-top: -55rpx;
	}

	.summary {
		height: 500rpx;
		margin-top: 50rpx;
		display: grid;
		flex-direction: row;
	}

	.selecttab {
		color: #007AFF;
	}

	.selecttabline {
		background-color: #007AFF;
	}

	.loginpagecanvas {
		height: 250px;
		width: 350px;
	}
</style>
