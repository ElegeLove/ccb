<template>
	<div class="wrap">
		<div class="wrap">
			<div class="wBox">
				<div class="box">
					<h5>{{title}}</h5>
					<img src="" alt="">
				</div>
				<div slot="action">
				  <a-button size="large" @click="goHomeHandle">返回首页</a-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  name: 'RegisterResult',
  components: {},
  data () {
    return {
      form: {},
	  title :'你的密码重置成功'
    }
  },
  computed: {
  },
  created () {
    this.form = this.$route.params
  },
  methods: {
    goHomeHandle () {
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style scoped>
	.wrap{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}
	.wBox{
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 50%;
		height: 40%;
	}
</style>
