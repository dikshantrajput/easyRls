<script>
// @ts-nocheck

  import { fade, fly } from "svelte/transition";

  let showFeatures = true;

  const features = [
    {
      icon: "🔒",
      title: "Secure",
      description: "Manage RLS policies with ease",
    },
    {
      icon: "🚀",
      title: "Fast",
      description: "Quick connection to PostgreSQL",
    },
    { icon: "🎨", title: "Intuitive", description: "User-friendly interface" },
    {
      icon: "🔍",
      title: "Searchable",
      description: "Find schemas and tables quickly",
    },
  ];
</script>

<div
  class="min-h-screen bg-background text-text transition-colors duration-300"
>
  <header class="py-20 text-center">
    <h1
      class="text-5xl font-bold mb-4 text-primary"
      in:fade={{ duration: 1000, delay: 300 }}
    >
      Simplify PostgreSQL Row Level Security
    </h1>
    <p
      class="text-xl mb-8 text-text-muted max-w-2xl mx-auto"
      in:fade={{ duration: 1000, delay: 600 }}
    >
      EasyRls provides an intuitive interface to manage Row Level Security
      policies in PostgreSQL databases with ease.
    </p>
    <a
      href="/"
      class="bg-primary text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-primary-dark transition-colors duration-300 inline-block"
      in:fade={{ duration: 1000, delay: 900 }}
    >
      Go easy on RLS
    </a>
  </header>

  <section id="features" class="py-16 bg-background-light">
    <div class="max-w-6xl mx-auto px-4">
      <h2 class="text-3xl font-bold mb-12 text-center text-primary">
        Features
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {#if showFeatures}
          {#each features as feature, i}
            <div
              class="bg-background p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              in:fly={{ y: 50, duration: 500, delay: i * 200 }}
            >
              <div class="text-4xl mb-4">{feature.icon}</div>
              <h3 class="text-xl font-semibold mb-2 text-primary">
                {feature.title}
              </h3>
              <p class="text-text-muted">{feature.description}</p>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </section>

  <section id="demo" class="py-16">
    <div class="max-w-full mx-auto px-4">
      <h2 class="text-3xl font-bold mb-8 text-center text-primary">
        See EasyRls in Action
      </h2>
      <div class=" p-6 rounded-lg shadow-md">
        <div id="embeddable-content">
          <div
            style="position: relative; box-sizing: content-box; max-height: 80vh; max-height: 80svh; width: 100%; aspect-ratio: 1.914843287995269; padding: 40px 0 40px 0;"
          >
            <iframe
              src="https://app.supademo.com/embed/clzbd7ah554ozz9kd7qkzbwiy?embed_v=2"
              loading="lazy"
              title="Vercel Demo"
              allow="clipboard-write"
              frameborder="0"
              webkitallowfullscreen="true"
              mozallowfullscreen="true"
              allowfullscreen
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="py-16 bg-background-light">
    <div class="max-w-4xl mx-auto px-4 text-center">
      <h2 class="text-3xl font-bold mb-6 text-primary">
        Ready to Simplify Your RLS Management?
      </h2>
      <p class="text-xl mb-8 text-text-muted">
        Join developers worldwide who are using EasyRls to streamline their
        PostgreSQL security policies.
      </p>
      <div class="flex justify-center space-x-4">
        <a
          href="https://github.com/dikshantrajput/easyRls"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-primary text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-primary-dark transition-colors duration-300 inline-block"
        >
          View on GitHub
        </a>
      </div>
    </div>
  </section>

  <footer class="bg-background-dark text-text-muted py-8">
    <div class="max-w-6xl mx-auto flex justify-between items-center">
      <div>© 2024 EasyRls. All rights reserved.</div>
      <!-- <div class="flex space-x-4">
        <a href="#" class="hover:text-primary transition-colors"
          >Privacy Policy</a
        >
        <a href="#" class="hover:text-primary transition-colors"
          >Terms of Service</a
        >
      </div> -->
    </div>
  </footer>
</div>
