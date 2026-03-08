<script lang="ts">
  import { Snowflake, ExternalLink, Heart } from 'lucide-svelte';
  import ScrollReveal from './ScrollReveal.svelte';

  const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1r1UwrOVKUyTTwMkSYNKr6HR29QfKVpdd1Aewcr7WGI0';
</script>

<footer id="tentang" class="bg-slate-900 text-slate-400">
  <ScrollReveal>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <!-- Brand -->
        <div class="md:col-span-1">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <Snowflake class="w-5 h-5 text-white" />
            </div>
            <span class="text-lg font-bold text-white">Tukang AC Trusted</span>
          </div>
          <p class="text-sm leading-relaxed">
            Direktori crowdsourced untuk menemukan teknisi AC jujur dan terpercaya di seluruh Indonesia.
            Dibangun oleh komunitas, untuk komunitas.
          </p>
        </div>

        <!-- Links -->
        <div>
          <h4 class="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Navigasi</h4>
          <ul class="space-y-2.5">
            <li>
              <a href="#" class="text-sm hover:text-primary transition-colors">Beranda</a>
            </li>
            <li>
              <a href="#direktori" class="text-sm hover:text-primary transition-colors">Direktori</a>
            </li>
            <li>
              <a href="#statistik" class="text-sm hover:text-primary transition-colors">Statistik</a>
            </li>
          </ul>
        </div>

        <!-- Sumber Data -->
        <div>
          <h4 class="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Sumber Data</h4>
          <ul class="space-y-2.5">
            <li>
              <a
                href={SPREADSHEET_URL}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
              >
                Google Spreadsheet
                <ExternalLink class="w-3.5 h-3.5" />
              </a>
            </li>
            <li>
              <span class="text-sm">Data dari komunitas</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-10 pt-8 border-t border-slate-800">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-sm text-slate-500">
            &copy; 2025 Tukang AC Trusted. Semua data bersumber dari kontribusi komunitas.
          </p>
          <p class="text-sm text-slate-500 flex items-center gap-1.5">
            Dibuat dengan
            <Heart class="w-3.5 h-3.5 text-red-400 fill-red-400" />
            untuk komunitas Indonesia
          </p>
        </div>
      </div>
    </div>
  </ScrollReveal>
</footer>
