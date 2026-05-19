<script lang="ts">
    const benefits = [
        {
            value: '92%',
            text: 'noticed faster dark spot reduction with our clinically studied brightening actives'
        },
        {
            value: '88%',
            text: 'experienced deeper hydration and stronger skin barriers'
        },
        {
            value: '85%',
            text: 'revealed brighter, more even-toned skin within weeks'
        },
        {
            value: '90%',
            text: 'felt more confident with skin that looked healthy and alive'
        }
    ];
</script>

<section class="px-4 py-12 md:px-10 lg:px-20">
    <div class="max-w-7xl mx-auto bg-gradient-to-r from-[#72AFD1] to-[#b3d4e6] rounded-[40px] p-8 md:p-12 lg:p-16 shadow-lg overflow-hidden">
        <div class="text-center mb-12 flex items-center justify-center gap-4 flex-wrap">
            <h2 class="text-white text-36 md:text-48 lg:text-56 font-joan italic flex items-center gap-4">
                Why <img src="/images/footer-logo.svg" alt="Kohl & Spice" class="h-10 md:h-14 lg:h-16 brightness-0 invert opacity-95" />?
            </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {#each benefits as benefit}
                <div class="flex flex-col items-start lg:items-center text-left lg:text-center px-4">
                    <div class="w-full">
                        <span class="text-white text-48 md:text-56 font-bold leading-none">
                            {benefit.value}
                        </span>
                        <div class="w-full h-[1px] bg-white/40 mt-2 mb-4"></div>
                    </div>
                    <p class="text-white text-16 md:text-18 leading-relaxed italic opacity-95 font-light">
                        {benefit.text}
                    </p>
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    .font-joan {
        font-family: 'Joan', serif;
    }
</style>
