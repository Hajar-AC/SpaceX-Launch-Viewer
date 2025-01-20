import 'animate.css';

<template>
  <div class="bg-gradient-to-b from-blue-500 to-blue-900 min-h-screen text-white p-6">
    <div class="max-w-5xl mx-auto space-y-8">
      <!-- titre principal -->
      <h1 class="text-4xl font-extrabold text-center mb-8">🚀 SpaceX - Lancements</h1>

      <!-- prochain lancement -->
      <div v-if="nextLaunch" class="bg-white text-black p-6 rounded-lg shadow-lg space-y-4">
        <h2 class="text-2xl font-semibold text-center text-blue-500">
          Prochain Lancement
        </h2>
        <p class="text-lg"><strong>Nom :</strong> {{ nextLaunch.name }}</p>
        <p class="text-lg"><strong>Date :</strong> {{ formatDate(nextLaunch.date_utc) }}</p>
        <p class="text-lg"><strong>Décompte :</strong> {{ countdown }}</p>
      </div>
      <div v-else class="text-center">Chargement des données...</div>

      <!-- derniers lancement -->
      <div>
        <h2 class="text-2xl font-semibold text-blue-100 mb-4">
          🛰️ Derniers Lancements
        </h2>
        <ul class="space-y-4">
          <li
            v-for="launch in filteredLaunches"
            :key="launch.id"
            class="cursor-pointer bg-white text-black p-4 rounded-lg shadow-lg hover:bg-gray-100 transition transform hover:scale-105"
            @click="openPopup(launch)"
          >
            <strong class="text-lg">{{ launch.name }}</strong>
            <span class="block text-sm text-gray-600">{{ formatDate(launch.date_utc) }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- modal -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isPopupOpen"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click="closePopup"
      >
        <div class="fixed inset-0 bg-black bg-opacity-50"></div>

        <div class="flex items-center justify-center min-h-screen px-4 py-8">
          <div
            class="relative bg-white w-full max-w-xl mx-auto rounded-none p-8 overflow-hidden"
            @click.stop
          >
            <button
              @click="closePopup"
              class="absolute right-4 top-4 z-10"
              aria-label="Close modal"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.1943 2.41714C15.6393 1.97216 15.6393 1.2507 15.1943 0.805714C14.7493 0.360734 14.0278 0.360734 13.5829 0.805714L8 6.38857L2.41714 0.805714C1.97216 0.360734 1.2507 0.360734 0.805714 0.805714C0.360734 1.2507 0.360734 1.97216 0.805714 2.41714L6.38857 8L0.805714 13.5829C0.360734 14.0278 0.360734 14.7493 0.805714 15.1943C1.2507 15.6393 1.97216 15.6393 2.41714 15.1943L8 9.61143L13.5829 15.1943C14.0278 15.6393 14.7493 15.6393 15.1943 15.1943C15.6393 14.7493 15.6393 14.0278 15.1943 13.5829L9.61143 8L15.1943 2.41714Z" fill="currentColor"/>
              </svg>
            </button>

            <header class="text-center mb-6">
              <h2 class="text-2xl font-bold">{{ selectedLaunch.name }}</h2>
            </header>

            <div class="space-y-6">
              <div v-if="selectedLaunch.links.patch.small" class="text-center">
                <img
                  :src="selectedLaunch.links.patch.small"
                  alt="Mission Patch"
                  class="w-32 h-32 object-cover mx-auto rounded-full shadow-md"
                />
              </div>

              <!-- launch detail -->
              <div class="space-y-4">
                <p class="flex items-center border-b border-gray-200 pb-3">
                  <span class="font-medium w-24">Date :</span>
                  <span>{{ formatDate(selectedLaunch.date_utc) }}</span>
                </p>
                <p class="flex items-start border-b border-gray-200 pb-3">
                  <span class="font-medium w-24">Détails :</span>
                  <span class="flex-1">{{ selectedLaunch.details || 'Non disponible' }}</span>
                </p>
                <p class="flex items-center border-b border-gray-200 pb-3">
                  <span class="font-medium w-24">Lieu :</span>
                  <span>{{ selectedLaunch.launchpad }}</span>
                </p>
                <p class="flex items-center border-b border-gray-200 pb-3">
                  <span class="font-medium w-24">Article :</span>
                  <a
                    v-if="selectedLaunch.links.article"
                    :href="selectedLaunch.links.article"
                    target="_blank"
                    class="text-blue-600 hover:text-blue-800 underline"
                  >
                    Voir l'article
                  </a>
                  <span v-else>Non disponible</span>
                </p>
                <p class="flex items-start border-b border-gray-200 pb-3">
                  <span class="font-medium w-24">Clients :</span>
                  <span>{{ selectedLaunch.payloads.map((p: any) => p.customers).flat().join(', ') || 'Non disponible' }}</span>
                </p>
              </div>

              <!-- video -->
              <div class="space-y-4">
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    v-model="showVideo" 
                    class="w-4 h-4 border-gray-300 rounded text-black focus:ring-black"
                  />
                  <span>Afficher la vidéo YouTube</span>
                </label>

                <Transition
                  enter-active-class="transition-all duration-300 ease-out"
                  enter-from-class="opacity-0 transform -translate-y-4"
                  enter-to-class="opacity-100 transform translate-y-0"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                >
                  <div v-if="showVideo">
                    <iframe
                      v-if="selectedLaunch.links.youtube_id"
                      :src="`https://www.youtube.com/embed/${selectedLaunch.links.youtube_id}`"
                      frameborder="0"
                      allowfullscreen
                      class="w-full h-64 rounded"
                    ></iframe>
                    <p v-else class="text-center text-gray-600">
                      Aucune vidéo disponible pour ce lancement.
                    </p>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { getNextLaunch, getLastLaunches } from './services/spacexService';

export default defineComponent({
  name: 'App',
  setup() {
    const nextLaunch = ref<any>(null);
    const lastLaunches = ref<any[]>([]);
    const filteredLaunches = ref<any[]>([]);
    const countdown = ref<string>('Calcul en cours...');
    const isPopupOpen = ref<boolean>(false);
    const selectedLaunch = ref<any>(null);
    const showVideo = ref<boolean>(false);

    const calculateCountdown = (launchDate: string) => {
      const launchTime = new Date(launchDate).getTime();
      const now = new Date().getTime();
      const diffInSeconds = Math.max(0, Math.floor((launchTime - now) / 1000));
      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const seconds = diffInSeconds % 60;
      return `${hours}h ${minutes}m ${seconds}s`;
    };

    const startCountdown = (launchDate: string) => {
      setInterval(() => {
        countdown.value = calculateCountdown(launchDate);
      }, 1000);
    };

    onMounted(async () => {
      try {
        nextLaunch.value = await getNextLaunch();
        if (nextLaunch.value) {
          startCountdown(nextLaunch.value.date_utc);
        }
        lastLaunches.value = await getLastLaunches();
        filteredLaunches.value = lastLaunches.value;
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    });

    const openPopup = (launch: any) => {
      selectedLaunch.value = launch;
      isPopupOpen.value = true;
      showVideo.value = false;
    };

    const closePopup = () => {
      isPopupOpen.value = false;
      setTimeout(() => {
        selectedLaunch.value = null;
        showVideo.value = false;
      }, 200);
    };

    const formatDate = (date: string): string => {
      return new Date(date).toLocaleDateString('fr-FR');
    };

    return {
      nextLaunch,
      lastLaunches,
      filteredLaunches,
      countdown,
      isPopupOpen,
      selectedLaunch,
      openPopup,
      closePopup,
      formatDate,
      showVideo,
    };
  },
});
</script>

<style>

.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
