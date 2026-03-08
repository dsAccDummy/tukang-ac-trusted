<script lang="ts">
  import { Motion } from 'svelte-motion';
  import { onMount } from 'svelte';

  interface Props {
    direction?: 'up' | 'down' | 'left' | 'right';
    delay?: number;
    duration?: number;
    children: import('svelte').Snippet;
    class?: string;
  }

  let {
    direction = 'up',
    delay = 0,
    duration = 0.6,
    children,
    class: className = ''
  }: Props = $props();

  let isVisible = $state(false);
  let element: HTMLDivElement;

  const offsets = {
    up: { x: 0, y: 40 },
    down: { x: 0, y: -40 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 }
  };

  const offset = offsets[direction];

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible = true;
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (element) observer.observe(element);

    return () => observer.disconnect();
  });
</script>

<div bind:this={element} class={className}>
  <Motion
    let:motion
    animate={isVisible ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: offset.x, y: offset.y }}
    initial={{ opacity: 0, x: offset.x, y: offset.y }}
    transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    <div use:motion>
      {@render children()}
    </div>
  </Motion>
</div>
