<script lang="ts">
  import { Motion } from 'svelte-motion';
  import { Snowflake, Search, ArrowDown } from 'lucide-svelte';

  const floatingIcons = [
    { x: '10%', y: '20%', size: 20, delay: 0, duration: 6 },
    { x: '85%', y: '15%', size: 16, delay: 1, duration: 7 },
    { x: '75%', y: '70%', size: 24, delay: 2, duration: 5 },
    { x: '15%', y: '75%', size: 18, delay: 0.5, duration: 8 },
    { x: '50%', y: '10%', size: 14, delay: 1.5, duration: 6.5 },
    { x: '90%', y: '50%', size: 20, delay: 3, duration: 7.5 }
  ];
</script>

<section class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-[85vh] flex items-center">
  <!-- Animated Background Blobs -->
  <div class="absolute inset-0 overflow-hidden">
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
    <div class="absolute top-1/2 -right-20 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
    <div class="absolute -bottom-20 left-1/3 w-72 h-72 bg-primary-light/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 4s;"></div>
    <div class="absolute top-1/4 left-1/2 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>

    <!-- Grid overlay -->
    <div class="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
  </div>

  <!-- Floating Snowflake Icons -->
  {#each floatingIcons as icon}
    <div
      class="absolute text-primary/15 pointer-events-none"
      style="left: {icon.x}; top: {icon.y}; animation: float {icon.duration}s ease-in-out infinite; animation-delay: {icon.delay}s;"
    >
      <Snowflake size={icon.size} />
    </div>
  {/each}

  <!-- Content -->
  <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
    <Motion
      let:motion
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
    >
      <div use:motion class="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary-light text-sm font-medium mb-8 backdrop-blur-sm">
        <Snowflake class="w-4 h-4" />
        <span>Direktori Crowdsourced dari Komunitas</span>
      </div>
    </Motion>

    <Motion
      let:motion
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.25 }}
    >
      <h1 use:motion class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
        Tukang AC
        <span class="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent"> Trusted</span>
      </h1>
    </Motion>

    <Motion
      let:motion
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <p use:motion class="text-xl md:text-2xl text-primary-light/80 font-medium mb-4">
        Direktori Teknisi AC Terpercaya Se-Indonesia
      </p>
    </Motion>

    <Motion
      let:motion
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.55 }}
    >
      <p use:motion class="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
        Temukan teknisi AC jujur dan terpercaya di daerah Anda.
        Direkomendasikan langsung oleh komunitas.
      </p>
    </Motion>

    <Motion
      let:motion
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7 }}
    >
      <div use:motion class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="#direktori"
          class="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
        >
          <Search class="w-5 h-5" />
          Cari Teknisi
        </a>
        <a
          href="#statistik"
          class="inline-flex items-center gap-2 px-8 py-3.5 border border-slate-600 text-slate-300 font-semibold rounded-xl hover:bg-white/5 hover:border-slate-500 transition-all duration-300"
        >
          Lihat Statistik
          <ArrowDown class="w-4 h-4" />
        </a>
      </div>
    </Motion>
  </div>

  <!-- Bottom gradient fade -->
  <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface to-transparent"></div>
</section>

<style>
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-15px) rotate(5deg); }
    50% { transform: translateY(-8px) rotate(-3deg); }
    75% { transform: translateY(-20px) rotate(3deg); }
  }
</style>
