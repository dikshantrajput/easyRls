<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { spring } from "svelte/motion";
  import { onMount } from "svelte";

  let showFeatures = false;

  const features = [
    {
      icon: "🛡️",
      title: "Secure",
      description: "Streamline RLS policy management",
    },
    {
      icon: "🚀",
      title: "Fast",
      description: "Rapid PostgreSQL connections",
    },
    {
      icon: "🎨",
      title: "Intuitive",
      description: "User-friendly interface for all skill levels",
    },
    {
      icon: "🔍",
      title: "Smart Search",
      description: "Quickly locate schemas and tables",
    },
  ];

  const demoSpring = spring(
    { y: 50, opacity: 0 },
    {
      stiffness: 0.1,
      damping: 0.25,
    },
  );

  let howItWorksElementRef: HTMLElement;
  let demoIframeElementRef: HTMLIFrameElement, isDemoIframeLoading = true;

  onMount(() => {
    showFeatures = true;
    demoSpring.set({ y: 0, opacity: 1 });
    const observerCallback: IntersectionObserverCallback = (
      entries,
      observer,
    ) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          Array.from(entry.target.children).forEach((child, index) => {
            child.classList.add("animate-slide-in");
            (child as HTMLElement).style.animationDelay = index * 300 + "ms";
          });
        }
      });
    };
    const observer = new IntersectionObserver(observerCallback);
    observer.observe(howItWorksElementRef);

    demoIframeElementRef.addEventListener("load", () => {
      isDemoIframeLoading = false
    })
  });
</script>

<svelte:head>
  <title>
    EasyRLS | Simplify PostgreSQL Row Level Security
  </title>
</svelte:head>

<div
  class="min-h-screen bg-gray-50 text-gray-800 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-200"
>
  <header
    class="relative py-12 md:py-24 overflow-hidden flex items-center lg:flex-row flex-col"
  >
    <div class="container mx-auto px-4 relative z-10">
      <div class="max-w-3xl mx-auto text-center">
        <h1
          class="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-gray-100"
          in:fade={{ duration: 1000, delay: 300 }}
        >
          Simplify PostgreSQL Row Level Security
        </h1>
        <p
          class="text-base sm:text-lg md:text-xl mb-6 md:mb-8 text-gray-600 dark:text-gray-300"
          in:fade={{ duration: 1000, delay: 600 }}
        >
          EasyRls provides an intuitive interface to manage Row Level Security
          policies in PostgreSQL databases with ease.
        </p>
        <a
          href="/"
          class="bg-accent text-background px-6 md:px-10 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold transition-all duration-300 inline-block shadow-lg hover:shadow-xl hover:bg-accent-dark transform hover:-translate-y-1 lg:mb-0 mb-4"
          in:fade={{ duration: 800, delay: 900 }}
        >
          Explore EasyRls
        </a>
      </div>
    </div>
    <div
      class="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 -z-10"
    ></div>
    <div
      class="mx-auto px-4 w-full mt-8 md:mt-0"
      style="transform: translate(0, {$demoSpring.y}px); opacity: {$demoSpring.opacity};"
    >
      <div class="rounded-xl shadow-2xl overflow-hidden">
        <div style="position: relative; padding-bottom: 56.25%; height: 0;">
          {#if isDemoIframeLoading}
            <div class="w-full h-full absolute grid items-center text-white text-center">
              Loading interactive demo...
            </div>
          {/if}
          <iframe
            src="https://app.supademo.com/embed/clzbd7ah554ozz9kd7qkzbwiy?embed_v=2"
            loading="lazy"
            title="EasyRls Demo"
            allow="clipboard-write"
            frameborder="0"
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            allowfullscreen
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
            id="demo_iframe"
            bind:this={demoIframeElementRef}
          ></iframe>
        </div>
      </div>
    </div>
  </header>

  <section id="features" class="py-16 md:py-24 bg-white dark:bg-gray-800">
    <div class="container mx-auto px-4">
      <h2
        class="text-2xl md:text-3xl font-bold mb-12 md:mb-16 text-center text-gray-900 dark:text-gray-100"
      >
        Key Features
      </h2>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
      >
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

  <section id="how-it-works" class="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <h2
        class="text-2xl md:text-3xl font-bold mb-12 md:mb-16 text-center text-gray-900 dark:text-gray-100"
      >
        How It Works
      </h2>
      <div class="max-w-3xl mx-auto" bind:this={howItWorksElementRef}>
        {#each [{ title: "Secure Connection", description: "Easily establish a secure connection to your PostgreSQL instance. Simply provide the connection string, and our intuitive interface will handle the rest, ensuring a seamless and secure connection." }, { title: "Schema and Table Management", description: "Once connected, navigate through your database schemas and tables with ease. Our application offers a clear and organized view, allowing you to view schemas, quickly list and explore all schemas within your PostgreSQL instance, and access tables to drill down into schemas to see the tables they contain." }, { title: "Efficient Policy Management", description: "Maintain the highest level of data security by effectively managing RLS policies. View all existing policies at a glance, duplicate policies for similar use cases, and utilize the search functionality to find specific configurations quickly. With our application, your data security is always in good hands." }] as step, i}
          <div
            class="flex flex-col md:flex-row items-start md:items-center mb-8"
          >
            <div
              class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mr-4 md:mr-6 mb-4 md:mb-0"
            >
              {i + 1}
            </div>
            <div class="flex-1">
              <h3
                class="text-lg md:text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100"
              >
                {step.title}
              </h3>
              <p class="text-gray-600 dark:text-gray-300">{step.description}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <section class="py-12 md:py-16 bg-white dark:bg-background-light">
    <div class="max-w-4xl mx-auto px-4 text-center">
      <h2 class="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-primary">
        Ready to Simplify Your RLS Management?
      </h2>
      <p class="text-lg md:text-xl mb-6 md:mb-8 text-text-muted">
        Join developers worldwide who are using EasyRls to streamline their
        PostgreSQL security policies.
      </p>
      <div
        class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
      >
        <a
          href="https://github.com/dikshantrajput/easyRls"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-background text-primary px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold hover:bg-background-light transition-all duration-300 inline-block shadow-md hover:shadow-lg transform hover:-translate-y-1"
        >
          Explore on GitHub
        </a>

        <a
          href="/"
          class="bg-accent text-background px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold hover:bg-accent-dark transition-all duration-300 inline-block shadow-md hover:shadow-lg transform hover:-translate-y-1"
        >
          Get Started
        </a>
      </div>
    </div>
  </section>

  <footer class="bg-background-dark text-text-muted py-6 md:py-8">
    <div
      class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center"
    >
      <div class="mb-4 md:mb-0">© 2024 EasyRls. All rights reserved.</div>
      <!-- <div class="flex space-x-4">
        <a href="#" class="hover:text-blue-600 transition-colors"
          >Privacy Policy</a
        >
        <a href="#" class="hover:text-blue-600 transition-colors"
          >Terms of Service</a
        >
      </div> -->
    </div>
  </footer>
</div>

<style>
  @keyframes slide-in {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  :global(.animate-slide-in) {
    animation: slide-in 0.5s forwards;
  }
</style>
