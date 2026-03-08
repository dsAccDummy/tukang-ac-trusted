<script lang="ts">
  import { Motion } from 'svelte-motion';
  import { Search, Filter, RotateCcw, MapPin, ChevronDown, X } from 'lucide-svelte';
  import { searchQuery, selectedArea, selectedRole, uniqueAreas, uniqueRoles, filteredTechnicians, resetFilters } from '$lib/stores';
  import ScrollReveal from './ScrollReveal.svelte';
  import { onDestroy } from 'svelte';

  let areas: string[] = $state([]);
  let roles: string[] = $state([]);
  let resultCount = $state(0);

  const unsubAreas = uniqueAreas.subscribe((v) => areas = v);
  const unsubRoles = uniqueRoles.subscribe((v) => roles = v);
  const unsubFiltered = filteredTechnicians.subscribe((v) => resultCount = v.length);

  let localSearch = $state('');
  let localArea = $state('');
  let localRole = $state('');

  const unsubSearch = searchQuery.subscribe((v) => localSearch = v);
  const unsubSelArea = selectedArea.subscribe((v) => localArea = v);
  const unsubSelRole = selectedRole.subscribe((v) => localRole = v);

  // --- Searchable Area Combobox State ---
  let areaSearchText = $state('');
  let areaDropdownOpen = $state(false);
  let areaInputEl: HTMLInputElement | null = $state(null);
  let comboboxEl: HTMLDivElement | null = $state(null);

  let filteredAreas = $derived(
    areaSearchText.trim()
      ? areas.filter((a) => a.toLowerCase().includes(areaSearchText.toLowerCase().trim()))
      : areas
  );

  function handleSearchInput(e: Event) {
    const target = e.target as HTMLInputElement;
    searchQuery.set(target.value);
  }

  function handleAreaSelect(area: string) {
    selectedArea.set(area);
    areaSearchText = '';
    areaDropdownOpen = false;
  }

  function handleClearArea() {
    selectedArea.set('');
    areaSearchText = '';
    areaDropdownOpen = false;
  }

  function handleAreaInputFocus() {
    areaDropdownOpen = true;
  }

  function handleAreaInput(e: Event) {
    const target = e.target as HTMLInputElement;
    areaSearchText = target.value;
    areaDropdownOpen = true;
    // Clear selection if user types
    if (localArea) {
      selectedArea.set('');
    }
  }

  function handleAreaKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      areaDropdownOpen = false;
      areaInputEl?.blur();
    }
  }

  // Close dropdown when clicking outside
  function handleClickOutside(e: MouseEvent) {
    if (comboboxEl && !comboboxEl.contains(e.target as Node)) {
      areaDropdownOpen = false;
    }
  }

  // Attach global click listener
  import { onMount } from 'svelte';
  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  });

  function handleRoleChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    selectedRole.set(target.value);
  }

  function handleReset() {
    areaSearchText = '';
    areaDropdownOpen = false;
    resetFilters();
  }

  onDestroy(() => {
    unsubAreas();
    unsubRoles();
    unsubFiltered();
    unsubSearch();
    unsubSelArea();
    unsubSelRole();
  });

  let hasFilters = $derived(localSearch !== '' || localArea !== '' || localRole !== '');
</script>

<ScrollReveal>
  <div class="mb-8">
    <Motion let:motion initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div use:motion class="bg-white rounded-2xl shadow-md border border-slate-100 p-4 md:p-6">
        <div class="flex flex-col lg:flex-row gap-3 md:gap-4">
          <!-- Search Input (larger on desktop) -->
          <div class="relative flex-1 lg:min-w-[320px] lg:flex-[2]">
            <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama teknisi, wilayah, atau kata kunci..."
              value={localSearch}
              oninput={handleSearchInput}
              class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          <!-- Area Filter: Searchable Combobox -->
          <div class="relative min-w-0 lg:min-w-[220px] lg:flex-1" bind:this={comboboxEl}>
            <MapPin class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
            <input
              bind:this={areaInputEl}
              type="text"
              placeholder="Cari wilayah..."
              value={localArea || areaSearchText}
              onfocus={handleAreaInputFocus}
              oninput={handleAreaInput}
              onkeydown={handleAreaKeydown}
              class="w-full pl-10 pr-9 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              autocomplete="off"
              role="combobox"
              aria-expanded={areaDropdownOpen}
              aria-haspopup="listbox"
            />
            {#if localArea}
              <button
                onclick={handleClearArea}
                class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Hapus wilayah"
              >
                <X class="w-4 h-4" />
              </button>
            {:else}
              <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none transition-transform {areaDropdownOpen ? 'rotate-180' : ''}" />
            {/if}

            <!-- Dropdown List -->
            {#if areaDropdownOpen}
              <div class="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto" role="listbox">
                {#if filteredAreas.length === 0}
                  <div class="px-4 py-3 text-sm text-slate-400">Wilayah tidak ditemukan</div>
                {:else}
                  <button
                    onclick={() => handleClearArea()}
                    class="w-full text-left px-4 py-2.5 text-sm hover:bg-primary/5 transition-colors {localArea === '' ? 'text-primary font-medium bg-primary/5' : 'text-slate-600'}"
                    role="option"
                    aria-selected={localArea === ''}
                  >
                    Semua Wilayah
                  </button>
                  {#each filteredAreas as area}
                    <button
                      onclick={() => handleAreaSelect(area)}
                      class="w-full text-left px-4 py-2.5 text-sm hover:bg-primary/5 transition-colors {localArea === area ? 'text-primary font-medium bg-primary/5' : 'text-slate-700'}"
                      role="option"
                      aria-selected={localArea === area}
                    >
                      {area}
                    </button>
                  {/each}
                {/if}
              </div>
            {/if}
          </div>

          <!-- Role Filter -->
          <div class="relative min-w-0 lg:min-w-[180px]">
            <select
              value={localRole}
              onchange={handleRoleChange}
              class="w-full pl-4 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all cursor-pointer"
            >
              <option value="">Semua Peran</option>
              {#each roles as role}
                <option value={role}>{role}</option>
              {/each}
            </select>
            <Filter class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <!-- Reset Button -->
          {#if hasFilters}
            <button
              onclick={handleReset}
              class="flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-xl transition-colors"
            >
              <RotateCcw class="w-4 h-4" />
              Reset
            </button>
          {/if}
        </div>

        <!-- Result count -->
        <div class="mt-3 pt-3 border-t border-slate-100">
          <p class="text-sm text-slate-500">
            Menampilkan <span class="font-semibold text-primary">{resultCount}</span> teknisi
            {#if hasFilters}
              <span class="text-slate-400">(terfilter)</span>
            {/if}
          </p>
        </div>
      </div>
    </Motion>
  </div>
</ScrollReveal>
