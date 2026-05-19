<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let activeDay = $state(1);

	const progressStages = [
		{
			day: 1,
			label: 'Day 1',
			title: 'The Glow Drop',
			description: 'That first application sinks right in—skin feels hydrated, smoother, and instantly refreshed without heaviness.'
		},
		{
			day: 15,
			label: 'Day 15',
			title: 'Visible Changes',
			description: 'Consistency pays off. Your skin starts to reset, showing a more even texture and reduced appearance of dullness.'
		},
		{
			day: 30,
			label: 'Day 30',
			title: 'The Transformation',
			description: 'The 30-day mark reveals a visible glow. Dark spots fade, and your skin looks revitalized, healthy, and luminous.'
		}
	];

	let currentStage = $derived(progressStages.find((s) => s.day === activeDay) || progressStages[0]);

	function setActiveDay(day: number) {
		if (activeDay === day) return;
		
		activeDay = day;

		// Animate content change
		gsap.fromTo(
			'.challenge-content',
			{ opacity: 0, x: -20 },
			{ opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
		);
		gsap.fromTo(
			'.challenge-image',
			{ opacity: 0, scale: 1.05 },
			{ opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
		);
	}
</script>

<section class="bg-[#f0f8ff] py-16 px-6 lg:px-20 lg:py-24 overflow-hidden">
	<div class="max-w-7xl mx-auto">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
			<!-- Left side: Text and Timeline -->
			<div class="flex flex-col md:flex-row gap-8 lg:gap-16 items-start">
				<div class="flex-1 order-1 md:order-1 challenge-content w-full">
					<h2 class="text-[#72AFD1] text-36 lg:text-56 font-bold leading-tight mb-8 font-poppins">
						Take the 30-Day Glow Challenge
					</h2>
					<div class="space-y-4">
						<h3 class="text-24 lg:text-28 font-bold text-gray-900 font-dm-sans">{currentStage.title}</h3>
						<p class="text-16 lg:text-18 text-gray-600 leading-relaxed max-w-md font-dm-sans">
							{currentStage.description}
						</p>
					</div>
				</div>

				<!-- Timeline Stepper -->
				<div class="flex md:flex-col order-2 md:order-2 justify-between md:justify-start gap-8 md:gap-16 relative py-4 w-full md:w-auto">
					<!-- Vertical Line (Desktop) -->
					<div class="hidden md:block absolute left-[7px] top-0 bottom-0 w-[1px] bg-gray-200"></div>
                    <!-- Horizontal Line (Mobile) -->
                    <div class="md:hidden absolute left-0 right-0 top-[23px] h-[1px] bg-gray-200"></div>
					
					{#each progressStages as stage}
						<button
							class="flex flex-col md:flex-row items-center gap-3 md:gap-6 relative z-10 group transition-all"
							onclick={() => setActiveDay(stage.day)}
						>
							<div
								class={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${activeDay === stage.day ? 'bg-[#72AFD1] border-[#72AFD1] scale-125 shadow-[0_0_0_4px_rgba(114,175,209,0.2)]' : 'bg-white border-gray-300 group-hover:border-[#72AFD1]'}`}
							></div>
							<span
								class={`text-14 font-bold whitespace-nowrap transition-colors font-dm-sans ${activeDay === stage.day ? 'text-gray-900 underline underline-offset-8 decoration-[#72AFD1] decoration-2' : 'text-gray-400 group-hover:text-gray-600'}`}
							>
								{stage.label}
							</span>
						</button>
					{/each}
				</div>
			</div>

			<!-- Right side: Image -->
			<div class="relative w-full aspect-[4/3] lg:aspect-square overflow-hidden rounded-20 bg-white shadow-2xl">
				<img
					src={`/images/glow-challenge-day-${activeDay}.jpg`}
					alt={`Glow Challenge ${currentStage.label}`}
					class="w-full h-full object-cover challenge-image"
					onerror={(e) => {
						const target = e.target as HTMLImageElement;
						target.src = 'https://images.unsplash.com/photo-1590156221122-c848e7f99d62?q=80&w=1000&auto=format&fit=crop';
					}}
				/>
                <!-- Subtle overlay for tag -->
                <div class="absolute top-6 left-6">
                    <span class="bg-[#72AFD1]/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-12 font-bold uppercase tracking-wider">
                        {currentStage.label} Results
                    </span>
                </div>
			</div>
		</div>
	</div>
</section>

<style>
	/* Any additional component-specific styles */
    .challenge-image {
        transition: transform 0.5s ease-out;
    }
    .challenge-image:hover {
        transform: scale(1.02);
    }
</style>
