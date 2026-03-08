<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { initData, destroyStores } from '$lib/stores';
  import Navbar from '$lib/components/Navbar.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import Stats from '$lib/components/Stats.svelte';
  import SearchFilter from '$lib/components/SearchFilter.svelte';
  import TechnicianGrid from '$lib/components/TechnicianGrid.svelte';
  import Footer from '$lib/components/Footer.svelte';

  onMount(() => {
    initData();
  });

  onDestroy(() => {
    destroyStores();
  });
</script>

<svelte:head>
  <title>Tukang AC Trusted - Direktori Teknisi AC Terpercaya Se-Indonesia</title>
  <meta name="description" content="Temukan teknisi AC jujur dan terpercaya di daerah Anda. Direkomendasikan langsung oleh komunitas Indonesia." />
</svelte:head>

<Navbar />

<main class="flex-1">
  <Hero />
  <Stats />
  <section id="direktori" class="py-12 md:py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Direktori Teknisi AC</h2>
        <p class="text-slate-600 text-lg max-w-2xl mx-auto">
          Temukan teknisi AC terpercaya yang sudah direkomendasikan oleh komunitas.
        </p>
      </div>
      <SearchFilter />
      <TechnicianGrid />
    </div>
  </section>
</main>

<Footer />
