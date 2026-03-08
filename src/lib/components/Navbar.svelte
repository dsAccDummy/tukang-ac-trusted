<script lang="ts">
  import { Motion, AnimatePresence } from 'svelte-motion';
  import { Snowflake, Menu, X } from 'lucide-svelte';

  let mobileMenuOpen = $state(false);

  const navLinks = [
    { label: 'Beranda', href: '#' },
    { label: 'Direktori', href: '#direktori' },
    { label: 'Statistik', href: '#statistik' },
    { label: 'Tentang', href: '#tentang' }
  ];

  function toggleMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMenu() {
    mobileMenuOpen = false;
  }
</script>

<Motion
  let:motion
  initial={{ y: -80, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
>
  <header use:motion class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-primary/10 shadow-sm">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <a href="#" class="flex items-center gap-2 group">
          <div class="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-md shadow-primary/25 group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow">
            <Snowflake class="w-5 h-5 text-white" />
          </div>
          <span class="text-lg font-bold bg-gradient-to-r from-primary-dark to-accent bg-clip-text text-transparent">
            Tukang AC Trusted
          </span>
        </a>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-1">
          {#each navLinks as link}
            <a
              href={link.href}
              class="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors"
            >
              {link.label}
            </a>
          {/each}
        </div>

        <!-- Mobile Menu Toggle -->
        <button
          onclick={toggleMenu}
          class="md:hidden p-2 text-slate-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {#if mobileMenuOpen}
            <X class="w-5 h-5" />
          {:else}
            <Menu class="w-5 h-5" />
          {/if}
        </button>
      </div>

      <!-- Mobile Menu -->
      <AnimatePresence>
        {#if mobileMenuOpen}
          <Motion
            let:motion
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div use:motion class="md:hidden overflow-hidden border-t border-slate-100">
              <div class="py-3 space-y-1">
                {#each navLinks as link}
                  <a
                    href={link.href}
                    onclick={closeMenu}
                    class="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                {/each}
              </div>
            </div>
          </Motion>
        {/if}
      </AnimatePresence>
    </nav>
  </header>
</Motion>
