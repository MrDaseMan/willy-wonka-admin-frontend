<template>
    <div class="dots">
        <span style="--i: 0">.</span>
        <span style="--i: 1">.</span>
        <span style="--i: 2">.</span>
    </div>
</template>

<script setup>
const props = defineProps({
    color: {
        type: String,
        default: 'white'
    }
})

const getColor = computed(() => {
    return props.color
})
</script>

<style lang="scss" scoped>
.dots {
    display: inline-flex;
    flex-direction: row;
    margin-left: 2px;
    margin-right: 2px;

    & > span {
        color: v-bind(getColor);
    }
}

@keyframes dots {
    0% {
        opacity: 0;
    }
    50% {
        opacity: 0.6;
    }
    100% {
        opacity: 0;
    }
}

.dots span {
    opacity: 0.6;
    display: block;
    animation: dots 1s infinite;
    animation-delay: calc(0.1s * var(--i));
}
</style>