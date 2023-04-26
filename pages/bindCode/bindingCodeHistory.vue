<template>
	<view class="content">
		<view class="history-info">
			<view class="margin-bottom" v-for="item in historyInfo" :key="item.id">
				<view class="his-box">
					<view class="his-header">
						<view class="his-title">内箱：{{item.wrapBox}}</view>
						<view class="his-btn">
							<button  type="primary" @click="UnBindingCode(item)">
								解绑
							</button>
						</view>
					</view>
					<!-- 分割线 -->
					<view>
						<view style="border-bottom: 1px solid #ffe4cd;"></view>
					</view>
					<view class="his-detail">
						<view class="margin-bottom">
							产品1：{{item.label1}}
						</view>
						<view class="margin-bottom">
							产品2：{{item.label2}}
						</view>
						<view class="margin-bottom">
							绑定日期：{{item.date}}
						</view>
						<view class="margin-bottom">
							操作人：{{item.user}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="tip">
			<view>————仅显示近期20条记录————</view>
		</view>
	</view>
</template>

<script>
export default{
	name:"bindingCodeHistory",
	data(){
		return{
			historyInfo:[
				{
					id:"1",
					wrapBox:"SL-125S4561",
					label1:"ws5425dzdwa",
					label2:"wskxjs142wd",
					date:"2023/4/26",
					user:"梁健林"
				},
				{
					id:"2",
					wrapBox:"SL-125S4561",
					label1:"ws5425dzdwa",
					label2:"wskxjs142wd",
					date:"2023/4/26",
					user:"龙文"
				}
			]
		}
	},
	methods:{
		UnBindingCode(item){
			uni.showModal({
				title:"解绑操作",
				content:"确认解绑？",
				success:(res)=> {
					if (res.confirm) {
						// console.log('用户点击确定');
						console.log(item.id)
						//此处做网络请求处理
					} else if (res.cancel) {
						// console.log('用户点击取消');
					}
				},
				fail:(err)=> {
					
				}
			})
		}
	}
}
</script>

<style scoped>
	.content{
		padding: 15upx;
		font-size: 40upx;
	}
	.history-info{
	}
	.his-box{
		box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
		border-radius: 6px;
		padding: 20upx;
	}
	.his-header{
		margin-top: 20upx;
		margin-bottom: 20upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.his-detail{
		display: flex;
		flex-direction: column;
		justify-content: center;
		justify-items: center;
	}
	.margin-bottom{
		/* margin-top: 20upx; */
		margin-bottom: 10upx;
	}
	.tip{
		font-size: 12px;
		color: gray;
		margin-top: 20upx;
		display: flex;	
		flex-direction: column;
		align-items: center;
	}
</style>