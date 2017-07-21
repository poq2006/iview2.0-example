<style scoped>
</style>
<template>
    <div class="content">
        <transition name="move" mode="out-in"><router-view></router-view></transition>
    </div>
</template>
<script>
    export default {
        methods: {
            handleStart() {
                this.$Modal.info({
                    title: 'Bravo',
                    content: 'Now, enjoy the convenience of iView.'
                });
            }
        }
    };
</script>