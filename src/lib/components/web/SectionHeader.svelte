<script lang="ts">
	let {
		eyebrow = 'Clinical Trials',
		title = 'Real Skin, Real Results',
		class: customClass = ''
	} = $props();
</script>

<div class="text-center {customClass}">
	<p class="font-libre text-32 leading-130 italic lg:text-48">
		{eyebrow}
	</p>

	<h2 class="font-dm-sans text-32 leading-120 font-normal text-black lg:text-48">
		{title}
	</h2>
</div>
