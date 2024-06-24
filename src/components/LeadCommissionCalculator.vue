<template>
  <div class="container">
    <h1>引流提成计算器</h1>
    <form @submit.prevent="calculateCommission">
      <div class="input-group">
        <label for="wholesale_price">批发价格</label>
        <input type="number" v-model.number="wholesale_price" id="wholesale_price" />
      </div>
      <div class="input-group">
        <label for="sale_price">成交价格</label>
        <input type="number" v-model.number="sale_price" id="sale_price" />
      </div>
      <div class="input-group">
        <label for="commission_rate_wholesale">批发价格提成比例 (%)</label>
        <input type="number" v-model.number="commission_rate_wholesale" id="commission_rate_wholesale" />
      </div>
      <div class="input-group">
        <label for="commission_rate_above_wholesale">高于批发价格的提成比例 (%)</label>
        <input type="number" v-model.number="commission_rate_above_wholesale" id="commission_rate_above_wholesale" />
      </div>
      <div class="input-group">
        <label for="decrement_length">下降步长</label>
        <input type="number" v-model.number="decrement_length" id="decrement_length" />
      </div>
      <div class="input-group">
        <label for="decrement_rate">下降比例 (%)</label>
        <input type="number" v-model.number="decrement_rate" id="decrement_rate" />
      </div>
      <div class="input-group">
        <label for="minimum_price">最低价格</label>
        <input type="number" v-model.number="minimum_price" id="minimum_price" />
      </div>
      <button type="submit" class="calculate-btn">计算提成</button>
    </form>
    <div v-if="commission !== null" class="result">
      <h3>提成: {{ commission.toFixed(2) }} 元</h3>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: "LeadCommissionCalculator",
  setup() {
    const wholesale_price = ref(0);
    const sale_price = ref(0);
    const commission_rate_wholesale = ref(5);
    const commission_rate_above_wholesale = ref(20);
    const decrement_length = ref(1000);
    const decrement_rate = ref(1);
    const minimum_price = ref(0);
    const commission = ref(null);

    const calculateCommission = () => {
      let commissionValue = 0;
      const wholesalePrice = wholesale_price.value;
      const salePrice = sale_price.value;
      const commissionRateWholesale = commission_rate_wholesale.value;
      const commissionRateAboveWholesale = commission_rate_above_wholesale.value;
      const decrementLength = decrement_length.value;
      const decrementRate = decrement_rate.value;
      const minimumPrice = minimum_price.value;

      if (salePrice >= wholesalePrice) {
        commissionValue = wholesalePrice * (commissionRateWholesale / 100);
        if (salePrice > wholesalePrice) {
          commissionValue += (salePrice - wholesalePrice) * (commissionRateAboveWholesale / 100);
        }
      } else {
        let effectiveRate = commissionRateWholesale;
        let priceDifference = wholesalePrice - salePrice;
        let steps = Math.floor(priceDifference / decrementLength);
        
        effectiveRate -= steps * decrementRate;
        if (effectiveRate < 0) effectiveRate = 0;
        
        if (salePrice < minimumPrice) {
          commissionValue = minimumPrice * (effectiveRate / 100);
        } else {
          commissionValue = salePrice * (effectiveRate / 100);
        }
      }

      commission.value = commissionValue;
    };

    return {
      wholesale_price,
      sale_price,
      commission_rate_wholesale,
      commission_rate_above_wholesale,
      decrement_length,
      decrement_rate,
      minimum_price,
      commission,
      calculateCommission
    };
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
h1 {
  text-align: center;
  color: #333;
}
.input-group {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 10px;
  margin-bottom: 15px;
}
.calculate-btn {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}
.calculate-btn:hover {
  background-color: #45a049;
}
.result {
  text-align: center;
  margin-top: 20px;
}
</style>
