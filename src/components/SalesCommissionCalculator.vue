<template>
  <div class="container">
    <h1>销售工资计算器</h1>
    <div class="form-group">
      <label>请选择员工类型:</label>
      <div class="radio-group">
        <input type="radio" id="probation" value="probation" v-model="employeeType" @change="updateForm">
        <label for="probation">试用期员工</label>
        <input type="radio" id="regular" value="regular" v-model="employeeType" @change="updateForm">
        <label for="regular">正式员工</label>
      </div>
    </div>
    <div class="form-group">
      <label for="performanceMax">绩效工资满分:</label>
      <input id="performanceMax" v-model.number="performanceMax" type="number">
    </div>
    <div class="form-group" v-for="(field, index) in commonFields" :key="index">
      <label :for="field.id">{{ field.label }}</label>
      <input :id="field.id" v-model.number="formData[field.id]" type="number">
    </div>
    <div v-if="employeeType === 'probation'">
      <div class="form-group" v-for="(field, index) in probationFields" :key="index">
        <label :for="field.id">{{ field.label }}</label>
        <input :id="field.id" v-model.number="formData[field.id]" type="number">
      </div>
    </div>
    <div v-else-if="employeeType === 'regular'">
      <div class="form-group" v-for="(field, index) in regularFields" :key="index">
        <label :for="field.id">{{ field.label }}</label>
        <input :id="field.id" v-model.number="formData[field.id]" type="number">
      </div>
    </div>
    <div class="form-group" v-if="performanceScore !== null">
      <label for="performanceScore">绩效分数:</label>
      <input id="performanceScore" v-model.number="performanceScore" type="number" readonly>
    </div>
    <div class="form-group" v-if="actualPerformanceSalary !== null">
      <label for="actualPerformanceSalary">实际绩效工资:</label>
      <input id="actualPerformanceSalary" v-model.number="actualPerformanceSalary" type="number" readonly>
    </div>
    <button class="calculate-btn" @click="calculateSalary">计算工资</button>
    <div class="result" v-if="totalSalary !== null">
      <h2>最终工资: {{ totalSalary.toFixed(2) }}元</h2>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue';

