<script setup lang="ts">
import Api from "@/api";
import type {Ref} from "vue";
import {computed, onMounted, reactive, ref, watch} from "vue";
import VueSelect from "vue-select";
import {format, parse} from "date-fns";

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

type StringMap = {
  [k: string]: string
};

type TickerMap = {
  [t: string]: Ticker
};

const tickersMap = computed<TickerMap>(
    () => {
      const map : TickerMap = {};
      if (!tickers?.value?.length) {
        return map;
      }

      for (const ticker of tickers.value) {
        map[ticker.ticker] = ticker;
      }

      return map;
    }
);

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
        ...filter,
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
 * Filtering
 */

type APIFilter = {
  [field: string]: any
};

const filter = reactive<APIFilter>({});
const quotesDateRange = ref<Date[]|null>([]);

watch(
    filter,
    async () => {
      await fetchQuotes();
    }
);

function onDateRangeUpdate(dateRange: Date[]|null) {

  quotesDateRange.value = dateRange;

  if (!dateRange) {
    filter.date_min = undefined;
    filter.date_max = undefined;
    return;
  }

  filter.date_min = format(dateRange[0], "uuuu-MM-dd");
  filter.date_max = format(dateRange[1], "uuuu-MM-dd");
}


/**
 * Pagination
 */

const page = ref(1);
const limit = ref(50);
const totalPages = ref(1);

const pageList = computed<number[]>(
    () => {

      const list = new Array(totalPages.value);
      for (let i = 1; i <= totalPages.value; i++) {
        list[i - 1] = i;
      }

      return list;
    }
);

watch(page, async (newVal: number) => {
  if (newVal >= 1 && newVal <= totalPages.value) {
    await fetchQuotes();
  }
});

function setPage(n: number) {
  if (n >= 1 && n <= totalPages.value) {
    page.value = n;
  }
}


/**
 * Formatting
 */

// Коды валют в ISO 4217
const currencyLocales : StringMap = {
  USD: 'en-US',
  RUR: 'ru-RU',
};

// Коды валют в ISO 4217
const currencyCodes : StringMap = {
  'en-US': 'USD',
  'ru-RU': 'RUB',
};

function formatPrice(tickerQuote: Quote) {

  const ticker = tickersMap.value[tickerQuote.ticker];

  const locale = currencyLocales[ticker.currency];
  const currencyCode = currencyCodes[locale];

  const options = {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  };

  return new Intl.NumberFormat(locale, options).format(tickerQuote.price);
}

function formatDate(date: Date|number|string) {

  if (typeof date === "string") {
    date = Date.parse(date);
  }

  return format(date, "uuuu/MM/dd");
}

</script>

<template>
<div>
  <label>Фильтровать по тикеру:</label>
  <VueSelect
      v-model="filter.ticker"
      multiple
      :options="tickers"
      :reduce="ticker => ticker.ticker"
      label="name"
  >
    <template #option="ticker">
      <span> [{{ ticker.ticker }}] {{ ticker.name }} </span>
    </template>
    <template #selected-option="ticker">
      <span>{{ ticker.ticker }}</span>
    </template>
  </VueSelect>

  <label>Фильтровать по дате:</label>
  <Datepicker
      :model-value="quotesDateRange"
      @update:modelValue="onDateRangeUpdate"
      :range="true"
      :auto-apply="true"
      :enable-time-picker="false"
      format="yyyy/MM/dd"
  >
  </Datepicker>

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
        {{ formatDate(quote.date) }}
      </td>
      <td>
        {{ formatPrice(quote) }}
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

<style>
@import 'vue-select/dist/vue-select.css';
</style>