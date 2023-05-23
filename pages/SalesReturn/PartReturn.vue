<template>
	<view>
		{{type}}
	</view>
</template>

<script>
	//弃用
export default{
	name:"PartReturn",
	data(){
		return{
			type:"新增"
		}
	},
	beforeMount() {

	},
	mounted() {
		console.log("PartReturn")
	},
	onLoad(e) {
		console.log(e)
		if(e.FID!=0){
			this.type = "维护"
		}
	}
}
</script>

<style>
</style>