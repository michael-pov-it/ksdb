<template>
  <div id="header">
    <h1>{{ msg }}</h1>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'header_',
  data () {
    return {
      msg: 'KSDB!'
    }
  }
}

</script>