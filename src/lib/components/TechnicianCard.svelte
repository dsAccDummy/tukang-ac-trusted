<script lang="ts">
  import { Motion } from 'svelte-motion';
  import { MapPin, Phone, MessageCircle, Instagram, User, Calendar, ChevronDown, ChevronUp, Star } from 'lucide-svelte';
  import type { Technician } from '$lib/sheets';
  import { parseContact, formatDate, truncateText } from '$lib/utils';

  interface Props {
    technician: Technician;
  }

  let { technician }: Props = $props();

  let expanded = $state(false);

  const contact = $derived(parseContact(technician.contact));
  const formattedDate = $derived(formatDate(technician.timestamp));
  const isLongReview = $derived(technician.review && technician.review.length > 150);
  const displayReview = $derived(
    expanded ? technician.review : truncateText(technician.review, 150)
  );

  const isKonsumen = $derived(technician.role?.toLowerCase().includes('konsumen'));
  const roleBadgeClass = $derived(
    isKonsumen
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
  );
  const roleLabel = $derived(
    isKonsumen ? 'Konsumen' : 'Penyedia Jasa'
  );

  const contactIcon = $derived(
    contact.type === 'instagram' ? Instagram
    : contact.type === 'whatsapp' ? MessageCircle
    : Phone
  );

  const contactColorClass = $derived(
    contact.type === 'instagram' ? 'text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100'
    : contact.type === 'whatsapp' ? 'text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100'
    : 'text-primary hover:text-primary-dark bg-primary/5 hover:bg-primary/10'
  );
</script>

<Motion let:motion whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
  <div use:motion class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-shadow duration-300 overflow-hidden h-full flex flex-col">
    <!-- Card Header -->
    <div class="p-5 pb-3 flex-1">
      <!-- Top row: Name + Role badge -->
      <div class="flex items-start justify-between gap-3 mb-3">
        <h3 class="text-lg font-bold text-slate-900 leading-snug flex-1">
          {technician.technicianName}
        </h3>
        <span class="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border whitespace-nowrap {roleBadgeClass}">
          {roleLabel}
        </span>
      </div>

      <!-- Area -->
      {#if technician.area}
        <div class="flex items-center gap-1.5 text-sm text-slate-500 mb-3">
          <MapPin class="w-4 h-4 text-primary/70 flex-shrink-0" />
          <span class="line-clamp-1">{technician.area}</span>
        </div>
      {/if}

      <!-- Contact -->
      {#if contact.type !== 'text'}
        <a
          href={contact.href}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors mb-4 {contactColorClass}"
        >
          <svelte:component this={contactIcon} class="w-4 h-4" />
          {contact.label}
        </a>
      {:else if technician.contact}
        <div class="flex items-center gap-2 text-sm text-slate-600 mb-4">
          <Phone class="w-4 h-4 text-slate-400" />
          <span>{technician.contact}</span>
        </div>
      {/if}

      <!-- Review -->
      {#if technician.review}
        <div class="mt-2">
          <div class="flex items-center gap-1.5 mb-1.5">
            <Star class="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span class="text-xs font-medium text-slate-500 uppercase tracking-wide">Kesan</span>
          </div>
          <p class="text-sm text-slate-600 leading-relaxed">
            {displayReview}
          </p>
          {#if isLongReview}
            <button
              onclick={() => expanded = !expanded}
              class="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
            >
              {#if expanded}
                Sembunyikan <ChevronUp class="w-3 h-3" />
              {:else}
                Baca selengkapnya <ChevronDown class="w-3 h-3" />
              {/if}
            </button>
          {/if}
        </div>
      {/if}

      <!-- Testimonial -->
      {#if technician.testimonial && technician.testimonial.trim()}
        <div class="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <p class="text-xs text-slate-500 font-medium mb-1">Testimoni:</p>
          <p class="text-sm text-slate-600 italic leading-relaxed">"{technician.testimonial}"</p>
        </div>
      {/if}
    </div>

    <!-- Card Footer -->
    <div class="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-3">
      <div class="flex items-center gap-1.5 text-xs text-slate-400 min-w-0">
        <User class="w-3.5 h-3.5 flex-shrink-0" />
        <span class="truncate">{technician.username || 'Anonim'}</span>
      </div>
      {#if formattedDate}
        <div class="flex items-center gap-1.5 text-xs text-slate-400 flex-shrink-0">
          <Calendar class="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>
      {/if}
    </div>
  </div>
</Motion>
