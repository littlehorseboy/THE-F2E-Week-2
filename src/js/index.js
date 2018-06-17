const vm = new Vue({
  el: '#travelPage',
  data: {
    travelInfos: [],
    locationSelected: '',
    filter_Name: '',
    countOfPage: 5,
    currPage: 1,
  },
  computed: {
    filteredTravelInfos() {
      // 如果 filter_name 有內容，回傳過濾後的資料，否則將原本的 rows 回傳。
      return (this.filter_Name.trim() !== '') ?
        this.travelInfos.filter((travelInfo) => {
          return travelInfo.Name.indexOf(this.filter_Name) > -1;
        }) :
        this.travelInfos;
    },

    // 
    pageStart() {
      return (this.currPage - 1) * this.countOfPage;
    },
    // 
    totalPage() {
      return Math.ceil(this.travelInfos.length / this.countOfPage);
    },

    // 下拉選單內容建構
    locationSelects() {
      const locationSelects = [];

      this.travelInfos.forEach((travelInfo) => {
        locationSelects.push(travelInfo.Zone);
      });

      const distinctLocationSelects = locationSelects.filter(function (value, index, self) {
        return self.indexOf(value) === index;
      });

      return distinctLocationSelects;
    },
  },
  methods: {
    setPage(idx) {
      if (idx <= 0 || idx > this.totalPage) {
        return;
      }
      this.currPage = idx;
    },
  },
  created() {
    const self = this;
    axios.get('https://data.kcg.gov.tw/api/action/datastore_search', {
      params: {
        resource_id: '92290ee5-6e61-456f-80c0-249eae2fcc97',
      },
    })
      .then(function (response) {
        self.travelInfos = response.data.result.records;
      })
      .catch(function (error) {
        console.log(error);
      });
  },
});
