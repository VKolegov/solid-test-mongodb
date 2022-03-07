<script setup lang="ts">
import Api from "@/api";
import type {Ref} from "vue";
import {computed, onMounted, ref, watch} from "vue";

/**
 * Tickers
 */

const tickers: Ref<Ticker[]> = ref([]);
const tickersAPI = new Api<Ticker>("http://localhost:80/api/v1/tickers");

async function fetchTickers() {
  const response = await tickersAPI.index(
      {
        limit: 40
      }
  );

  tickers.value = response.entities;
}

/**
 * Quotes
 */

const quotes: Ref<Quote[]> = ref([]);
const quotesAPI = new Api<Quote>("http://localhost:80/api/v1/quotes");

async function fetchQuotes() {
  const response = await quotesAPI.index(
      {
        limit: limit.value,
        page: page.value,
      }
  );

  quotes.value = response.entities;

  totalPages.value = Math.ceil(response.total / limit.value);
}

/**
 * Hooks
 */
onMounted(() => {
  fetchTickers();
  fetchQuotes();
});

/**
 * Pagination
 */

const page = ref(3);
const limit = ref(50);
const totalPages = ref(1);

const pageList = computed<number[]>(
    () => {

      const list = new Array(totalPages.value);
      for (let i = 1; i <= totalPages.value; i++) {
        list[i-1] = i;
      }

      return list;
    }
);

watch(page, async(newVal: number) => {
  if (newVal >= 1 && newVal <= totalPages.value) {
    await fetchQuotes();
  }
});

function setPage(n: number) {
  if (n >= 1 && n <= totalPages.value) {
    page.value = n;
  }
}

</script>

<template>
<div>
  <div v-for="ticker in tickers">
    <span>[{{ ticker.ticker }}] {{ ticker.name }}</span>
  </div>

  <table class="table table-responsive-lg table-striped">
    <thead>
    <tr>
      <th>Тикер</th>
      <th>Дата</th>
      <th>Цена</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="quote in quotes">
      <td>
        {{ quote.ticker }}
      </td>
      <td>
        {{ quote.date }}
      </td>
      <td>
        {{ quote.price }}
      </td>
    </tr>
    </tbody>
  </table>

  <nav aria-label="Navigation">
    <ul class="pagination pagination-sm">
      <li class="page-item" :class="{'disabled': page === 1}">
        <button class="page-link" @click="page > 1 ? page-- : undefined">Назад</button>
      </li>

      <li
          class="page-item"
          :class="{'active': pageN === page}"
          v-for="pageN in pageList"
      >
        <button
            class="page-link"
            @click="setPage(pageN)"
        >
          {{ pageN }}
        </button>
      </li>

      <li class="page-item" :class="{'disabled': page === totalPages}">
        <button class="page-link" @click="page < totalPages ? page++ : undefined">Вперёд</button>
      </li>
    </ul>
  </nav>

</div>
</template>