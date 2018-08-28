<template>
  <div class="separator" :type="type"></div>
</template>

<script>
export default {
  name: 'separator',
  created () {
    if (this.type !== 'vertical' && this.type !== 'horizontal') this.type = 'vertical'
  },
  props: {
    type: {
      type: String,
      default: 'vertical'
    }
  }
}
</script>

<style scoped>
  .separator[type=horizontal] {
    border-left: var(--splitter-left);
    border-right: var(--splitter-right);
  }
  .separator[type=vertical] {
    border-top: var(--splitter-top);
    border-bottom: var(--splitter-bottom);
  }
</style>
