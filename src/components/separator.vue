<template>
    <div class="separator">
      <div></div>
      <div v-if="title != ''">{{title}}</div>
      <div></div>
    </div>
</template>

<script>
export default {
  name: 'separator',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
  .separator {
    display: flex;
    flex-direction: row;
  }
  .separator > *:first-child, .separator > *:last-child {
    height: 0;
    flex-grow: 1;
    border: 2px inset darkgrey;
  }
  .separator > *:not(:first-child):not(:last-child) {
    margin: 0 5px;
  }
</style>
