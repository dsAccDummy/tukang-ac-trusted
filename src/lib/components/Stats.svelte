<script lang="ts">
  import { onMount } from 'svelte';
  import { Motion } from 'svelte-motion';
  import { stats } from '$lib/stores';
  import { Users, MessageSquare, MapPin, Calendar } from 'lucide-svelte';
  import ScrollReveal from './ScrollReveal.svelte';

  let currentStats = $state({ totalTechnicians: 0, totalReviews: 0, totalAreas: 0, yearRange: '-' });
  let animatedValues = $state({ technicians: 0, reviews: 0, areas: 0 });
  let hasAnimated = $state(false);
  let sectionEl: HTMLElement;

  // Subscribe to stats store
  const unsubscribe = stats.subscribe((value) => {
    currentStats = value;
  });

  function animateNumber(target: number, setter: (val: number) => void, duration: number = 1500) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setter(Math.round(start + (target - start) * easedProgress));

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated && currentStats.totalTechnicians > 0) {
          hasAnimated = true;
          animateNumber(currentStats.totalTechnicians, (v) => animatedValues.technicians = v);
          animateNumber(currentStats.totalReviews, (v) => animatedValues.reviews = v, 1700);
          animateNumber(currentStats.totalAreas, (v) => animatedValues.areas = v, 1400);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionEl) observer.observe(sectionEl);

    return () => {
      observer.disconnect();
      unsubscribe();
    };
  });

  // Re-trigger animation when data loads after intersection
  $effect(() => {
    if (currentStats.totalTechnicians > 0 && hasAnimated) {
      animatedValues.technicians = currentStats.totalTechnicians;
      animatedValues.reviews = currentStats.totalReviews;
      animatedValues.areas = currentStats.totalAreas;
    }
  });

  const statCards = $derived([
    {
      icon: Users,
      label: 'Total Teknisi',
      value: animatedValues.technicians,
      suffix: '+',
      gradient: 'from-primary to-blue-600',
      shadow: 'shadow-primary/20'
    },
    {
      icon: MessageSquare,
      label: 'Total Review',
      value: animatedValues.reviews,
      suffix: '',
      gradient: 'from-accent to-teal-600',
      shadow: 'shadow-accent/20'
    },
    {
      icon: MapPin,
      label: 'Wilayah Tercakup',
      value: animatedValues.areas,
      suffix: '+',
      gradient: 'from-violet-500 to-purple-600',
      shadow: 'shadow-violet-500/20'
    },
    {
      icon: Calendar,
      label: 'Tahun Data',
      value: currentStats.yearRange,
      suffix: '',
      gradient: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/20',
      isText: true
    }
  ]);
</script>

<section id="statistik" class="py-16 md:py-24 bg-surface" bind:this={sectionEl}>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <ScrollReveal>
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Statistik Komunitas</h2>
        <p class="text-slate-600 text-lg">Data langsung dari rekomendasi komunitas</p>
      </div>
    </ScrollReveal>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {#each statCards as card, i}
        <ScrollReveal delay={i * 0.1}>
          <Motion let:motion whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
            <div use:motion class="relative bg-white rounded-2xl p-6 md:p-8 shadow-lg {card.shadow} border border-slate-100 overflow-hidden group cursor-default">
              <!-- Gradient accent top -->
              <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r {card.gradient}"></div>

              <!-- Icon -->
              <div class="w-12 h-12 bg-gradient-to-br {card.gradient} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300">
                <svelte:component this={card.icon} class="w-6 h-6 text-white" />
              </div>

              <!-- Value -->
              <div class="text-3xl md:text-4xl font-extrabold text-slate-900 mb-1">
                {#if card.isText}
                  {card.value}
                {:else}
                  {card.value}{card.suffix}
                {/if}
              </div>

              <!-- Label -->
              <div class="text-sm text-slate-500 font-medium">{card.label}</div>
            </div>
          </Motion>
        </ScrollReveal>
      {/each}
    </div>
  </div>
</section>
