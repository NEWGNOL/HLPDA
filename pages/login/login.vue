<template>
	<view class="content">		
		<image src="../../static/login.png" class="img" mode="widthFix"></image>

		<text class="tableft" v-bind:class="{selecttab : IsShowLoginView}" v-on:click="ClickTabTitle(true)">登录</text>
		<view class="tableftline" v-bind:class="{selecttabline : IsShowLoginView}"></view>

		<text class="tabright" v-bind:class="{selecttab : !IsShowLoginView}"
			v-on:click="ClickTabTitle(false)">IP地址</text>
		<view class="tabrightline" v-bind:class="{selecttabline : !IsShowLoginView}"></view>

		<view class="summary" v-show="IsShowLoginView">
			<!-- <canvas class="loginpagecanvas" canvas-id="logincanvas" id="logincanvas" v-show="IsShowLoginView"> -->
				<view class="usernametext">用户名：</view>
				<input v-model="username" placeholder="请输入用户名" class="cla" :focus="focus1" @confirm="tabEnter1" />
				<view class="passwordtext">密码：</view>
				<input password="true" placeholder="请输入密码" v-model="password" class="cla" :focus="focus2"
					@confirm="tabEnter2" />
				<button class="button" @click="request()">确认</button>
		<!-- 	</canvas> -->
		</view>

		<view class="summary" v-show="!IsShowLoginView">
			<!-- <canvas class="loginpagecanvas" canvas-id="configcanvas" id="configcanvas" v-show="!IsShowLoginView"> -->
				<view class="usernametext">IP地址：</view>
				<input v-model="IPAddress" placeholder="请输入IP地址" class="cla"/>
				<!-- <view class="usernametext">域名：</view>
				<input v-model="DomainName" placeholder="请输入域名" class="cla"/> -->
				<button class="button" v-on:click="SaveLoginData()">确认</button>
		<!-- 	</canvas> -->
		</view>
	</view>
</template>

<script>
	import Config from '../../common/config.js';
	export default {
		data() {
			return {
				username: "",
				password: "",
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
			this.AndroidCheckUpdate();
		},
		methods: {			
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
				this.username = uni.getStorageSync('FUsername');
				this.password = uni.getStorageSync('FPassword');
			},
			//登录验证
			request() {
				var username = this.username;
				var password = this.password;
				uni.request({
					url: uni.getStorageSync('LoginUrl'),
					data: '{"Sign":"sl2021","FUsername":"' + username + '","FPassword":"' + this.password + '"}',
					method: 'POST',
					success: (res) => {						
						if (res.data.Result == 1)
						{
							uni.showLoading({
								title: 'Loading'
							});
							uni.setStorageSync("FUsername", username);
							uni.setStorageSync("FPassword", password);
							uni.setStorageSync("FUserId", res.data.FUserId);
							uni.setStorageSync("token", res.data.Token);
							uni.redirectTo({
								url: '/pages/main/main'
							});
							uni.hideLoading();
						} 
						else {
							Config.ShowMessage('用户名或密码错误！');
							Config.PopAudioContext();
						}
					},
					fail: () => {	
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext();
					}
				})
			},
			//保存登录数据
			SaveLoginData: function() {
				if (this.IPAddress == '') {
					Config.ShowMessage('请输入IP地址！');
					return;
				}
				uni.setStorageSync("FIPAddress", this.IPAddress);
				uni.setStorageSync('LoginUrl', 'http://' + uni.getStorageSync('FIPAddress') + '/api/myapi/login');
				uni.setStorageSync('OtherUrl', 'http://' + uni.getStorageSync('FIPAddress') + '/api/fastmodule');
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
			AndroidCheckUpdate:function(){
		            var _this=this;  
			        uni.request({  
			        url: uni.getStorageSync('OtherUrl'),
		            method: 'POST',  
									                    data: {
															ModuleCode: 'Base_6',
															token: uni.getStorageSync('token'),												
														},  
									                    success: res => {  
															console.log(res.data);
									                        
									                            if(plus.networkinfo.getCurrentType()!=3){  
									                                uni.showToast({  
									                                    title: '有新的版本发布，检测到您目前非Wifi连接，为节约您的流量，程序已停止自动更新，将在您连接WIFI之后重新检测更新。',  
									                                    mask: false,  
									                                    duration: 5000,  
									                                    icon:"none"  
									                                });  
									                                return;  
									                            }  
									                            uni.showToast({  
									                                title: '有新的版本发布，检测到您目前为Wifi连接，程序已启动自动更新。新版本下载完成后将自动弹出安装程序。',  
									                                mask: false,  
									                                duration: 5000,  
									                                icon:"none"  
									                            });  
									                            var dtask = plus.downloader.createDownload( "http://xxxx.com/app.apk", {}, function ( d, status ) {  
									                                    // 下载完成  
									                                    if ( status == 200 ) {   
									                                        plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename),{},{},function(error){  
									                                            uni.showToast({  
									                                                title: '安装失败',  
									                                                mask: false,  
									                                                duration: 1500  
									                                            });  
									                                        })  
									                                    } else {  
									                                         uni.showToast({  
									                                            title: '更新失败',  
									                                            mask: false,  
									                                            duration: 1500  
									                                         });  
									                                    }    
									                                });  
									                            dtask.start();   
									                         
									                    },  
									                    fail: () => {},  
									                    complete: () => {}  
			}); 
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

	.tableftline {
		width: 15%;
		height: 5rpx;
		margin-right: 500rpx;
	}

	.tabrightline {
		width: 20%;
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
		margin-left: 50rpx;
		margin-top: 50rpx;
	}

	.passwordtext {
		font-size: 40rpx;
		margin-left: 50rpx;
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
