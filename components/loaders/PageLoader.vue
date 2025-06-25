<template>
    <div class="loader" v-if="isVisible">
        <div class="loader__block" v-for="i in TILES_COUNT" :key="i" :style="{transitionDelay: delays[i-1]}" :class="{'loader__done': isLoaded, 'loader__undone': !isLoaded}"></div>
        <div class="loader__text" :class="{'loader__done': isLoaded, 'loader__undone': !isLoaded}" 
            :style="{transitionDelay: '0', transitionDuration: '0.15s'}">
            <SvgLogo width="50vmin" height="25vmin"/>
            <DotsTextLoader/>
        </div>
    </div>
</template>

<script setup>
    const TILES_COUNT = 400;
    const delays = ref([]);

    onMounted(() => {
        for (let i = 0; i < TILES_COUNT; i++) {
            delays.value.push(generateDelay());
        }
    })

    const app = useNuxtApp();

    // disable secondary loading
    const isLoadedOnce = useState('loader:isLoadedOnce', () => false);

    const isLoaded = useState('loader:isLoaded', () => false);
    const isVisible = useState('loader:isVisible', () => true);

    app.hook("page:start", () => {
        // if (isLoadedOnce.value) {
        //     return
        // }

        isLoaded.value = false;
        isVisible.value = true;
    });
    
    app.hook("page:finish", () => {
        // if (isLoadedOnce.value) {
        //     return
        // }
        
        isLoaded.value = true;
        setTimeout(() => {
            isVisible.value = false;
        }, 1600);
        isLoadedOnce.value = true;
    });

    const generateDelay = () => {
        let random = Math.floor(Math.random() * 1000);
        return random + 100 + 'ms';
    }

    // random number in range -50 to 50
    // let random = Math.floor(Math.random() * 100) - 50;
</script>

<style lang="scss" scoped>
.loader {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    & > div.loader__block {
        flex-grow: 1;
        width: 5dvmax;
        height: 5dvmax;
        background: var(--clr-header-15);

        border: var(--clr-header-15) 1px solid;
    
        backdrop-filter: blur(20px);
    }

    &__undone {
        opacity: 1;
        transition: opacity 0.5s ease;
    }

    &__done {
        opacity: 0;
        transition: opacity 0.5s ease;
    }

    &__text {
        z-index: 1000;

        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        &::v-deep(span) {
            color: var(--clr-glyph-title);
            font-size: 64px;
        }
    }
}
</style>