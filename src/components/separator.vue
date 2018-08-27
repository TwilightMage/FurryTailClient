<template>
  <div class="separator" :vertical="vertical" :horizontal="horizontal"></div>
</template>

<script>
export default {
  name: 'separator',
  created () {
    if (this.vertical) this.horizontal = false
    else this.vertical = false
  },
  props: {
    vertical: {
      type: Boolean,
      default: false
    },
    horizontal: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped>
  .separator[horizontal] {
    border-left: var(--splitter-left);
    border-right: var(--splitter-right);
  }
  .separator[vertical] {
    border-top: var(--splitter-top);
    border-bottom: var(--splitter-bottom);
  }
</style>
