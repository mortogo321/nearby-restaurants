<script setup>
import { reactive } from "vue";
import axios from "axios";
import { Head, Link } from "@inertiajs/inertia-vue3";
import {
    ArrowPathIcon,
    GlobeAltIcon,
    HomeIcon,
    MagnifyingGlassIcon,
} from "@heroicons/vue/24/solid";

const center = reactive({
    lat: 13.8235283,
    lng: 100.5081204,
});
const location = reactive({
    lat: 13.8235283,
    lng: 100.5081204,
    places: [],
});
const status = reactive({ loading: false, search: false });

const enableLocation = () => {
    status.loading = true;
    navigator.geolocation.getCurrentPosition(
        (position) => {
            status.loading = false;
            center.lat = position.coords.latitude;
            center.lng = position.coords.longitude;
            location.lat = position.coords.latitude;
            location.lng = position.coords.longitude;
            location.places = [];
        },
        (error) => {
            status.loading = false;
            console.log("Error getting location");
        }
    );
};

const findNearBy = async () => {
    const params = `lat=${location.lat}&lng=${location.lng}`;

    status.search = true;

    const res = await axios.get("/api/nearby?" + params);

    location.places = res.data.results || [];
    status.search = false;
};

const setCenter = (location) => {
    center.lat = location.lat;
    center.lng = location.lng;
};
</script>

<template>
    <Head title="Restaurants" />

    <section class="text-gray-600 body-font relative h-screen">
        <div
            class="absolute top-4 right-4 z-10 w-32 h-10 bg-white rounded-lg flex justify-center items-center"
        >
            <Link
                :href="route('home')"
                class="text-indigo-500 flex justify-center items-center gap-2"
            >
                <HomeIcon class="h-6 w-6" />
                Back
            </Link>
        </div>

        <div class="absolute inset-0 bg-gray-300">
            <GMapMap
                :center="center"
                :zoom="14"
                map-type-id="terrain"
                class="h-screen w-full"
            >
                <!-- <GMapCluster>
                    <GMapMarker
                        v-for="m in location.places"
                        :key="m.place_id"
                        :position="m.geometry.location"
                        :clickable="true"
                        :draggable="true"
                        @click="center = m.geometry.location"
                    />
                </GMapCluster> -->
            </GMapMap>
        </div>
        <div class="container px-5 py-24 mx-auto flex">
            <div
                class="lg:w-1/3 md:w-1/2 bg-white bg-opacity-90 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md"
            >
                <h2
                    class="text-gray-900 text-lg mb-1 font-bold title-font flex justify-between items-center"
                >
                    <span>Nearby Restaurants</span>
                    <span class="text-base font-light">(5KM range)</span>
                </h2>

                <p class="">Your location</p>
                <div class="mb-4 flex justify-between items-center">
                    <span id="position" class="font-bold">
                        {{ location.lat }}, {{ location.lng }}
                    </span>
                    <button class="text-indigo-500" @click="enableLocation()">
                        <GlobeAltIcon
                            class="h-6 w-6"
                            :class="{ hidden: status.loading }"
                        />
                        <ArrowPathIcon
                            class="h-6 w-6 animate-spin"
                            :class="{ hidden: !status.loading }"
                        />
                    </button>
                </div>
                <button
                    class="text-white bg-indigo-500 bg-opacity-90 border-0 mb-4 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg flex justify-center items-center gap-2"
                    @click="findNearBy()"
                    :disabled="status.search"
                >
                    <MagnifyingGlassIcon
                        class="h-6 w-6"
                        :class="{ hidden: status.search }"
                    />
                    <ArrowPathIcon
                        class="h-6 w-6 animate-spin"
                        :class="{ hidden: !status.search }"
                    />
                    Search
                </button>
                <div class="relative mb-4">
                    <p class="text-sm text-right">
                        Found:
                        <span class="text-indigo-500 font-bold">
                            {{ location.places.length.toLocaleString() }}
                        </span>
                    </p>
                    <ul class="list-none px-4 max-h-80 overflow-y-scroll">
                        <li
                            class="border-b border-gray-200 py-2 hover:text-indigo-500 cursor-pointer"
                            v-for="item in location.places"
                            :key="item.place_id"
                            @click="setCenter(item.geometry.location)"
                        >
                            {{ item.name }}
                        </li>
                    </ul>
                </div>

                <p class="text-xs text-gray-500 mt-3">
                    Demo by:
                    <a
                        href="https://github.com/mortogo321"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="hover:underline"
                        >Mor.</a
                    >
                </p>
            </div>
        </div>
    </section>
</template>