export default {
  setup() {
    const employeeType = ref('');
    const performanceMax = ref(300);
    const formData = reactive({
      basicSalary: 2100,
      positionSalary: 1200,
      fullAttendanceBonus: 100,
      transportationSubsidy: 100,
      mealSubsidy: 400,
      phoneSubsidy: 100,
      workingDays: 22,
      newClients: 0,
      examScore: 0,
      inquiries: 0,
      platformPosts: 0,
      salesPerformance: 0,
      responseRate: 0
    });
    const totalSalary = ref(null);
    const performanceScore = ref(null);
    const actualPerformanceSalary = ref(null);

    const commonFields = computed(() => [
      { id: 'basicSalary', label: '基本工资:' },
      { id: 'positionSalary', label: '岗位工资:' },
      { id: 'fullAttendanceBonus', label: '全勤奖:' },
      { id: 'transportationSubsidy', label: '交通补贴:' },
      { id: 'mealSubsidy', label: '餐补:' },
      { id: 'phoneSubsidy', label: '话费补贴:' },
      { id: 'workingDays', label: '工作天数:' }
    ]);

    const probationFields = computed(() => [
      { id: 'newClients', label: '新客户开发数目:' },
      { id: 'examScore', label: '专业知识考试得分:' },
      { id: 'inquiries', label: '有效询盘数量:' },
      { id: 'platformPosts', label: '平台信息发布数量:' },
      { id: 'responseRate', label: '及时回复率(%):' }
    ]);

    const regularFields = computed(() => [
      { id: 'newClients', label: '新客户开发数目:' },
      { id: 'salesPerformance', label: '销售业绩达成率(%):' },
      { id: 'inquiries', label: '有效询盘数量:' },
      { id: 'platformPosts', label: '平台信息发布数量:' },
      { id: 'responseRate', label: '及时回复率(%):' }
    ]);

    const updateForm = () => {
      if (employeeType.value === 'probation') {
        performanceMax.value = 300;
      } else if (employeeType.value === 'regular') {
        performanceMax.value = 1000;
      }
    };

    const calculateSalary = () => {
      try {
        let { basicSalary, positionSalary, fullAttendanceBonus, transportationSubsidy, mealSubsidy, phoneSubsidy, workingDays, newClients, examScore, inquiries, platformPosts, salesPerformance, responseRate } = formData;

        mealSubsidy = (400 / 22) * workingDays;

        if (workingDays < 22) {
          fullAttendanceBonus = 0;
        }

        let performanceScoreValue = 0;

        if (employeeType.value === 'probation') {
          performanceScoreValue += Math.max(0, 20 - (2 - newClients) * 10);
          if (examScore >= 95) {
            performanceScoreValue += 30;
          } else if (examScore >= 90) {
            performanceScoreValue += 20;
          } else if (examScore >= 85) {
            performanceScoreValue += 10;
          }
          performanceScoreValue += Math.max(0, 20 - (15 - inquiries) * 1.5);
          performanceScoreValue += Math.max(0, 10 - Math.max(0, (75 - responseRate)));
          performanceScoreValue += Math.max(0, 20 - (32 - platformPosts));
          if (newClients > 2) {
            performanceScoreValue += Math.min(10, (newClients - 2) * 5);
          }
          if (inquiries > 15) {
            performanceScoreValue += Math.min(10, (inquiries - 15) * 2);
          }
        } else if (employeeType.value === 'regular') {
          performanceScoreValue += Math.max(0, 20 - (2 - newClients) * 10);
          if (salesPerformance >= 95) {
            performanceScoreValue += 30;
          } else if (salesPerformance >= 65) {
            performanceScoreValue += Math.max(0, 30 - (95 - salesPerformance));
          }
          performanceScoreValue += Math.max(0, 20 - (15 - inquiries) * 1.5);
          performanceScoreValue += Math.max(0, 10 - Math.max(0, (75 - responseRate)));
          performanceScoreValue += Math.max(0, 20 - (32 - platformPosts));
          if (newClients > 2) {
            performanceScoreValue += Math.min(10, (newClients - 2) * 5);
          }
          if (inquiries > 15) {
            performanceScoreValue += Math.min(10, (inquiries - 15) * 2);
          }
        }

        performanceScore.value = performanceScoreValue; 

        let performanceSalary;
        if (performanceScoreValue < 50) {
          performanceSalary = 0;
        } else if (performanceScoreValue < 60) {
          performanceSalary = 0.3 * performanceMax.value;
        } else if (performanceScoreValue < 70) {
          performanceSalary = 0.5 * performanceMax.value;
        } else if (performanceScoreValue < 85) {
          performanceSalary = 0.6 * performanceMax.value;
        } else if (performanceScoreValue < 90) {
          performanceSalary = 0.8 * performanceMax.value;
        } else if (performanceScoreValue < 95) {
          performanceSalary = 1.0 * performanceMax.value;
        } else if (performanceScoreValue < 100) {
          performanceSalary = 1.1 * performanceMax.value;
        } else if (performanceScoreValue < 110) {
          performanceSalary = 1.2 * performanceMax.value;
        } else {
          performanceSalary = 1.3 * performanceMax.value;
        }

        actualPerformanceSalary.value = performanceSalary;
        totalSalary.value = basicSalary + positionSalary + fullAttendanceBonus + transportationSubsidy + mealSubsidy + phoneSubsidy + performanceSalary;
      } catch (error) {
        alert("请输入有效的数字");
      }
    };

    return {
      employeeType,
      performanceMax,
      formData,
      totalSalary,
      performanceScore,
      actualPerformanceSalary,
      commonFields,
      probationFields,
      regularFields,
      updateForm,
      calculateSalary
    };
  }
};
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 20px auto;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
h1 {
  text-align: center;
  color: #333;
  font-size: 1.5em;
}
.form-group {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 5px;
  margin-bottom: 10px;
}
.radio-group {
  display: flex;
  align-items: center;
}
.radio-group label {
  margin-left: 5px;
  margin-right: 10px;
}
button.calculate-btn {
  display: block;
  width: 100%;
  padding: 8px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
}
button.calculate-btn:hover {
  background-color: #45a049;
}
.result {
  text-align: center;
  margin-top: 10px;
}
</style>
