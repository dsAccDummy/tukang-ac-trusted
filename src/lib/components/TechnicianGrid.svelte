<script lang="ts">
  import { Motion } from 'svelte-motion';
  import { filteredTechnicians, loading, error } from '$lib/stores';
  import type { Technician } from '$lib/sheets';
  import TechnicianCard from './TechnicianCard.svelte';
  import { SearchX, Loader2, AlertTriangle, ChevronDown } from 'lucide-svelte';

  const ITEMS_PER_PAGE = 12;

  let techs: Technician[] = $state([]);
  let isLoading = $state(true);
  let errorMsg = $state('');
  let visibleCount = $state(ITEMS_PER_PAGE);

  const unsubTechs = filteredTechnicians.subscribe((v) => {
    techs = v;
    // Reset pagination when filters change
    visibleCount = ITEMS_PER_PAGE;
  });
  const unsubLoading = loading.subscribe((v) => isLoading = v);
  const unsubError = error.subscribe((v) => errorMsg = v);

  import { onDestroy } from 'svelte';
  onDestroy(() => {
    unsubTechs();
    unsubLoading();
    unsubError();
  });

  let visibleTechs = $derived(techs.slice(0, visibleCount));
  let hasMore = $derived(visibleCount < techs.length);
  let remainingCount = $derived(techs.length - visibleCount);

  function loadMore() {
    visibleCount = Math.min(visibleCount + ITEMS_PER_PAGE, techs.length);
  }
</script>

<!-- Loading State -->
{#if isLoading}
  <div class="py-20">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {#each Array(6) as _, i}
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 animate-pulse">
          <div class="flex items-start justify-between mb-3">
            <div class="h-6 bg-slate-200 rounded-lg w-40"></div>
            <div class="h-6 bg-slate-200 rounded-full w-20"></div>
          </div>
          <div class="h-4 bg-slate-100 rounded w-32 mb-3"></div>
          <div class="h-8 bg-slate-100 rounded-lg w-36 mb-4"></div>
          <div class="space-y-2">
            <div class="h-3 bg-slate-100 rounded w-full"></div>
            <div class="h-3 bg-slate-100 rounded w-4/5"></div>
            <div class="h-3 bg-slate-100 rounded w-3/5"></div>
          </div>
          <div class="mt-5 pt-3 border-t border-slate-100 flex justify-between">
            <div class="h-3 bg-slate-100 rounded w-20"></div>
            <div class="h-3 bg-slate-100 rounded w-24"></div>
          </div>
        </div>
      {/each}
    </div>
    <div class="text-center mt-8">
      <div class="inline-flex items-center gap-2 text-primary">
        <Loader2 class="w-5 h-5 animate-spin" />
        <span class="text-sm font-medium">Memuat data teknisi...</span>
      </div>
    </div>
  </div>

<!-- Error State -->
{:else if errorMsg}
  <div class="py-20 text-center">
    <div class="inline-flex flex-col items-center gap-4 max-w-md mx-auto">
      <div class="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
        <AlertTriangle class="w-8 h-8 text-red-500" />
      </div>
      <div>
        <h3 class="text-lg font-semibold text-slate-900 mb-1">Gagal Memuat Data</h3>
        <p class="text-sm text-slate-500">{errorMsg}</p>
      </div>
      <button
        onclick={() => window.location.reload()}
        class="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  </div>

<!-- Empty State -->
{:else if techs.length === 0}
  <div class="py-20 text-center">
    <div class="inline-flex flex-col items-center gap-4 max-w-md mx-auto">
      <div class="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
        <SearchX class="w-8 h-8 text-slate-400" />
      </div>
      <div>
        <h3 class="text-lg font-semibold text-slate-900 mb-1">Tidak Ada Hasil</h3>
        <p class="text-sm text-slate-500">
          Tidak ditemukan teknisi yang sesuai dengan filter Anda. Coba ubah kata kunci atau hapus filter.
        </p>
      </div>
    </div>
  </div>

<!-- Technician Grid -->
{:else}
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    {#each visibleTechs as tech, i (tech.id)}
      <Motion
        let:motion
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: Math.min(i % ITEMS_PER_PAGE, 8) * 0.05 }}
      >
        <div use:motion>
          <TechnicianCard technician={tech} />
        </div>
      </Motion>
    {/each}
  </div>

  <!-- Load More Button -->
  {#if hasMore}
    <div class="text-center mt-10">
      <Motion let:motion whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <button
          use:motion
          onclick={loadMore}
          class="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-primary/20 text-primary font-semibold rounded-xl hover:bg-primary/5 hover:border-primary/40 transition-colors shadow-sm"
        >
          <ChevronDown class="w-5 h-5" />
          Tampilkan Lebih Banyak
          <span class="text-sm font-normal text-slate-400">({remainingCount} lagi)</span>
        </button>
      </Motion>
    </div>
  {/if}
{/if}
