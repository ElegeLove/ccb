<template>
  <a-locale-provider :locale="locale">
    <div id="app" style="width: 100%;height: 100%;">
      <router-view />
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';//国际化  中文
import moment from 'moment';//国际化
import 'moment/locale/zh-cn';//国际化
export default {
  name: "app",
  components: {},
  data() {
    return {
      locale: zhCN
    };
  }
};
</script>

<style>
</style>
